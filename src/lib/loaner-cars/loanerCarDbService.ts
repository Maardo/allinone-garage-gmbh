
import { supabase } from "@/integrations/supabase/client";
import { LoanerCar } from "@/lib/types";

export async function fetchLoanerCarsFromDb(userId: string): Promise<LoanerCar[]> {
  try {
    const { data, error } = await supabase
      .from('loaner_cars')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching loaner cars:', error);
      return [];
    }

    return data.map(car => ({
      id: car.id,
      name: car.name,
      license: car.license,
      isAvailable: car.is_available,
      assignedTo: car.assigned_to,
      assignedUntil: car.assigned_until ? new Date(car.assigned_until) : undefined,
      assignedFrom: car.assigned_from ? new Date(car.assigned_from) : undefined,
      appointmentId: car.appointment_id,
    }));
  } catch (error) {
    console.error('Error in fetchLoanerCarsFromDb:', error);
    return [];
  }
}

export async function addLoanerCarToDb(car: Partial<LoanerCar>, userId: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('loaner_cars')
      .insert({
        name: car.name,
        license: car.license,
        is_available: car.isAvailable ?? true,
        user_id: userId
      })
      .select('id')
      .single();

    if (error) {
      console.error('Error adding loaner car:', error);
      return null;
    }

    return data.id;
  } catch (error) {
    console.error('Error in addLoanerCarToDb:', error);
    return null;
  }
}

export async function updateLoanerCarInDb(car: LoanerCar): Promise<boolean> {
  try {
    // Validate the appointmentId if it exists (must be UUID or null)
    const appointmentId = car.appointmentId || null;
    
    console.log("Updating loaner car with data:", {
      id: car.id,
      appointmentId: appointmentId
    });
    
    // Convert Date objects to ISO strings for Supabase
    const { error } = await supabase
      .from('loaner_cars')
      .update({
        name: car.name,
        license: car.license,
        is_available: car.isAvailable,
        assigned_to: car.assignedTo,
        assigned_until: car.assignedUntil ? car.assignedUntil.toISOString() : null,
        assigned_from: car.assignedFrom ? car.assignedFrom.toISOString() : null,
        appointment_id: appointmentId
      })
      .eq('id', car.id);

    if (error) {
      console.error('Error updating loaner car:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in updateLoanerCarInDb:', error);
    return false;
  }
}

export async function deleteLoanerCarFromDb(carId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('loaner_cars')
      .delete()
      .eq('id', carId);

    if (error) {
      console.error('Error deleting loaner car:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in deleteLoanerCarFromDb:', error);
    return false;
  }
}

export async function importLoanerCarsToDb(cars: LoanerCar[], userId: string): Promise<boolean> {
  try {
    // Convert the LoanerCar objects to the format expected by the database
    // Also convert Date objects to ISO strings for Supabase
    const dbCars = cars.map(car => ({
      name: car.name,
      license: car.license,
      is_available: car.isAvailable,
      assigned_to: car.assignedTo,
      assigned_until: car.assignedUntil ? car.assignedUntil.toISOString() : null,
      assigned_from: car.assignedFrom ? car.assignedFrom.toISOString() : null,
      appointment_id: car.appointmentId,
      user_id: userId
    }));

    const { error } = await supabase
      .from('loaner_cars')
      .insert(dbCars);

    if (error) {
      console.error('Error importing loaner cars:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in importLoanerCarsToDb:', error);
    return false;
  }
}
