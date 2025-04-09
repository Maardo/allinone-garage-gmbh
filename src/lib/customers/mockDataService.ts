
import { Customer } from "@/lib/types";
import { supabase } from "@/integrations/supabase/client";

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
