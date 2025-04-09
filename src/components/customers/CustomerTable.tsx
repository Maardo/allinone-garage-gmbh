
import { User, Mail, Phone, Car, Edit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Customer } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface CustomerTableProps {
  customers: Customer[];
  isAdmin: boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomerTable({ customers, isAdmin, onEdit, onDelete }: CustomerTableProps) {
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  
  if (customers.length === 0) {
    return (
      <div className="text-center py-12">
        <User className="h-12 w-12 mx-auto text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium mb-1">{t('customer.noResults')}</h3>
      </div>
    );
  }
  
  if (isMobile) {
    return (
      <div className="divide-y">
        {customers.map((customer) => (
          <div key={customer.id} className="p-2">
            <div className="flex justify-between items-start mb-1">
              <div className="font-medium flex items-center text-sm">
                <User className="h-3 w-3 mr-1 text-muted-foreground" />
                {customer.name}
              </div>
              
              {isAdmin && (
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => onEdit(customer)}>
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button variant="destructive" size="icon" className="h-6 w-6" onClick={() => onDelete(customer)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-1 text-xs">
              {customer.email && (
                <div className="flex items-center">
                  <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                  <a href={`mailto:${customer.email}`} className="text-primary hover:underline truncate">
                    {customer.email}
                  </a>
                </div>
              )}
              
              {customer.phone && (
                <div className="flex items-center">
                  <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                  <a href={`tel:${customer.phone}`} className="text-primary hover:underline">
                    {customer.phone}
                  </a>
                </div>
              )}
            </div>
            
            {customer.vehicles.length > 0 && (
              <div className="mt-1">
                <div className="flex flex-wrap gap-1">
                  {customer.vehicles.map((vehicle) => (
                    <Badge 
                      key={vehicle.id} 
                      variant="outline"
                      className="flex items-center bg-secondary/50 text-xs py-0 px-1.5"
                    >
                      <Car className="h-2 w-2 mr-0.5" />
                      {vehicle.make} {vehicle.model}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
  
  // Desktop view
  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="h-8 py-1">{t('customer.name')}</TableHead>
          <TableHead className="h-8 py-1">{t('customer.contact')}</TableHead>
          <TableHead className="h-8 py-1">{t('customer.vehicles')}</TableHead>
          {isAdmin && <TableHead className="text-right h-8 py-1">{t('actions.actions')}</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id} className="h-10">
            <TableCell className="font-medium py-1">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3 text-muted-foreground" />
                <span className="text-sm">{customer.name}</span>
              </div>
              {customer.address?.street && (
                <div className="text-xs text-muted-foreground ml-4">
                  {customer.address.city}
                </div>
              )}
            </TableCell>
            <TableCell className="py-1">
              <div className="space-y-0.5">
                {customer.email && (
                  <div className="flex items-center text-xs">
                    <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                    <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                      {customer.email}
                    </a>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center text-xs">
                    <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                    <a href={`tel:${customer.phone}`} className="text-primary hover:underline">
                      {customer.phone}
                    </a>
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell className="py-1">
              <div className="flex flex-wrap gap-1">
                {customer.vehicles.map((vehicle) => (
                  <Badge 
                    key={vehicle.id} 
                    variant="outline"
                    className="flex items-center bg-secondary/50 text-xs py-0 px-1.5"
                  >
                    <Car className="h-2.5 w-2.5 mr-0.5" />
                    {vehicle.make} {vehicle.license}
                  </Badge>
                ))}
              </div>
            </TableCell>
            {isAdmin && (
              <TableCell className="text-right py-1">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(customer)} className="h-6 px-2 text-xs py-0">
                    <Edit className="h-3 w-3 mr-1" />
                    {t('actions.edit')}
                  </Button>
                  
                  <Button variant="destructive" size="sm" onClick={() => onDelete(customer)} className="h-6 px-2 text-xs py-0">
                    <Trash2 className="h-3 w-3 mr-1" />
                    {t('actions.delete')}
                  </Button>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
