
import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Check, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Appointment, SERVICE_TYPES } from "@/lib/types";
import { cn } from "@/lib/utils";

interface AppointmentFormProps {
  initialData?: Appointment;
  onSubmit: (data: Appointment) => void;
}

export function AppointmentForm({ initialData, onSubmit }: AppointmentFormProps) {
  const [formData, setFormData] = useState<Appointment>(
    initialData || {
      id: "",
      date: new Date(),
      customerId: "",
      customerName: "",
      vehicleInfo: "",
      serviceType: 1,
      notes: "",
      isPaid: false,
      isCompleted: false
    }
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      // Preserve the time from the previous date
      const previousDate = new Date(formData.date);
      date.setHours(previousDate.getHours());
      date.setMinutes(previousDate.getMinutes());
      setFormData({ ...formData, date });
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeString = e.target.value;
    const [hours, minutes] = timeString.split(":");
    const newDate = new Date(formData.date);
    newDate.setHours(parseInt(hours, 10));
    newDate.setMinutes(parseInt(minutes, 10));
    setFormData({ ...formData, date: newDate });
  };

  const handleServiceTypeChange = (value: string) => {
    setFormData({ ...formData, serviceType: parseInt(value) as 1 | 2 | 3 | 4 | 5 });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const togglePaid = () => {
    setFormData({ ...formData, isPaid: !formData.isPaid });
  };

  const toggleCompleted = () => {
    setFormData({ ...formData, isCompleted: !formData.isCompleted });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Details */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="customerName">Customer Name</Label>
            <Input
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              placeholder="Customer name"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="vehicleInfo">Vehicle Information</Label>
            <Input
              id="vehicleInfo"
              name="vehicleInfo"
              value={formData.vehicleInfo}
              onChange={handleChange}
              placeholder="Make, model, registration"
              required
            />
          </div>
        </div>

        {/* Appointment Details */}
        <div className="space-y-4">
          <div className="flex flex-col space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? (
                    format(formData.date, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={formData.date}
                  onSelect={handleDateChange}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={format(formData.date, "HH:mm")}
              onChange={handleTimeChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="serviceType">Service Type</Label>
            <Select 
              value={formData.serviceType.toString()} 
              onValueChange={handleServiceTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(SERVICE_TYPES).map((type) => (
                  <SelectItem key={type.id} value={type.id.toString()}>
                    {type.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder="Additional notes about the appointment"
          className="h-24"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        <div className="flex items-center space-x-2">
          <Switch 
            id="paid" 
            checked={formData.isPaid} 
            onCheckedChange={togglePaid} 
          />
          <Label htmlFor="paid" className="flex items-center cursor-pointer">
            <CreditCard className="mr-2 h-4 w-4" />
            {formData.isPaid ? (
              <span className="text-green-600">Paid</span>
            ) : (
              <span className="text-red-600">Unpaid</span>
            )}
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch 
            id="completed" 
            checked={formData.isCompleted} 
            onCheckedChange={toggleCompleted} 
          />
          <Label htmlFor="completed" className="flex items-center cursor-pointer">
            <Check className="mr-2 h-4 w-4" />
            {formData.isCompleted ? (
              <span className="text-green-600">Completed</span>
            ) : (
              <span>In Progress</span>
            )}
          </Label>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit">
          {initialData?.id ? "Update Appointment" : "Create Appointment"}
        </Button>
      </div>
    </form>
  );
}
