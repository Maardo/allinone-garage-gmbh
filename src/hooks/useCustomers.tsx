
import { useState, useEffect } from "react";
import { Customer, Vehicle } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useOverviewAppointments } from "@/hooks/useOverviewAppointments";

const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "c1",
    name: "Johan Andersson",
    email: "johan@example.com",
    phone: "070-123-4567",
    notes: "Regular customer, prefers service on Mondays",
    address: {
      street: "Storgatan 1",
      zipCode: "12345",
      city: "Stockholm"
    },
    vehicles: [
      {
        id: "v1",
        make: "Volvo",
        model: "V70",
        year: 2018,
        license: "ABC123",
        vin: "YV1SW6111345678",
        carId: "VOL-2018-001"
      }
    ]
  },
  {
    id: "c2",
    name: "Maria Johansson",
    email: "maria@example.com",
    phone: "073-456-7890",
    notes: "Has special insurance arrangement",
    address: {
      street: "Kungsgatan 15",
      zipCode: "54321",
      city: "Göteborg"
    },
    vehicles: [
      {
        id: "v2",
        make: "Audi",
        model: "A4",
        year: 2020,
        license: "XYZ789",
        vin: "WAUZZZ885565432",
        carId: "AUD-2020-002"
      }
    ]
  },
  {
    id: "c3",
    name: "Erik Svensson",
    email: "erik@example.com",
    phone: "076-789-1234",
    notes: "",
    address: {
      street: "Vasagatan 5",
      zipCode: "11122",
      city: "Malmö"
    },
    vehicles: [
      {
        id: "v3",
        make: "BMW",
        model: "3 Series",
        year: 2019,
        license: "DEF456",
        vin: "WBA57210987654",
        carId: "BMW-2019-003"
      },
      {
        id: "v4",
        make: "Toyota",
        model: "Corolla",
        year: 2021,
        license: "GHI789",
        vin: "SB153234567890",
        carId: "TOY-2021-004"
      }
    ]
  }
];

export function useCustomers() {
  const { toast } = useToast();
  const { t } = useLanguage();
  const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { updateTotalCustomers } = useOverviewAppointments();
  const [newCustomer, setNewCustomer] = useState<Partial<Customer>>({
    name: "",
    email: "",
    phone: "",
    notes: "",
    address: {
      street: "",
      zipCode: "",
      city: ""
    },
    vehicles: []
  });

  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm) ||
    customer.address?.street?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.address?.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.vehicles.some(v => 
      v.license.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.make.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleAddCustomer = () => {
    if (!newCustomer.name) return;
    
    const customer: Customer = {
      id: Math.random().toString(36).substring(2, 9),
      name: newCustomer.name || "",
      email: newCustomer.email || "",
      phone: newCustomer.phone || "",
      notes: newCustomer.notes || "",
      address: newCustomer.address || { street: "", zipCode: "", city: "" },
      vehicles: newCustomer.vehicles as Vehicle[] || []
    };
    
    setCustomers([...customers, customer]);
    // Update total customers count
    updateTotalCustomers(1);
    
    setNewCustomer({
      name: "",
      email: "",
      phone: "",
      notes: "",
      address: {
        street: "",
        zipCode: "",
        city: ""
      },
      vehicles: []
    });
    
    toast({
      title: t('customer.addedTitle'),
      description: t('customer.addedDescription'),
    });

    return customer;
  };

  const handleUpdateCustomer = () => {
    if (!selectedCustomer || !selectedCustomer.name) return;
    
    const updatedCustomers = customers.map(c => 
      c.id === selectedCustomer.id ? selectedCustomer : c
    );
    
    setCustomers(updatedCustomers);
    
    toast({
      title: t('customer.updatedTitle'),
      description: t('customer.updatedDescription'),
    });

    return selectedCustomer;
  };

  const handleDeleteCustomer = () => {
    if (!selectedCustomer) return;
    
    const updatedCustomers = customers.filter(c => c.id !== selectedCustomer.id);
    setCustomers(updatedCustomers);
    
    // Update total customers count
    updateTotalCustomers(-1);
    
    toast({
      title: t('customer.deletedTitle'),
      description: t('customer.deletedDescription'),
    });
  };

  return {
    customers,
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
  };
}
