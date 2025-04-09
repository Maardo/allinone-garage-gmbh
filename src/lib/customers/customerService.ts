
// Re-export all customer-related functionality from the smaller modules
export { 
  generateId,
  createCustomer,
  createVehicle,
  filterCustomers
} from './customerUtils';

export {
  fetchCustomersFromDb,
  addCustomerToDb,
  updateCustomerInDb,
  deleteCustomerFromDb
} from './customerDbService';

export {
  importMockDataToDb
} from './mockDataService';
