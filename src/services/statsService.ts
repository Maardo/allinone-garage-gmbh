
import { supabase } from "@/integrations/supabase/client";
import { Stats } from "@/lib/overview/types";

// Reset stats for the current user
export const resetStats = async (): Promise<void> => {
  // Get current user ID
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;
  
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Check if the user has any stats records
  const { data: existingStats, error: checkError } = await supabase
    .from('stats')
    .select('id')
    .eq('user_id', userId)
    .limit(1);
    
  if (checkError) {
    console.error('Error checking stats:', checkError);
    throw checkError;
  }
  
  // If stats exist, reset them
  if (existingStats && existingStats.length > 0) {
    const defaultStats = {
      today_appointments: 0,
      week_appointments: 0,
      total_customers: 0,
      completed_jobs: 0
    };
    
    const { error: updateError } = await supabase
      .from('stats')
      .update(defaultStats)
      .eq('user_id', userId);
      
    if (updateError) {
      console.error('Error resetting stats:', updateError);
      throw updateError;
    }
  }
};

// Fetch stats for the current user
export const fetchStats = async (): Promise<Stats> => {
  // Get current user ID
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;
  
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Check if the user has any stats records
  const { data: existingStats, error: checkError } = await supabase
    .from('stats')
    .select('*')
    .eq('user_id', userId)
    .limit(1);
    
  if (checkError) {
    console.error('Error checking stats:', checkError);
    throw checkError;
  }
  
  // If no stats exist, create a default record
  if (!existingStats || existingStats.length === 0) {
    const defaultStats = {
      today_appointments: 0,
      week_appointments: 0,
      total_customers: 0,
      completed_jobs: 0,
      user_id: userId
    };
    
    const { data: newStats, error: createError } = await supabase
      .from('stats')
      .insert(defaultStats)
      .select()
      .single();
      
    if (createError) {
      console.error('Error creating stats:', createError);
      throw createError;
    }
    
    return {
      todayAppointments: newStats.today_appointments,
      weekAppointments: newStats.week_appointments,
      totalCustomers: newStats.total_customers,
      completedJobs: newStats.completed_jobs
    };
  }
  
  // Otherwise, return the existing stats
  const stats = existingStats[0];
  return {
    todayAppointments: stats.today_appointments,
    weekAppointments: stats.week_appointments,
    totalCustomers: stats.total_customers,
    completedJobs: stats.completed_jobs
  };
};

// Update stats for the current user
export const updateStats = async (stats: Stats): Promise<Stats> => {
  // Get current user ID
  const { data: session } = await supabase.auth.getSession();
  const userId = session?.session?.user?.id;
  
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Get the stats record ID first
  const { data: existingStats, error: fetchError } = await supabase
    .from('stats')
    .select('id')
    .eq('user_id', userId)
    .limit(1);
    
  if (fetchError) {
    console.error('Error fetching stats for update:', fetchError);
    throw fetchError;
  }
  
  const statsId = existingStats?.[0]?.id;
  
  if (!statsId) {
    console.error('No stats record found for update');
    throw new Error('Stats record not found');
  }
  
  const dbStats = {
    today_appointments: stats.todayAppointments,
    week_appointments: stats.weekAppointments,
    total_customers: stats.totalCustomers,
    completed_jobs: stats.completedJobs,
    user_id: userId
  };
  
  const { data: updatedStats, error } = await supabase
    .from('stats')
    .update(dbStats)
    .eq('id', statsId)
    .select()
    .single();
    
  if (error) {
    console.error('Error updating stats:', error);
    throw error;
  }
  
  return {
    todayAppointments: updatedStats.today_appointments,
    weekAppointments: updatedStats.week_appointments,
    totalCustomers: updatedStats.total_customers,
    completedJobs: updatedStats.completed_jobs
  };
};
