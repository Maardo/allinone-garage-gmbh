
import { Layout } from "@/components/Layout";
import { useLanguage } from "@/context/LanguageContext";
import { SERVICE_TYPES } from "@/lib/serviceTypes";
import { StatsCardGrid } from "@/components/overview/StatsCardGrid";
import { UpcomingJobsList } from "@/components/overview/UpcomingJobsList";
import { JobsChart } from "@/components/overview/JobsChart";

export default function Overview() {
  const { t } = useLanguage();
  
  // Mock data - in a real app, this would come from your backend
  const stats = {
    todayAppointments: 3,
    weekAppointments: 15,
    totalCustomers: 275,
    completedJobs: 843
  };
  
  // Mock chart data - total upcoming appointments by service type
  const chartData = [
    { name: t('serviceTypes.maintenance'), value: 25, fill: SERVICE_TYPES[1].color },
    { name: t('serviceTypes.repair'), value: 20, fill: SERVICE_TYPES[2].color },
    { name: t('serviceTypes.inspection'), value: 10, fill: SERVICE_TYPES[3].color },
    { name: t('serviceTypes.tireChange'), value: 15, fill: SERVICE_TYPES[4].color },
    { name: t('serviceTypes.other'), value: 5, fill: SERVICE_TYPES[5].color }
  ];
  
  // Mock upcoming jobs data
  const upcomingJobs = [
    { 
      id: 1,
      date: new Date(2025, 3, 8, 9, 0), // April 8, 2025, 09:00
      vehicleModel: "Volvo XC60",
      serviceType: 1 
    },
    { 
      id: 2,
      date: new Date(2025, 3, 9, 13, 30), // April 9, 2025, 13:30
      vehicleModel: "BMW X5",
      serviceType: 2 
    },
    { 
      id: 3,
      date: new Date(2025, 3, 10, 10, 0), // April 10, 2025, 10:00
      vehicleModel: "Audi A4",
      serviceType: 1 
    },
    { 
      id: 4,
      date: new Date(2025, 3, 13, 14, 0), // April 13, 2025, 14:00
      vehicleModel: "Volvo V70",
      serviceType: 2 
    },
    { 
      id: 5,
      date: new Date(2025, 3, 15, 11, 30), // April 15, 2025, 11:30
      vehicleModel: "Tesla Model 3",
      serviceType: 1 
    },
    { 
      id: 6,
      date: new Date(2025, 3, 22, 10, 0), // April 22, 2025, 10:00
      vehicleModel: "Mercedes E-Class",
      serviceType: 3 
    },
    { 
      id: 7,
      date: new Date(2025, 3, 28, 15, 30), // April 28, 2025, 15:30
      vehicleModel: "Ford Focus",
      serviceType: 4
    },
    { 
      id: 8,
      date: new Date(2025, 4, 5, 9, 0), // May 5, 2025, 09:00
      vehicleModel: "Toyota RAV4",
      serviceType: 5
    }
  ];

  return (
    <Layout>
      <StatsCardGrid stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UpcomingJobsList jobs={upcomingJobs} />
        <JobsChart chartData={chartData} />
      </div>
    </Layout>
  );
}
