
import { Customer, Vehicle } from "@/lib/types";

// Generate a random ID for new entities (used for local operations)
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Create a new customer object
export const createCustomer = (customerData: Partial<Customer>): Customer => {
  return {
    id: generateId(),
    name: customerData.name || "",
    email: customerData.email || "",
    phone: customerData.phone || "",
    notes: customerData.notes || "",
    address: customerData.address || { street: "", zipCode: "", city: "" },
    vehicles: customerData.vehicles as Vehicle[] || []
  };
};

// Create a new vehicle object
export const createVehicle = (vehicleData: Partial<Vehicle>): Vehicle => {
  return {
    id: generateId(),
    make: vehicleData.make || "",
    model: vehicleData.model || "",
    year: vehicleData.year || new Date().getFullYear(),
    license: vehicleData.license || "",
    vin: vehicleData.vin || "",
    carId: vehicleData.carId || ""
  };
};

// Filter customers based on search term
export const filterCustomers = (customers: Customer[], searchTerm: string): Customer[] => {
  if (!searchTerm) return customers;
  
  const term = searchTerm.toLowerCase();
  
  return customers.filter(customer => 
    customer.name.toLowerCase().includes(term) ||
    customer.email?.toLowerCase().includes(term) ||
    customer.phone?.includes(searchTerm) ||
    customer.address?.street?.toLowerCase().includes(term) ||
    customer.address?.city?.toLowerCase().includes(term) ||
    customer.vehicles.some(v => 
      v.license.toLowerCase().includes(term) ||
      v.make.toLowerCase().includes(term) ||
      v.model.toLowerCase().includes(term)
    )
  );
};
