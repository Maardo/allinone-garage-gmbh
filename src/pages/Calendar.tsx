
import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, addMonths, subMonths, isSameMonth, isToday, isSameDay } from "date-fns";
import { CalendarIcon, ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AppointmentForm } from "@/components/AppointmentForm";
import { Appointment, SERVICE_TYPES } from "@/lib/types";
import { cn } from "@/lib/utils";

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

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => setCurrentDate(new Date());

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

  const getAppointmentsForDay = (day: Date) => {
    return appointments.filter(appointment => 
      isSameDay(new Date(appointment.date), day)
    );
  };

  return (
    <Layout title="Calendar" subtitle="Schedule and manage appointments">
      <div className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold min-w-40 text-center">
            {format(currentDate, "MMMM yyyy")}
          </h2>
          <Button
            variant="outline"
            size="icon"
            onClick={nextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
          <Button variant="outline" onClick={goToToday} className="ml-2">
            <CalendarIcon className="mr-2 h-4 w-4" />
            Today
          </Button>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setSelectedAppointment(null)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Appointment
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {selectedAppointment ? "Edit Appointment" : "New Appointment"}
              </DialogTitle>
            </DialogHeader>
            <AppointmentForm 
              initialData={selectedAppointment || undefined} 
              onSubmit={handleAddAppointment}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div 
            key={day} 
            className="text-center font-medium text-muted-foreground py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 auto-rows-fr">
        {daysInMonth.map((day, i) => {
          // Adjust for starting the week on Monday
          let dayOfWeek = day.getDay(); // 0 = Sunday, 1 = Monday, etc.
          dayOfWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Convert to 0 = Monday, 6 = Sunday
          
          // Create empty cells for days before the 1st of the month
          const startOffset = dayOfWeek;
          if (i === 0) {
            const emptyCells = Array(startOffset).fill(null);
            return [
              ...emptyCells.map((_, index) => (
                <div key={`empty-${index}`} className="calendar-day opacity-0"></div>
              )),
              <div
                key={day.toISOString()}
                className={cn(
                  "calendar-day",
                  !isSameMonth(day, currentDate) && "opacity-40",
                  isToday(day) && "border-primary shadow-sm"
                )}
              >
                <div className="flex justify-between items-center mb-1">
                  <span 
                    className={cn(
                      "text-sm font-medium",
                      isToday(day) && "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-5 w-5 opacity-50 hover:opacity-100"
                        onClick={() => {
                          setSelectedAppointment(null);
                          // Set the time to 9 AM
                          const appointmentDate = new Date(day);
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
                        }}
                      >
                        <PlusCircle className="h-3 w-3" />
                      </Button>
                    </DialogTrigger>
                  </Dialog>
                </div>
                {getAppointmentsForDay(day).map((appointment) => (
                  <div
                    key={appointment.id}
                    onClick={() => {
                      setSelectedAppointment(appointment);
                      setIsDialogOpen(true);
                    }}
                    className={cn(
                      "calendar-appointment",
                      `service-type-${appointment.serviceType}`,
                      appointment.isPaid && "opacity-80",
                      appointment.isCompleted && "line-through opacity-60"
                    )}
                  >
                    <div className="font-medium truncate">
                      {format(new Date(appointment.date), "HH:mm")} {appointment.customerName}
                    </div>
                    <div className="truncate">{appointment.vehicleInfo}</div>
                  </div>
                ))}
              </div>
            ];
          }
          
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "calendar-day",
                !isSameMonth(day, currentDate) && "opacity-40",
                isToday(day) && "border-primary shadow-sm"
              )}
            >
              <div className="flex justify-between items-center mb-1">
                <span 
                  className={cn(
                    "text-sm font-medium",
                    isToday(day) && "bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center"
                  )}
                >
                  {format(day, "d")}
                </span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5 opacity-50 hover:opacity-100"
                      onClick={() => {
                        setSelectedAppointment(null);
                        // Set the time to 9 AM
                        const appointmentDate = new Date(day);
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
                      }}
                    >
                      <PlusCircle className="h-3 w-3" />
                    </Button>
                  </DialogTrigger>
                </Dialog>
              </div>
              {getAppointmentsForDay(day).map((appointment) => (
                <div
                  key={appointment.id}
                  onClick={() => {
                    setSelectedAppointment(appointment);
                    setIsDialogOpen(true);
                  }}
                  className={cn(
                    "calendar-appointment",
                    `service-type-${appointment.serviceType}`,
                    appointment.isPaid && "opacity-80",
                    appointment.isCompleted && "line-through opacity-60"
                  )}
                >
                  <div className="font-medium truncate">
                    {format(new Date(appointment.date), "HH:mm")} {appointment.customerName}
                  </div>
                  <div className="truncate">{appointment.vehicleInfo}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Service Type Legend */}
      <div className="mt-8 p-4 bg-card rounded-lg shadow-sm">
        <h3 className="font-medium mb-2">Service Types</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {Object.values(SERVICE_TYPES).map((type) => (
            <div 
              key={type.id} 
              className={cn(
                "flex items-center p-2 rounded-md",
                `service-type-${type.id}`
              )}
            >
              <div className="h-3 w-3 rounded-full"></div>
              <span className="ml-2 text-sm">{type.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
