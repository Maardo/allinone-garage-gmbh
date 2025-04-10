
import { Appointment, Customer } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useCustomers } from "@/hooks/useCustomers";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";

interface CustomerDetailsProps {
  formData: Appointment;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function CustomerDetails({ formData, handleChange }: CustomerDetailsProps) {
  const { t } = useLanguage();
  const { customers, refreshCustomers } = useCustomers();
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);
  
  // Fetch the latest customer data when component mounts
  useEffect(() => {
    refreshCustomers();
  }, [refreshCustomers]);

  // Handle selecting a customer from search results
  const handleSelectCustomer = (customer: Customer) => {
    // Create an artificial change event for each customer field
    const createChangeEvent = (name: string, value: string) => ({
      target: {
        name,
        value
      }
    }) as React.ChangeEvent<HTMLInputElement>;
    
    // Update customer fields
    handleChange(createChangeEvent("customerName", customer.name));
    handleChange(createChangeEvent("customerPhone", customer.phone));
    handleChange(createChangeEvent("customerEmail", customer.email));
    
    // Update address fields
    if (customer.address) {
      handleChange(createChangeEvent("customerAddress.street", customer.address.street));
      handleChange(createChangeEvent("customerAddress.zipCode", customer.address.zipCode));
      handleChange(createChangeEvent("customerAddress.city", customer.address.city));
    }
    
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="space-y-1.5 mb-4">
        <Label htmlFor="customerSearch">{t('customer.search')}</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              role="combobox" 
              aria-expanded={open}
              className="w-full justify-between"
            >
              {searchTerm || t('customer.searchPlaceholder')}
              <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0" align="start">
            <Command>
              <CommandInput placeholder={t('customer.searchPlaceholder')} />
              <CommandList>
                <CommandEmpty>{t('customer.noResults')}</CommandEmpty>
                <CommandGroup>
                  {customers.map((customer) => (
                    <CommandItem
                      key={customer.id}
                      value={customer.name}
                      onSelect={() => {
                        handleSelectCustomer(customer);
                        setSearchTerm(customer.name);
                      }}
                    >
                      <div className="flex flex-col">
                        <span>{customer.name}</span>
                        <span className="text-xs text-muted-foreground">{customer.email} • {customer.phone}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="customerName">{t('appointment.customerName')}</Label>
          <Input
            id="customerName"
            name="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="customerPhone">{t('appointment.customerPhone')}</Label>
          <Input
            id="customerPhone"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="customerEmail">{t('appointment.customerEmail')}</Label>
        <Input
          id="customerEmail"
          name="customerEmail"
          type="email"
          value={formData.customerEmail}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="customerAddress.street">{t('appointment.customerAddress')}</Label>
        <Input
          id="customerAddress.street"
          name="customerAddress.street"
          value={formData.customerAddress.street}
          onChange={handleChange}
          placeholder={t('appointment.street')}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="customerAddress.zipCode">{t('appointment.zipCode')}</Label>
          <Input
            id="customerAddress.zipCode"
            name="customerAddress.zipCode"
            value={formData.customerAddress.zipCode}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1.5">
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
  );
}
