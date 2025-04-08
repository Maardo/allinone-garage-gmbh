
export interface LoanerCar {
  id: string;
  name: string;
  license: string;
  isAvailable: boolean;
  assignedTo?: string;
  assignedUntil?: Date;
  assignedFrom?: Date;
  appointmentId?: string;
}
