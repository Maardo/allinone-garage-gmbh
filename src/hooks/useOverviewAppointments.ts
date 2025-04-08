
import { useState, useEffect } from 'react';
import { addDays, addMonths, isAfter, isBefore } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { ServiceType } from '@/lib/serviceTypes';

// Define the appointment type specifically for this component
export interface Appointment {
  id: number;
  date: Date;
  vehicleModel: string;
  serviceType: ServiceType;
  isCompleted?: boolean;
  customerEmail?: string;
  customerName?: string;
  licensePlate?: string;
}

// Define the grouped appointments type
export interface GroupedAppointments {
  [key: string]: Appointment[];
}

type TimeViewType = "week" | "month";

export interface Stats {
  todayAppointments: number;
  weekAppointments: number;
  totalCustomers: number;
  completedJobs: number;
}

export function useOverviewAppointments() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [timeView, setTimeView] = useState<TimeViewType>("week");
  
  const [stats, setStats] = useState<Stats>({
    todayAppointments: 3,
    weekAppointments: 15,
    totalCustomers: 275,
    completedJobs: 843
  });
  
  // Type-safe upcomingJobs with ServiceType
  const [upcomingJobs, setUpcomingJobs] = useState<Appointment[]>([
    { 
      id: 1,
      date: new Date(2025, 3, 8, 9, 0), // April 8, 2025, 09:00
      vehicleModel: "Volvo XC60",
      serviceType: 1 as ServiceType,
      isCompleted: false,
      customerEmail: "johan@example.com",
      customerName: "Johan Andersson",
      licensePlate: "ABC123"
    },
    { 
      id: 2,
      date: new Date(2025, 3, 9, 13, 30), // April 9, 2025, 13:30
      vehicleModel: "BMW X5",
      serviceType: 2 as ServiceType,
      isCompleted: false,
      customerEmail: "customer@example.com",
      customerName: "Maria Johansson",
      licensePlate: "DEF456"
    },
    { 
      id: 3,
      date: new Date(2025, 3, 10, 10, 0), // April 10, 2025, 10:00
      vehicleModel: "Audi A4",
      serviceType: 1 as ServiceType,
      isCompleted: false,
      customerEmail: "customer2@example.com",
      customerName: "Erik Svensson",
      licensePlate: "GHI789"
    },
    { 
      id: 4,
      date: new Date(2025, 3, 13, 14, 0), // April 13, 2025, 14:00
      vehicleModel: "Volvo V70",
      serviceType: 2 as ServiceType,
      isCompleted: false,
      customerEmail: "customer3@example.com",
      customerName: "Anna Karlsson",
      licensePlate: "JKL012"
    },
    { 
      id: 5,
      date: new Date(2025, 3, 15, 11, 30), // April 15, 2025, 11:30
      vehicleModel: "Tesla Model 3",
      serviceType: 1 as ServiceType,
      isCompleted: false,
      customerEmail: "customer4@example.com",
      customerName: "Lars Nilsson",
      licensePlate: "MNO345"
    },
    { 
      id: 6,
      date: new Date(2025, 3, 22, 10, 0), // April 22, 2025, 10:00
      vehicleModel: "Mercedes E-Class",
      serviceType: 3 as ServiceType,
      isCompleted: false,
      customerEmail: "customer5@example.com",
      customerName: "Eva Lindberg",
      licensePlate: "PQR678"
    },
    { 
      id: 7,
      date: new Date(2025, 3, 28, 15, 30), // April 28, 2025, 15:30
      vehicleModel: "Ford Focus",
      serviceType: 4 as ServiceType,
      isCompleted: false,
      customerEmail: "customer6@example.com",
      customerName: "Peter Ekström",
      licensePlate: "STU901"
    },
    { 
      id: 8,
      date: new Date(2025, 4, 5, 9, 0), // May 5, 2025, 09:00
      vehicleModel: "Toyota RAV4",
      serviceType: 5 as ServiceType,
      isCompleted: false,
      customerEmail: "customer7@example.com",
      customerName: "Sofia Berg",
      licensePlate: "VWX234"
    }
  ]);
  
  const [filteredJobs, setFilteredJobs] = useState<Appointment[]>([]);
  
  useEffect(() => {
    const now = new Date();
    let endDate;
    
    if (timeView === "week") {
      endDate = addDays(now, 7); // One week from now
    } else {
      endDate = addMonths(now, 1); // One month from now
    }
    
    const filtered = upcomingJobs.filter(job => 
      !job.isCompleted && isAfter(job.date, now) && isBefore(job.date, endDate)
    );
    
    setFilteredJobs(filtered);
    
    // Update the stats based on the filtered appointments
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAppointments = upcomingJobs.filter(job => 
      !job.isCompleted && 
      job.date >= today && 
      job.date < tomorrow
    ).length;
    
    const weekEndDate = addDays(today, 7);
    const weekAppointments = upcomingJobs.filter(job => 
      !job.isCompleted && 
      job.date >= today && 
      job.date < weekEndDate
    ).length;
    
    setStats(prevStats => ({
      ...prevStats,
      todayAppointments,
      weekAppointments
    }));
  }, [timeView, upcomingJobs]);
  
  // Function to send email notification
  const sendEmailNotification = (appointment: Appointment) => {
    const emailTemplate = localStorage.getItem("completionEmailTemplate") || 
      "Dear customer,\n\nWe are pleased to inform you that your vehicle service has been completed. Your vehicle is now ready for pickup.\n\nThank you for choosing our services.\n\nBest regards,\nAuto Service Center";
    
    console.log(`Sending email to ${appointment.customerEmail}:`);
    console.log(`Subject: ${t('overview.appointmentCompleted')}`);
    console.log(`Body: ${emailTemplate}`);
    
    // In a real application, this would call an API to send the email
    return true;
  };

  // Handle marking an appointment as complete
  const handleMarkComplete = (appointmentId: number) => {
    // Find the appointment
    const appointment = upcomingJobs.find(job => job.id === appointmentId);
    if (!appointment) return;
    
    // Mark as complete
    setUpcomingJobs(currentJobs => 
      currentJobs.map(job => 
        job.id === appointmentId 
          ? { ...job, isCompleted: true } 
          : job
      )
    );
    
    // Update the completed jobs count in stats
    setStats(currentStats => ({
      ...currentStats,
      completedJobs: currentStats.completedJobs + 1
    }));
    
    // Send email notification if enabled
    const emailNotificationsEnabled = localStorage.getItem("emailNotifications") !== "false";
    if (emailNotificationsEnabled && appointment.customerEmail) {
      const emailSent = sendEmailNotification(appointment);
      if (emailSent) {
        toast({
          title: t('overview.appointmentCompleted'),
          description: t('overview.appointmentMarkedComplete') + 
            (emailNotificationsEnabled ? ` ${t('overview.emailSentToCustomer')}` : ''),
        });
      }
    } else {
      toast({
        title: t('overview.appointmentCompleted'),
        description: t('overview.appointmentMarkedComplete'),
      });
    }
  };

  // Function to update total customers count
  const updateTotalCustomers = (change: number) => {
    setStats(currentStats => ({
      ...currentStats,
      totalCustomers: currentStats.totalCustomers + change
    }));
  };

  return {
    timeView,
    setTimeView,
    stats,
    setStats,
    filteredJobs,
    upcomingJobs,
    handleMarkComplete,
    updateTotalCustomers
  };
}
