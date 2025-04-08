
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useLanguage } from "@/context/LanguageContext";
import { Appointment } from "@/lib/types";

interface LoanerCarRequestsProps {
  appointments: Appointment[];
  onAssign: (appointmentId: string) => void;
}

export function LoanerCarRequests({ appointments, onAssign }: LoanerCarRequestsProps) {
  const { t } = useLanguage();
  
  if (appointments.length === 0) {
    return (
      <div className="text-center py-6 text-muted-foreground">
        {t('loanerCar.noRequests')}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('appointment.customerName')}</TableHead>
          <TableHead>{t('appointment.date')}</TableHead>
          <TableHead>{t('appointment.vehicleInfo')}</TableHead>
          <TableHead>{t('loanerCar.status')}</TableHead>
          <TableHead className="w-[100px]"></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {appointments.map((appointment) => (
          <TableRow key={appointment.id}>
            <TableCell className="font-medium">{appointment.customerName}</TableCell>
            <TableCell>{format(new Date(appointment.date), "yyyy-MM-dd HH:mm")}</TableCell>
            <TableCell>{appointment.vehicleInfo || `${appointment.vehicleMake} ${appointment.vehicleLicense || ''}`}</TableCell>
            <TableCell>
              {appointment.loanerCarId ? (
                <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">
                  {t('loanerCar.assigned')}
                </Badge>
              ) : (
                <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">
                  {t('loanerCar.requested')}
                </Badge>
              )}
            </TableCell>
            <TableCell>
              {!appointment.loanerCarId && (
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onAssign(appointment.id)}
                >
                  {t('loanerCar.assign')}
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
