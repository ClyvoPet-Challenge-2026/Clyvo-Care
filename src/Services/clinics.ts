import { dotnetApi } from "./http";
import type { ClinicApiDTO } from "../Types/clinical";

export async function listClinics(): Promise<ClinicApiDTO[]> {
  const response = await dotnetApi.get<ClinicApiDTO[]>("/api/clinicas");
  return response.data;
}
