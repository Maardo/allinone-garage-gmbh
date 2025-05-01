
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useLanguage } from "@/context/LanguageContext";
import { Appointment } from "@/lib/types";
import { Calendar, Clock, Car, Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface LoanerCarRequestsProps {
  appointments: Appointment[];
  onAssign: (appointmentId: string) => void;
  isAssigning: string | null;
}

export function LoanerCarRequests({ appointments, onAssign, isAssigning }: LoanerCarRequestsProps) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  if (appointments.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <Car className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
        <p className="text-lg">{t('loanerCar.noRequests')}</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="bg-white p-3 rounded-md shadow-sm border">
            <div className="flex justify-between items-start">
              <div className="font-medium">{appointment.customerName}</div>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                {t('loanerCar.requested')}
              </Badge>
            </div>
            
            <div className="text-sm my-2 space-y-1">
              <div className="flex items-center gap-1 text-gray-600">
                <Calendar className="h-3.5 w-3.5 text-blue-600" />
                <span>{format(new Date(appointment.date), "yyyy-MM-dd")}</span>
                <Clock className="h-3.5 w-3.5 ml-2 text-blue-600" />
                <span>{format(new Date(appointment.date), t('calendar.timeFormat'))}</span>
              </div>
              <div className="truncate">{appointment.vehicleInfo || `${appointment.vehicleMake} ${appointment.vehicleLicense || ''}`}</div>
            </div>
            
            <div className="mt-3">
              <Button 
                size="sm" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => onAssign(appointment.id)}
                disabled={isAssigning === appointment.id}
              >
                {isAssigning === appointment.id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('common.processing')}
                  </>
                ) : (
                  t('loanerCar.assign')
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="rounded-md overflow-hidden border">
      <Table>
        <TableHeader className="bg-blue-100">
          <TableRow>
            <TableHead className="font-semibold">{t('appointment.customerName')}</TableHead>
            <TableHead className="font-semibold">{t('appointment.date')}</TableHead>
            <TableHead className="font-semibold">{t('appointment.vehicleInfo')}</TableHead>
            <TableHead className="font-semibold">{t('loanerCar.status')}</TableHead>
            <TableHead className="w-[100px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appointment) => (
            <TableRow key={appointment.id} className="hover:bg-blue-50/70 bg-white">
              <TableCell className="font-medium">{appointment.customerName}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span>{format(new Date(appointment.date), "yyyy-MM-dd")}</span>
                  <Clock className="h-4 w-4 ml-2 text-blue-600" />
                  <span>{format(new Date(appointment.date), t('calendar.timeFormat'))}</span>
                </div>
              </TableCell>
              <TableCell className="max-w-xs truncate">{appointment.vehicleInfo || `${appointment.vehicleMake} ${appointment.vehicleLicense || ''}`}</TableCell>
              <TableCell>
                {appointment.loanerCarId ? (
                  <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200">
                    {t('loanerCar.assigned')}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200">
                    {t('loanerCar.requested')}
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                {!appointment.loanerCarId && (
                  <Button 
                    size="sm" 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => onAssign(appointment.id)}
                    disabled={isAssigning === appointment.id}
                  >
                    {isAssigning === appointment.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        {t('common.processing')}
                      </>
                    ) : (
                      t('loanerCar.assign')
                    )}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
