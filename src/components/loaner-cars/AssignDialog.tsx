
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { LoanerCar } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription 
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useCustomers } from "@/hooks/useCustomers";

interface AssignDialogProps {
  isOpen: boolean;
  selectedCar: LoanerCar | null;
  onOpenChange: (open: boolean) => void;
  onAssign: () => void;
  assignData: {
    customerId: string;
    returnDate: string;
    startDate: string;
  };
  setAssignData: (data: { customerId: string; returnDate: string; startDate: string }) => void;
}

export function AssignDialog({
  isOpen,
  selectedCar,
  onOpenChange,
  onAssign,
  assignData,
  setAssignData
}: AssignDialogProps) {
  const { t } = useLanguage();
  const { customers, refreshCustomers } = useCustomers();
  
  // Refresh customer data when dialog opens
  useEffect(() => {
    if (isOpen) {
      refreshCustomers();
    }
  }, [isOpen, refreshCustomers]);

  // Function to handle the assign button click
  const handleAssignClick = () => {
    if (!assignData.customerId) {
      return; // Don't proceed if no customer is selected
    }
    onAssign();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('loanerCar.assignLoanerCar')}</DialogTitle>
          <DialogDescription>
            {t('loanerCar.assignLoanerCarDescription', 'Select a customer to assign this loaner car.')}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="car">{t('loanerCar.car')}</Label>
            <Input 
              id="car" 
              value={selectedCar ? `${selectedCar.name} (${selectedCar.license})` : ''} 
              readOnly 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="customer">{t('loanerCar.customer')}</Label>
            <Select 
              value={assignData.customerId}
              onValueChange={(value) => setAssignData({...assignData, customerId: value})}
            >
              <SelectTrigger>
                <SelectValue placeholder={t('loanerCar.selectCustomer')} />
              </SelectTrigger>
              <SelectContent>
                {customers.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="startDate">{t('loanerCar.startDate')}</Label>
            <Input 
              id="startDate" 
              type="date" 
              value={assignData.startDate}
              onChange={(e) => setAssignData({...assignData, startDate: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="returnDate">{t('loanerCar.returnDate')}</Label>
            <Input 
              id="returnDate" 
              type="date" 
              value={assignData.returnDate}
              onChange={(e) => setAssignData({...assignData, returnDate: e.target.value})}
            />
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleAssignClick} 
            disabled={!assignData.customerId}
          >
            {t('loanerCar.assignCar')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
