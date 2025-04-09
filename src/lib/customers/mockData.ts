
import { Customer, Vehicle } from "@/lib/types";

export const MOCK_CUSTOMERS: Customer[] = [
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
