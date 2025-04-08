
import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/context/LanguageContext";
import { format, addDays, addMonths, isAfter, isBefore } from "date-fns";
import { sv, de, enUS } from "date-fns/locale";
import { SERVICE_TYPES, ServiceType } from "@/lib/serviceTypes";
import { StatsCards } from "@/components/overview/StatsCards";
import { UpcomingAppointments } from "@/components/overview/UpcomingAppointments";
import { AppointmentsChart } from "@/components/overview/AppointmentsChart";
import { useToast } from "@/hooks/use-toast";

const dateLocales = {
  sv: sv,
  de: de,
  en: enUS,
};

// Define the Appointment type
interface Appointment {
  id: number;
  date: Date;
  vehicleModel: string;
  serviceType: ServiceType;
  isCompleted?: boolean;
  customerEmail?: string;
}

// Define the grouped appointments type
interface GroupedAppointments {
  [key: string]: Appointment[];
}

export default function Overview() {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [timeView, setTimeView] = useState<"week" | "month">("week");
  
  const stats = {
    todayAppointments: 3,
    weekAppointments: 15,
    totalCustomers: 275,
    completedJobs: 843
  };
  
  const chartData = [
    { name: t('serviceTypes.maintenance'), value: 25, fill: SERVICE_TYPES[1].color },
    { name: t('serviceTypes.repair'), value: 20, fill: SERVICE_TYPES[2].color },
    { name: t('serviceTypes.inspection'), value: 10, fill: SERVICE_TYPES[3].color },
    { name: t('serviceTypes.tireChange'), value: 15, fill: SERVICE_TYPES[4].color },
    { name: t('serviceTypes.other'), value: 5, fill: SERVICE_TYPES[5].color }
  ];
  
  // Type-safe upcomingJobs with ServiceType
  const [upcomingJobs, setUpcomingJobs] = useState<Appointment[]>([
    { 
      id: 1,
      date: new Date(2025, 3, 8, 9, 0), // April 8, 2025, 09:00
      vehicleModel: "Volvo XC60",
      serviceType: 1 as ServiceType,
      isCompleted: false,
      customerEmail: "johan@example.com"
    },
    { 
      id: 2,
      date: new Date(2025, 3, 9, 13, 30), // April 9, 2025, 13:30
      vehicleModel: "BMW X5",
      serviceType: 2 as ServiceType,
      isCompleted: false,
      customerEmail: "customer@example.com"
    },
    { 
      id: 3,
      date: new Date(2025, 3, 10, 10, 0), // April 10, 2025, 10:00
      vehicleModel: "Audi A4",
      serviceType: 1 as ServiceType,
      isCompleted: false,
      customerEmail: "customer2@example.com"
    },
    { 
      id: 4,
      date: new Date(2025, 3, 13, 14, 0), // April 13, 2025, 14:00
      vehicleModel: "Volvo V70",
      serviceType: 2 as ServiceType,
      isCompleted: false,
      customerEmail: "customer3@example.com"
    },
    { 
      id: 5,
      date: new Date(2025, 3, 15, 11, 30), // April 15, 2025, 11:30
      vehicleModel: "Tesla Model 3",
      serviceType: 1 as ServiceType,
      isCompleted: false,
      customerEmail: "customer4@example.com"
    },
    { 
      id: 6,
      date: new Date(2025, 3, 22, 10, 0), // April 22, 2025, 10:00
      vehicleModel: "Mercedes E-Class",
      serviceType: 3 as ServiceType,
      isCompleted: false,
      customerEmail: "customer5@example.com"
    },
    { 
      id: 7,
      date: new Date(2025, 3, 28, 15, 30), // April 28, 2025, 15:30
      vehicleModel: "Ford Focus",
      serviceType: 4 as ServiceType,
      isCompleted: false,
      customerEmail: "customer6@example.com"
    },
    { 
      id: 8,
      date: new Date(2025, 4, 5, 9, 0), // May 5, 2025, 09:00
      vehicleModel: "Toyota RAV4",
      serviceType: 5 as ServiceType,
      isCompleted: false,
      customerEmail: "customer7@example.com"
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
  }, [timeView, upcomingJobs]);
  
  const jobsByDate = filteredJobs.reduce((acc, job) => {
    const dateStr = format(job.date, 'yyyy-MM-dd');
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(job);
    return acc;
  }, {} as GroupedAppointments);
  
  const locale = dateLocales[language as keyof typeof dateLocales] || enUS;

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
    
    // Update stats if needed
    stats.completedJobs++;
  };

  return (
    <Layout>
      <StatsCards stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UpcomingAppointments 
          filteredJobs={filteredJobs}
          timeView={timeView}
          setTimeView={setTimeView}
          jobsByDate={jobsByDate}
          locale={locale}
          onMarkComplete={handleMarkComplete}
        />
        <AppointmentsChart chartData={chartData} />
      </div>
    </Layout>
  );
}
