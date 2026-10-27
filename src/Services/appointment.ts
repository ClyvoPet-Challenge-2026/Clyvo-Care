import { dotnetApi } from "./http";
import type { AppointmentApiDTO, CreateAppointmentDTO } from "../Types/clinical";

export async function createAppointment(data: CreateAppointmentDTO): Promise<AppointmentApiDTO> {
  const response = await dotnetApi.post<AppointmentApiDTO>("/api/agendamentos", data);
  if (response.status !== 201 || !response.data?.id) {
    throw new Error("Não foi possível confirmar a criação. Consulte seus agendamentos antes de tentar novamente.");
  }
  return response.data;
}
