
import { Customer, Vehicle } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

// Generate a random ID for new entities (used for local operations)
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Create a new customer object
export const createCustomer = (customerData: Partial<Customer>): Customer => {
  return {
    id: generateId(),
    name: customerData.name || "",
    email: customerData.email || "",
    phone: customerData.phone || "",
    notes: customerData.notes || "",
    address: customerData.address || { street: "", zipCode: "", city: "" },
    vehicles: customerData.vehicles as Vehicle[] || []
  };
};

// Create a new vehicle object
export const createVehicle = (vehicleData: Partial<Vehicle>): Vehicle => {
  return {
    id: generateId(),
    make: vehicleData.make || "",
    model: vehicleData.model || "",
    year: vehicleData.year || new Date().getFullYear(),
    license: vehicleData.license || "",
    vin: vehicleData.vin || "",
    carId: vehicleData.carId || ""
  };
};

// Filter customers based on search term
export const filterCustomers = (customers: Customer[], searchTerm: string): Customer[] => {
  if (!searchTerm) return customers;
  
  const term = searchTerm.toLowerCase();
  
  return customers.filter(customer => 
    customer.name.toLowerCase().includes(term) ||
    customer.email?.toLowerCase().includes(term) ||
    customer.phone?.includes(searchTerm) ||
    customer.address?.street?.toLowerCase().includes(term) ||
    customer.address?.city?.toLowerCase().includes(term) ||
    customer.vehicles.some(v => 
      v.license.toLowerCase().includes(term) ||
      v.make.toLowerCase().includes(term) ||
      v.model.toLowerCase().includes(term)
    )
  );
};

// Supabase Integration Functions

// Fetch all customers from Supabase
export const fetchCustomersFromDb = async (userId: string): Promise<Customer[]> => {
  try {
    // Fetch customers for the current user
    const { data: customersData, error: customersError } = await supabase
      .from('customers')
      .select('*')
      .eq('user_id', userId);

    if (customersError) throw customersError;

    // Fetch vehicles for those customers
    const { data: vehiclesData, error: vehiclesError } = await supabase
      .from('vehicles')
      .select('*');

    if (vehiclesError) throw vehiclesError;

    // Transform the data to match our Customer type
    const customers: Customer[] = customersData.map(customer => ({
      id: customer.id,
      name: customer.name,
      email: customer.email || "",
      phone: customer.phone || "",
      notes: customer.notes || "",
      address: {
        street: customer.street || "",
        zipCode: customer.zip_code || "",
        city: customer.city || ""
      },
      vehicles: vehiclesData
        .filter(vehicle => vehicle.customer_id === customer.id)
        .map(vehicle => ({
          id: vehicle.id,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year || new Date().getFullYear(),
          license: vehicle.license,
          vin: vehicle.vin || "",
          carId: vehicle.car_id || ""
        }))
    }));

    return customers;
  } catch (error) {
    console.error('Error fetching customers:', error);
    return [];
  }
};

// Add customer to Supabase
export const addCustomerToDb = async (customer: Customer, userId: string): Promise<Customer | null> => {
  try {
    // Add customer with the user_id
    const { data: customerData, error: customerError } = await supabase
      .from('customers')
      .insert({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        notes: customer.notes,
        street: customer.address?.street,
        zip_code: customer.address?.zipCode,
        city: customer.address?.city,
        user_id: userId  // Include the user ID
      })
      .select()
      .single();

    if (customerError) throw customerError;

    // Add vehicles if any
    if (customer.vehicles.length > 0) {
      const vehiclesToInsert = customer.vehicles.map(vehicle => ({
        customer_id: customerData.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        license: vehicle.license,
        vin: vehicle.vin,
        car_id: vehicle.carId
      }));

      const { data: vehiclesData, error: vehiclesError } = await supabase
        .from('vehicles')
        .insert(vehiclesToInsert)
        .select();

      if (vehiclesError) throw vehiclesError;

      // Return the customer with vehicles
      return {
        ...customer,
        id: customerData.id,
        vehicles: vehiclesData.map(v => ({
          id: v.id,
          make: v.make,
          model: v.model,
          year: v.year || new Date().getFullYear(),
          license: v.license,
          vin: v.vin || "",
          carId: v.car_id || ""
        }))
      };
    }

    // Return customer without vehicles
    return {
      ...customer,
      id: customerData.id,
      vehicles: []
    };
  } catch (error) {
    console.error('Error adding customer:', error);
    return null;
  }
};

// Update customer in Supabase
export const updateCustomerInDb = async (customer: Customer, userId: string): Promise<boolean> => {
  try {
    // Update customer
    const { error: customerError } = await supabase
      .from('customers')
      .update({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        notes: customer.notes,
        street: customer.address?.street,
        zip_code: customer.address?.zipCode,
        city: customer.address?.city,
        user_id: userId  // Include the user ID
      })
      .eq('id', customer.id);

    if (customerError) throw customerError;

    // First delete existing vehicles
    const { error: deleteError } = await supabase
      .from('vehicles')
      .delete()
      .eq('customer_id', customer.id);

    if (deleteError) throw deleteError;

    // Then add updated vehicles if any
    if (customer.vehicles.length > 0) {
      const vehiclesToInsert = customer.vehicles.map(vehicle => ({
        customer_id: customer.id,
        make: vehicle.make,
        model: vehicle.model,
        year: vehicle.year,
        license: vehicle.license,
        vin: vehicle.vin,
        car_id: vehicle.carId
      }));

      const { error: vehiclesError } = await supabase
        .from('vehicles')
        .insert(vehiclesToInsert);

      if (vehiclesError) throw vehiclesError;
    }

    return true;
  } catch (error) {
    console.error('Error updating customer:', error);
    return false;
  }
};

// Delete customer from Supabase
export const deleteCustomerFromDb = async (customerId: string): Promise<boolean> => {
  try {
    // Delete customer (vehicles will cascade delete due to foreign key)
    const { error } = await supabase
      .from('customers')
      .delete()
      .eq('id', customerId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting customer:', error);
    return false;
  }
};

// Import mock data to Supabase (for first-time setup)
export const importMockDataToDb = async (mockCustomers: Customer[], userId: string): Promise<boolean> => {
  try {
    console.log("Importing mock data to database for user:", userId);
    
    // Process each customer
    for (const customer of mockCustomers) {
      // Add customer with the user_id
      const { data: customerData, error: customerError } = await supabase
        .from('customers')
        .insert({
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          notes: customer.notes,
          street: customer.address?.street,
          zip_code: customer.address?.zipCode,
          city: customer.address?.city,
          user_id: userId  // Include the user ID
        })
        .select()
        .single();

      if (customerError) {
        console.error('Error adding mock customer:', customerError);
        continue; // Skip to next customer on error
      }

      // Add vehicles for this customer
      if (customer.vehicles.length > 0) {
        const vehiclesToInsert = customer.vehicles.map(vehicle => ({
          customer_id: customerData.id,
          make: vehicle.make,
          model: vehicle.model,
          year: vehicle.year,
          license: vehicle.license,
          vin: vehicle.vin,
          car_id: vehicle.carId
        }));

        const { error: vehiclesError } = await supabase
          .from('vehicles')
          .insert(vehiclesToInsert);

        if (vehiclesError) {
          console.error('Error adding mock vehicles:', vehiclesError);
          // Continue anyway as the customer was added
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error importing mock data:', error);
    return false;
  }
};
