import { api } from "./http";
import { RegisterFormData, OwnerApiDTO } from "../Types/types";

export async function registerUser(data: RegisterFormData): Promise<OwnerApiDTO> {
  const response = await api.post<OwnerApiDTO>("/responsaveis", {
    name: data.name,
    cpf: data.cpf,
    email: data.email,
    password: data.senha,
    phone: data.phone,
    cityId: data.cityId,
  });
  return response.data;
}

export async function getProfile(id: number): Promise<OwnerApiDTO> {
  const response = await api.get<OwnerApiDTO>(`/responsaveis/${id}`);
  return response.data;
}

export async function updateProfile(id: number, data: RegisterFormData): Promise<OwnerApiDTO> {
  const response = await api.put<OwnerApiDTO>(`/responsaveis/${id}`, {
    name: data.name,
    cpf: data.cpf,
    email: data.email,
    password: data.senha,
    phone: data.phone,
    cityId: data.cityId,
  });
  return response.data;
}

export async function deleteAccount(id: number): Promise<void> {
  await api.delete(`/responsaveis/${id}`);
}
