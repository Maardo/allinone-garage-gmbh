
import { useState } from "react";
import { addDays, addMonths, addWeeks, startOfDay, startOfMonth, startOfWeek, subDays, subMonths, subWeeks } from "date-fns";
import { Layout } from "@/components/Layout";
import { CalendarHeader } from "@/components/calendar/CalendarHeader";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { ServiceTypeLegend } from "@/components/calendar/ServiceTypeLegend";
import { Appointment } from "@/lib/types";

// Mock data for demo purposes
const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    date: new Date(new Date().setHours(10, 0, 0, 0)),
    customerId: "c1",
    customerName: "Johan Andersson",
    vehicleInfo: "Volvo V70, ABC123",
    serviceType: 1,
    notes: "Annual service",
    isPaid: false,
    isCompleted: false
  },
  {
    id: "2",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    customerId: "c2",
    customerName: "Maria Johansson",
    vehicleInfo: "Audi A4, XYZ789",
    serviceType: 2,
    notes: "Engine repair",
    isPaid: true,
    isCompleted: true
  },
  {
    id: "3",
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    customerId: "c3",
    customerName: "Erik Svensson",
    vehicleInfo: "BMW 3 Series, DEF456",
    serviceType: 3,
    notes: "Pre-purchase inspection",
    loanerCarId: "car1",
    isPaid: false,
    isCompleted: false
  }
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month');

  const handleNavigatePrev = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(subDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(subWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(subMonths(currentDate, 1));
        break;
    }
  };

  const handleNavigateNext = () => {
    switch (viewMode) {
      case 'day':
        setCurrentDate(addDays(currentDate, 1));
        break;
      case 'week':
        setCurrentDate(addWeeks(currentDate, 1));
        break;
      case 'month':
        setCurrentDate(addMonths(currentDate, 1));
        break;
    }
  };

  const goToToday = () => {
    const today = new Date();
    switch (viewMode) {
      case 'day':
        setCurrentDate(startOfDay(today));
        break;
      case 'week':
        setCurrentDate(startOfWeek(today, { weekStartsOn: 1 }));
        break;
      case 'month':
        setCurrentDate(startOfMonth(today));
        break;
    }
  };

  const handleAddAppointment = (appointment: Appointment) => {
    if (selectedAppointment) {
      // Update existing appointment
      setAppointments(appointments.map(app => 
        app.id === appointment.id ? appointment : app
      ));
    } else {
      // Add new appointment
      setAppointments([...appointments, {
        ...appointment,
        id: Math.random().toString(36).substr(2, 9)
      }]);
    }
    setIsDialogOpen(false);
    setSelectedAppointment(null);
  };

  const handleSelectAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDialogOpen(true);
  };

  const handleNewAppointmentAtDate = (date: Date) => {
    // Set the time to 9 AM
    const appointmentDate = new Date(date);
    appointmentDate.setHours(9, 0, 0, 0);
    setSelectedAppointment({
      id: "",
      date: appointmentDate,
      customerId: "",
      customerName: "",
      vehicleInfo: "",
      serviceType: 1,
      notes: "",
      isPaid: false,
      isCompleted: false
    });
    setIsDialogOpen(true);
  };

  const handleChangeViewMode = (mode: 'day' | 'week' | 'month') => {
    setViewMode(mode);
    
    // Adjust the current date to the start of the appropriate period
    const today = new Date();
    switch (mode) {
      case 'day':
        setCurrentDate(startOfDay(today));
        break;
      case 'week':
        setCurrentDate(startOfWeek(today, { weekStartsOn: 1 }));
        break;
      case 'month':
        setCurrentDate(startOfMonth(today));
        break;
    }
  };

  return (
    <Layout title="Calendar" subtitle="Schedule and manage appointments">
      <CalendarHeader 
        currentDate={currentDate}
        onPrevMonth={handleNavigatePrev}
        onNextMonth={handleNavigateNext}
        onToday={goToToday}
        onAddAppointment={handleAddAppointment}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
        selectedAppointment={selectedAppointment}
        setSelectedAppointment={setSelectedAppointment}
        viewMode={viewMode}
        onChangeViewMode={handleChangeViewMode}
      />

      <CalendarGrid 
        currentDate={currentDate}
        appointments={appointments}
        onSelectAppointment={handleSelectAppointment}
        onNewAppointmentAtDate={handleNewAppointmentAtDate}
        viewMode={viewMode}
      />

      <ServiceTypeLegend />
    </Layout>
  );
}
