import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getStoredToken } from "./sessionStorage";
import { env } from "../Config/env";

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
      const token = await getStoredToken();
      const isPublicRequest = config.url === "/auth/login" ||
        (config.url === "/responsaveis" && config.method === "post");
      if (!isPublicRequest && token && config.headers && !config.headers.Authorization) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("Não foi possível obter o token da sessão:", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<any>) => {
    const status = error.response?.status ?? 0;

    // Uma resposta atrasada de outra sessão não deve encerrar a sessão atual.
    if (status === 401 && error.config?.headers?.Authorization) {
      try {
        const token = await getStoredToken();
        if (token && error.config.headers.Authorization === `Bearer ${token}`) {
          onUnauthorized?.();
        }
      } catch (storageError) {
        console.warn("Não foi possível conferir a sessão expirada:", storageError);
      }
    }

    // Timeout
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      error.message = `Tempo limite excedido ao conectar em ${env.apiUrl}. Verifique se o backend está acessível na mesma rede Wi-Fi.`;
      return Promise.reject(error);
    }

    // Erro de rede (ex: conexão recusada, IP inacessível)
    if (!error.response) {
      error.message = `Sem conexão com o servidor (${env.apiUrl}). Verifique sua conexão e a URL configurada.`;
      return Promise.reject(error);
    }

    // Resposta de erro do Spring Boot (ex: 400 Bad Request com validação ou 409 Conflict)
    const data = error.response.data;
    const message =
      data?.message ||
      data?.error ||
      (typeof data === "string" ? data : null) ||
      `Erro na requisição (Status ${error.response.status}).`;

    error.message = message;
    return Promise.reject(error);
  }
);
