
import { supabase } from "@/integrations/supabase/client";
import { Appointment } from "@/lib/overview/types";
import { ServiceType } from "@/lib/serviceTypes";

// Convert database appointment to frontend appointment
export const mapDbAppointmentToAppointment = (dbAppointment: any): Appointment => {
  return {
    id: dbAppointment.id ? Number(dbAppointment.id.substring(0, 8)) : 0,
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
  // Convert UUID to string if needed
  let appointmentId: string;
  if (typeof appointment.id === 'number') {
    // Find the original UUID for this appointment by querying first
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    const { data: existingAppointments, error: fetchError } = await supabase
      .from('appointments')
      .select('id')
      .eq('user_id', userId)
      .limit(100);
      
    if (fetchError) {
      console.error('Error fetching appointments for update:', fetchError);
      throw fetchError;
    }
    
    // Find a match based on the first 8 characters of the UUID
    const numStr = appointment.id.toString(16).padStart(8, '0');
    const foundAppointment = existingAppointments.find(a => 
      typeof a.id === 'string' && a.id.startsWith(numStr)
    );
    
    if (!foundAppointment) {
      console.error('Could not find appointment with id:', appointment.id);
      throw new Error('Appointment not found');
    }
    
    appointmentId = foundAppointment.id;
  } else {
    appointmentId = appointment.id.toString();
  }

  // Get the current user's ID
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
  // If the ID is a number, first find the corresponding UUID
  let dbAppointmentId: string;
  
  if (typeof appointmentId === 'number') {
    // Get the current user's ID for security
    const { data: session } = await supabase.auth.getSession();
    const userId = session?.session?.user?.id;
    
    if (!userId) {
      throw new Error("User not authenticated");
    }
    
    // Find the appointment by its shortened ID
    const { data: existingAppointments, error: fetchError } = await supabase
      .from('appointments')
      .select('id')
      .eq('user_id', userId);
      
    if (fetchError) {
      console.error('Error fetching appointments for delete:', fetchError);
      throw fetchError;
    }
    
    // Find a match based on the first 8 characters of the UUID
    const numStr = appointmentId.toString(16).padStart(8, '0');
    const foundAppointment = existingAppointments.find(a => 
      typeof a.id === 'string' && a.id.startsWith(numStr)
    );
    
    if (!foundAppointment) {
      console.error('Could not find appointment with id:', appointmentId);
      throw new Error('Appointment not found');
    }
    
    dbAppointmentId = foundAppointment.id;
  } else {
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
