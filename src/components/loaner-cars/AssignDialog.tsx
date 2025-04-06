
import { useState } from "react";
import { format } from "date-fns";
import { LoanerCar } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter 
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

// Mock customers for demo
const MOCK_CUSTOMERS = [
  { id: "c1", name: "Johan Andersson" },
  { id: "c2", name: "Maria Johansson" },
  { id: "c3", name: "Erik Svensson" },
  { id: "c4", name: "Anna Karlsson" },
];

interface AssignDialogProps {
  isOpen: boolean;
  selectedCar: LoanerCar | null;
  onOpenChange: (open: boolean) => void;
  onAssign: () => void;
  assignData: {
    customerId: string;
    returnDate: string;
  };
  setAssignData: (data: { customerId: string; returnDate: string }) => void;
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
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('loanerCar.assignLoanerCar')}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="car">{t('loanerCar.car')}</Label>
            <Input 
              id="car" 
              value={`${selectedCar?.name} (${selectedCar?.license})`} 
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
                {MOCK_CUSTOMERS.map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    {customer.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          <Button onClick={onAssign}>{t('loanerCar.assignCar')}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
