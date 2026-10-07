import { api } from "./http";
import { LoginFormData, LoginResponseDTO, OwnerApiDTO } from "../Types/types";

export async function loginUser(data: LoginFormData): Promise<LoginResponseDTO> {
  const response = await api.post<LoginResponseDTO>("/auth/login", {
    email: data.email,
    password: data.senha,
  });
  return response.data;
}

// A identidade vem do subject do JWT no servidor, nunca de um ID local.
export async function getCurrentUser(token?: string): Promise<OwnerApiDTO> {
  const response = await api.get<OwnerApiDTO>("/auth/me", token
    ? { headers: { Authorization: `Bearer ${token}` } }
    : undefined);
  if (!Number.isInteger(response.data?.id) || response.data.id <= 0) {
    throw new Error("O servidor não retornou um perfil válido para esta sessão.");
  }
  return response.data;
}
