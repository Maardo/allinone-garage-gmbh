
import { LoanerCar } from '@/lib/types';

// Mock data for demo purposes
export const INITIAL_LOANER_CARS: LoanerCar[] = [
  {
    id: "car1",
    name: "Volvo V60",
    license: "ABC123",
    isAvailable: false,
    assignedTo: "Erik Svensson", // Preassigned to match appointment with ID "3"
    assignedFrom: new Date(new Date().setDate(new Date().getDate() + 3)),
    assignedUntil: new Date(new Date().setDate(new Date().getDate() + 4))
  },
  {
    id: "car2",
    name: "Toyota Corolla",
    license: "XYZ789",
    isAvailable: false,
    assignedTo: "Johan Andersson",
    assignedFrom: new Date(new Date().setDate(new Date().getDate() - 2)),
    assignedUntil: new Date(new Date().setDate(new Date().getDate() + 2))
  },
  {
    id: "car3",
    name: "Volvo XC60",
    license: "GHI456",
    isAvailable: true
  }
];

// Mock customers for demo
export const MOCK_CUSTOMERS = [
  { id: "c1", name: "Johan Andersson" },
  { id: "c2", name: "Maria Johansson" },
  { id: "c3", name: "Erik Svensson" },
  { id: "c4", name: "Anna Karlsson" },
];
