
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { format } from "date-fns";
import { Appointment, ServiceType } from "@/lib/types";
import { SERVICE_TYPES } from "@/lib/serviceTypes";
import { useLanguage } from "@/context/LanguageContext";

interface AppointmentFormProps {
  initialData?: Appointment;
  onSubmit: (data: Appointment) => void;
}

export function AppointmentForm({ initialData, onSubmit }: AppointmentFormProps) {
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState<Appointment>(() => {
    if (initialData) return { ...initialData };
    
    return {
      id: "",
      date: new Date(),
      customerId: "",
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      customerAddress: {
        street: "",
        zipCode: "",
        city: "",
      },
      vehicleInfo: "",
      vehicleMake: "",
      vehicleModel: "",
      vehicleLicense: "",
      vehicleVin: "",
      vehicleCarId: "",
      serviceType: 1 as ServiceType,
      notes: "",
      isPaid: false,
      isCompleted: false,
    };
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof Appointment] as object || {}),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleServiceTypeChange = (value: string) => {
    // Convert string to number, then cast to ServiceType
    const serviceTypeValue = parseInt(value) as ServiceType;
    setFormData((prev) => ({ ...prev, serviceType: serviceTypeValue }));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [date, time] = e.target.value.split('T');
    const dateObj = new Date(`${date}T${time || '09:00'}`);
    setFormData((prev) => ({ ...prev, date: dateObj }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="date">{t('appointment.date')}</Label>
          <Input
            id="date"
            type="datetime-local"
            value={formData.date ? format(formData.date, "yyyy-MM-dd'T'HH:mm") : ''}
            onChange={handleDateChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="serviceType">{t('appointment.serviceType')}</Label>
          <RadioGroup 
            value={formData.serviceType.toString()} 
            onValueChange={handleServiceTypeChange}
            className="grid grid-cols-2 sm:grid-cols-3 gap-2"
          >
            {Object.values(SERVICE_TYPES).map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <RadioGroupItem value={type.id.toString()} id={`service-${type.id}`} />
                <Label htmlFor={`service-${type.id}`}>{type.name}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t('appointment.customerDetails')}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">{t('appointment.customerName')}</Label>
            <Input
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerPhone">{t('appointment.customerPhone')}</Label>
            <Input
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail">{t('appointment.customerEmail')}</Label>
            <Input
              id="customerEmail"
              name="customerEmail"
              type="email"
              value={formData.customerEmail}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customerAddress.street">{t('appointment.customerAddress')}</Label>
          <Input
            id="customerAddress.street"
            name="customerAddress.street"
            value={formData.customerAddress.street}
            onChange={handleChange}
            placeholder={t('appointment.street')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="customerAddress.zipCode">{t('appointment.zipCode')}</Label>
            <Input
              id="customerAddress.zipCode"
              name="customerAddress.zipCode"
              value={formData.customerAddress.zipCode}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerAddress.city">{t('appointment.city')}</Label>
            <Input
              id="customerAddress.city"
              name="customerAddress.city"
              value={formData.customerAddress.city}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">{t('appointment.vehicleDetails')}</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleMake">{t('appointment.vehicleMake')}</Label>
            <Input
              id="vehicleMake"
              name="vehicleMake"
              value={formData.vehicleMake}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleModel">{t('appointment.vehicleModel')}</Label>
            <Input
              id="vehicleModel"
              name="vehicleModel"
              value={formData.vehicleModel}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleLicense">{t('appointment.vehicleLicense')}</Label>
            <Input
              id="vehicleLicense"
              name="vehicleLicense"
              value={formData.vehicleLicense}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicleVin">{t('appointment.vehicleVin')}</Label>
            <Input
              id="vehicleVin"
              name="vehicleVin"
              value={formData.vehicleVin}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">{t('appointment.notes')}</Label>
        <Textarea
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit">
          {initialData ? t('appointment.update') : t('appointment.create')}
        </Button>
      </div>
    </form>
  );
}
