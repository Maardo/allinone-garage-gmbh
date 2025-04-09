
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
          <div key={customer.id} className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="font-medium flex items-center">
                <User className="h-4 w-4 mr-2 text-muted-foreground" />
                {customer.name}
              </div>
              
              {isAdmin && (
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onEdit(customer)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => onDelete(customer)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            <div className="space-y-2 text-sm">
              {customer.email && (
                <div className="flex items-center">
                  <Mail className="h-3 w-3 mr-2 text-muted-foreground" />
                  <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                    {customer.email}
                  </a>
                </div>
              )}
              
              {customer.phone && (
                <div className="flex items-center">
                  <Phone className="h-3 w-3 mr-2 text-muted-foreground" />
                  <a href={`tel:${customer.phone}`} className="text-primary hover:underline">
                    {customer.phone}
                  </a>
                </div>
              )}
              
              {customer.address?.street && (
                <div className="text-muted-foreground">
                  {customer.address.street}, {customer.address.zipCode} {customer.address.city}
                </div>
              )}
            </div>
            
            {customer.vehicles.length > 0 && (
              <div className="mt-3">
                <div className="text-xs font-medium text-muted-foreground mb-1">
                  {t('customer.vehicles')}:
                </div>
                <div className="flex flex-wrap gap-1">
                  {customer.vehicles.map((vehicle) => (
                    <Badge 
                      key={vehicle.id} 
                      variant="outline"
                      className="flex items-center bg-secondary/50 text-xs"
                    >
                      <Car className="h-3 w-3 mr-1" />
                      {vehicle.make} {vehicle.model} ({vehicle.license})
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
        <TableRow>
          <TableHead>{t('customer.name')}</TableHead>
          <TableHead>{t('customer.contact')}</TableHead>
          <TableHead>{t('customer.address')}</TableHead>
          <TableHead>{t('customer.vehicles')}</TableHead>
          {isAdmin && <TableHead className="text-right">{t('actions.actions')}</TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.map((customer) => (
          <TableRow key={customer.id}>
            <TableCell className="font-medium">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                {customer.name}
              </div>
            </TableCell>
            <TableCell>
              <div className="space-y-1">
                {customer.email && (
                  <div className="flex items-center text-sm">
                    <Mail className="h-3 w-3 mr-1 text-muted-foreground" />
                    <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
                      {customer.email}
                    </a>
                  </div>
                )}
                {customer.phone && (
                  <div className="flex items-center text-sm">
                    <Phone className="h-3 w-3 mr-1 text-muted-foreground" />
                    <a href={`tel:${customer.phone}`} className="text-primary hover:underline">
                      {customer.phone}
                    </a>
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              {customer.address?.street && (
                <div className="text-sm">
                  <div>{customer.address.street}</div>
                  <div>{customer.address.zipCode} {customer.address.city}</div>
                </div>
              )}
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {customer.vehicles.map((vehicle) => (
                  <Badge 
                    key={vehicle.id} 
                    variant="outline"
                    className="flex items-center bg-secondary/50"
                  >
                    <Car className="h-3 w-3 mr-1" />
                    {vehicle.make} {vehicle.model} ({vehicle.license})
                  </Badge>
                ))}
              </div>
            </TableCell>
            {isAdmin && (
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => onEdit(customer)}>
                    <Edit className="h-3 w-3 mr-1" />
                    {t('actions.edit')}
                  </Button>
                  
                  <Button variant="destructive" size="sm" onClick={() => onDelete(customer)}>
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
