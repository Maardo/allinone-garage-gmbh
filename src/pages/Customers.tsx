
import { useState } from "react";
import { Search, Plus } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Customer } from "@/lib/types";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { CustomerForm } from "@/components/customers/CustomerForm";
import { CustomerTable } from "@/components/customers/CustomerTable";
import { EmptySearchResult } from "@/components/customers/EmptySearchResult";
import { useCustomers } from "@/hooks/useCustomers";

export default function CustomersPage() {
  const { t } = useLanguage();
  const { currentUser } = useAuth();
  const { 
    filteredCustomers, 
    searchTerm, 
    setSearchTerm, 
    selectedCustomer, 
    setSelectedCustomer,
    newCustomer,
    setNewCustomer,
    handleAddCustomer, 
    handleUpdateCustomer, 
    handleDeleteCustomer 
  } = useCustomers();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  const handleEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsEditDialogOpen(true);
  };

  const handleDeleteCustomerButton = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteDialogOpen(true);
  };

  return (
    <Layout title={t('navigation.customers')} subtitle={t('customer.manageSubtitle')}>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('customer.searchPlaceholder')}
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('customer.addNew')}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t('customer.addNew')}</DialogTitle>
            </DialogHeader>
            
            <CustomerForm 
              customer={newCustomer}
              setCustomer={setNewCustomer}
              isEdit={false}
            />
            
            <DialogFooter>
              <Button 
                onClick={() => {
                  handleAddCustomer();
                  setIsAddDialogOpen(false);
                }}
                disabled={!newCustomer.name}
                className="bg-blue-400 hover:bg-blue-500 text-white"
              >
                {t('actions.save')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {searchTerm && filteredCustomers.length === 0 ? (
        <EmptySearchResult searchTerm={searchTerm} />
      ) : (
        <Card>
          <CardContent className="p-0">
            <CustomerTable 
              customers={filteredCustomers}
              isAdmin={isAdmin}
              onEdit={handleEditCustomer}
              onDelete={handleDeleteCustomerButton}
            />
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t('customer.editTitle')}</DialogTitle>
          </DialogHeader>
          
          {selectedCustomer && (
            <CustomerForm 
              customer={selectedCustomer}
              setCustomer={setSelectedCustomer}
              isEdit={true}
            />
          )}
          
          <DialogFooter>
            <Button 
              onClick={() => {
                handleUpdateCustomer();
                setIsEditDialogOpen(false);
              }}
              disabled={!selectedCustomer?.name}
            >
              {t('actions.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('customer.deleteTitle')}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>{t('customer.deleteConfirmation')}</p>
            <p className="font-medium mt-2">{selectedCustomer?.name}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              {t('actions.cancel')}
            </Button>
            <Button variant="destructive" onClick={() => {
              handleDeleteCustomer();
              setIsDeleteDialogOpen(false);
            }}>
              {t('actions.confirmDelete')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
