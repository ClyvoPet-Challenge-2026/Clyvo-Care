import { api } from "./http";
import { LoginFormData, LoginResponseDTO } from "../Types/types";

export async function loginUser(data: LoginFormData): Promise<LoginResponseDTO> {
  const response = await api.post<LoginResponseDTO>("/auth/login", {
    email: data.email,
    password: data.senha,
  });
  return response.data;
}
