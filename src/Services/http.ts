import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { env } from "../env";

export const api = axios.create({
  baseURL: env.apiUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

let onUnauthorized: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

// Interceptor para injetar o Token JWT automaticamente em todas as requisições autenticadas
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("Não foi possível obter authToken do AsyncStorage:", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<any>) => {
    const status = error.response?.status ?? 0;

    // Se o token expirou ou for inválido (401), dispara deslogar automático
    if (status === 401) {
      onUnauthorized?.();
    }

    // Timeout
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      return Promise.reject(
        new Error(
          `Tempo limite excedido ao conectar em ${env.apiUrl}. Verifique se o backend está acessível na mesma rede Wi-Fi.`
        )
      );
    }

    // Erro de rede (ex: conexão recusada, IP inacessível)
    if (!error.response) {
      return Promise.reject(
        new Error(
          `Sem conexão com o servidor (${env.apiUrl}). Verifique sua conexão e a URL configurada.`
        )
      );
    }

    // Resposta de erro do Spring Boot (ex: 400 Bad Request com validação ou 409 Conflict)
    const data = error.response.data;
    const message =
      data?.message ||
      data?.error ||
      (typeof data === "string" ? data : null) ||
      `Erro na requisição (Status ${error.response.status}).`;

    return Promise.reject(new Error(message));
  }
);