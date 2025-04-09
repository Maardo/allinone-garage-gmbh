
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "@/lib/overview/types";
import { ServiceType } from "@/lib/serviceTypes";

// Convert database appointment to frontend appointment
export const mapDbAppointmentToAppointment = (dbAppointment: any): Appointment => {
  return {
    id: dbAppointment.id ? parseInt(dbAppointment.id.substring(0, 8), 16) : 0,
    date: new Date(dbAppointment.date),
    vehicleModel: dbAppointment.vehicle_model,
    serviceType: parseInt(dbAppointment.service_type) as ServiceType,
    isCompleted: dbAppointment.is_completed,
    customerEmail: dbAppointment.customer_email,
    customerName: dbAppointment.customer_name,
    licensePlate: dbAppointment.license_plate
  };
};

// Convert frontend appointment to database format
export const mapAppointmentToDbFormat = (appointment: Appointment) => {
  return {
    date: appointment.date.toISOString(),
    vehicle_model: appointment.vehicleModel,
    service_type: appointment.serviceType.toString(),
    is_completed: appointment.isCompleted,
    customer_email: appointment.customerEmail,
    customer_name: appointment.customerName,
    license_plate: appointment.licensePlate
  };
};

// Reset all appointments for the current user
export const resetAppointments = async (): Promise<void> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;
  
  if (!userId) {
    throw new Error("User not authenticated");
  }
  
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('user_id', userId);
    
  if (error) {
    console.error('Error resetting appointments:', error);
    throw error;
  }
};

// Fetch all appointments for the current user
export const fetchAppointments = async (): Promise<Appointment[]> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;
  
  if (!userId) {
    throw new Error("User not authenticated");
  }
  
  const { data: dbAppointments, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: true });
    
  if (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
  
  return dbAppointments.map(mapDbAppointmentToAppointment);
};

// Create a new appointment
export const createAppointment = async (appointment: Appointment): Promise<Appointment> => {
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;
  
  if (!userId) {
    throw new Error("User not authenticated");
  }
  
  const appointmentData = {
    ...mapAppointmentToDbFormat(appointment),
    user_id: userId
  };
  
  const { data, error } = await supabase
    .from('appointments')
    .insert(appointmentData)
    .select()
    .single();
    
  if (error) {
    console.error('Error creating appointment:', error);
    throw error;
  }
  
  return mapDbAppointmentToAppointment(data);
};

// Update an appointment
export const updateAppointment = async (appointment: Appointment): Promise<Appointment> => {
  // Convert ID to string UUID
  let appointmentId: string;
  
  // Get the current user's ID
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;
  
  if (!userId) {
    throw new Error("User not authenticated");
  }
  
  if (typeof appointment.id === 'number') {
    // Find the original UUID for this appointment by querying first
    const { data: existingAppointments, error: fetchError } = await supabase
      .from('appointments')
      .select('id')
      .eq('user_id', userId)
      .limit(100);
      
    if (fetchError) {
      console.error('Error fetching appointments for update:', fetchError);
      throw fetchError;
    }
    
    // Convert the numeric ID to a hex string for comparison
    const numStr = appointment.id.toString(16).padStart(8, '0');
    
    // Find a match based on the first 8 characters of the UUID
    const foundAppointment = existingAppointments?.find(a => 
      typeof a.id === 'string' && a.id.substring(0, 8).toLowerCase() === numStr.toLowerCase()
    );
    
    if (!foundAppointment) {
      console.error('Could not find appointment with id:', appointment.id);
      throw new Error('Appointment not found');
    }
    
    appointmentId = foundAppointment.id;
  } else {
    // If it's already a string, use it directly
    appointmentId = String(appointment.id);
  }
  
  const appointmentData = {
    ...mapAppointmentToDbFormat(appointment),
    user_id: userId
  };

  const { data, error } = await supabase
    .from('appointments')
    .update(appointmentData)
    .eq('id', appointmentId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating appointment:', error);
    throw error;
  }
  
  return mapDbAppointmentToAppointment(data);
};

// Delete an appointment
export const deleteAppointment = async (appointmentId: number | string): Promise<void> => {
  // Get the current user's ID for security
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;
  
  if (!userId) {
    throw new Error("User not authenticated");
  }
  
  // If the ID is a number, first find the corresponding UUID
  let dbAppointmentId: string;
  
  if (typeof appointmentId === 'number') {
    // Find the appointment by its shortened ID
    const { data: existingAppointments, error: fetchError } = await supabase
      .from('appointments')
      .select('id')
      .eq('user_id', userId);
      
    if (fetchError) {
      console.error('Error fetching appointments for delete:', fetchError);
      throw fetchError;
    }
    
    // Convert numeric ID to hex string for comparison
    const numStr = appointmentId.toString(16).padStart(8, '0');
    
    // Find a match based on the first 8 characters of the UUID
    const foundAppointment = existingAppointments?.find(a => 
      typeof a.id === 'string' && a.id.substring(0, 8).toLowerCase() === numStr.toLowerCase()
    );
    
    if (!foundAppointment) {
      console.error('Could not find appointment with id:', appointmentId);
      throw new Error('Appointment not found');
    }
    
    dbAppointmentId = foundAppointment.id;
  } else {
    // If it's already a string, use it directly
    dbAppointmentId = appointmentId;
  }
  
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', dbAppointmentId);
    
  if (error) {
    console.error('Error deleting appointment:', error);
    throw error;
  }
};
