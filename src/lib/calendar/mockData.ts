
import { Appointment } from "@/lib/types";

// Mock data for demo purposes - moved from useCalendar.tsx
export const MOCK_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    date: new Date(new Date().setHours(10, 0, 0, 0)),
    customerId: "c1",
    customerName: "Johan Andersson",
    customerEmail: "johan@example.com",
    customerPhone: "070-123-4567",
    customerAddress: {
      street: "Storgatan 1",
      zipCode: "12345",
      city: "Stockholm"
    },
    vehicleInfo: "Volvo V70, ABC123",
    vehicleMake: "Volvo",
    vehicleModel: "V70",
    vehicleLicense: "ABC123",
    vehicleVin: "YV1SW6111345678",
    vehicleCarId: "VOL-2018-001",
    serviceType: 1,
    notes: "Annual service",
    isPaid: false,
    isCompleted: false,
    needsLoanerCar: false
  },
  {
    id: "2",
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    customerId: "c2",
    customerName: "Maria Johansson",
    customerEmail: "maria@example.com",
    customerPhone: "073-456-7890",
    customerAddress: {
      street: "Kungsgatan 15",
      zipCode: "54321",
      city: "Göteborg"
    },
    vehicleInfo: "Audi A4, XYZ789",
    vehicleMake: "Audi",
    vehicleModel: "A4",
    vehicleLicense: "XYZ789",
    vehicleVin: "WAUZZZ885565432",
    vehicleCarId: "AUD-2020-002",
    serviceType: 2,
    notes: "Engine repair",
    isPaid: true,
    isCompleted: true,
    needsLoanerCar: false
  },
  {
    id: "3",
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    customerId: "c3",
    customerName: "Erik Svensson",
    customerEmail: "erik@example.com",
    customerPhone: "076-789-1234",
    customerAddress: {
      street: "Vasagatan 5",
      zipCode: "11122",
      city: "Malmö"
    },
    vehicleInfo: "BMW 3 Series, DEF456",
    vehicleMake: "BMW",
    vehicleModel: "3 Series",
    vehicleLicense: "DEF456",
    vehicleVin: "WBA57210987654",
    vehicleCarId: "BMW-2019-003",
    serviceType: 3,
    notes: "Pre-purchase inspection",
    loanerCarId: "car1",
    isPaid: false,
    isCompleted: false,
    needsLoanerCar: true
  }
];
