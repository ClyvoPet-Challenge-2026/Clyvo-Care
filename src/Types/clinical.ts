export interface ClinicApiDTO {
  id: number;
  name: string;
  cnpj: string;
  phone?: string | null;
  city: { id: number; name: string; state: { id: number; name: string; abbreviation?: string } };
}

export interface CreateAppointmentDTO {
  petId: number;
  clinicId: number;
  eventType: "CONSULTATION" | "VACCINATION" | "FOLLOW_UP";
  scheduledAt: string;
  reason: string;
  notes?: string;
}

export interface AppointmentApiDTO extends CreateAppointmentDTO {
  id: number;
  status: "SCHEDULED" | "COMPLETED" | "CANCELED";
}
