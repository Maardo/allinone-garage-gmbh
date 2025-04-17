
import React, { useState } from "react";
import { Appointment, ServiceType } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Search, Check } from "lucide-react";
import { useCustomerSelection } from "@/hooks/useCustomerSelection";
import { cn } from "@/lib/utils";

interface AppointmentDetailsProps {
  formData: Appointment;
  handleDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleServiceTypeChange: (value: string) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function AppointmentDetails({
  formData,
  handleDateChange,
  handleServiceTypeChange,
  handleChange,
}: AppointmentDetailsProps) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const {
    selectedCustomer,
    handleSelectCustomer,
    customers
  } = useCustomerSelection(formData, handleChange);

  return (
    <div className="space-y-4">
      {/* Customer Search */}
      <div className="space-y-1.5">
        <Label>{t('customer.search')}</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-full justify-between"
            >
              {selectedCustomer?.name || t('customer.searchPlaceholder')}
              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0">
            <Command>
              <CommandInput placeholder={t('customer.searchPlaceholder')} />
              <CommandEmpty>{t('customer.noResults')}</CommandEmpty>
              <CommandGroup>
                {customers.map((customer) => (
                  <CommandItem
                    key={customer.id}
                    value={customer.name}
                    onSelect={() => {
                      handleSelectCustomer(customer);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCustomer?.id === customer.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{customer.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {customer.email} • {customer.phone}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* Date and Time */}
      <div className="space-y-1.5">
        <Label htmlFor="date">{t('appointment.dateAndTime')}</Label>
        <Input
          type="datetime-local"
          id="date"
          value={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : ''}
          onChange={handleDateChange}
          required
        />
      </div>

      {/* Service Type */}
      <div className="space-y-1.5">
        <Label htmlFor="serviceType">{t('appointment.serviceType')}</Label>
        <select
          id="serviceType"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          value={formData.serviceType}
          onChange={(e) => handleServiceTypeChange(e.target.value)}
          required
        >
          <option value="">{t('appointment.selectServiceType')}</option>
          <option value="1">{t('appointment.serviceType1')}</option>
          <option value="2">{t('appointment.serviceType2')}</option>
          <option value="3">{t('appointment.serviceType3')}</option>
        </select>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes">{t('appointment.notes')}</Label>
        <Input
          type="text"
          id="notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          placeholder={t('appointment.notesPlaceholder')}
        />
      </div>
    </div>
  );
}
