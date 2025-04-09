
import { Customer, Vehicle } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

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
