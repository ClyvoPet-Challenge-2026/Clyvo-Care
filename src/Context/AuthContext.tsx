import { getStoredToken, saveStoredSession, clearStoredSession, clearStoredProfile } from "../Services/sessionStorage";
import { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { loginUser, getCurrentUser } from "../Services/auth";
import { registerUser } from "../Services/owner";
import { setUnauthorizedHandler } from "../Services/http";
import { queryKeys } from "../Lib/queryKeys";
import type { LoginFormData, RegisterFormData, OwnerApiDTO, AuthContextType } from "../Types/types";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<OwnerApiDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const sessionVersion = useRef(0);
  const queryClient = useQueryClient();

  const logout = useCallback(async () => {
    sessionVersion.current += 1;
    setUser(null);
    queryClient.clear();
    await clearStoredSession();
  }, [queryClient]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      void logout().catch((error) => console.error("Erro ao limpar sessão:", error));
    });
    return () => setUnauthorizedHandler(null);
  }, [logout]);

  useEffect(() => {
    let active = true;
    const version = sessionVersion.current;
    const restoreSession = async () => {
      try {
        const token = await getStoredToken();
        if (!token) {
          await clearStoredProfile();
          return;
        }
        const profile = await getCurrentUser(token);
        if (!active || version !== sessionVersion.current) return;
        queryClient.setQueryData(queryKeys.owner.profile(profile.id), profile);
        setUser(profile);
      } catch (error) {
        // Dados locais não autenticam. Falhas temporárias preservam o token
        // para uma nova abertura; respostas 401 são tratadas pelo interceptor.
        console.warn("Não foi possível validar a sessão:", error);
      } finally {
        if (active) setLoading(false);
      }
    };
    void restoreSession();
    return () => { active = false; };
  }, [queryClient]);

  const login = async (data: LoginFormData) => {
    const version = ++sessionVersion.current;
    const { token } = await loginUser(data);
    if (typeof token !== "string" || !token.trim()) {
      throw new Error("O servidor não retornou um token de acesso válido.");
    }
    // Não publica uma sessão até confirmar a identidade autenticada.
    const profile = await getCurrentUser(token);
    if (version !== sessionVersion.current) throw new Error("Login interrompido. Tente novamente.");
    try {
      await saveStoredSession(token, profile);
    } catch (error) {
      await logout();
      throw error;
    }
    if (version !== sessionVersion.current) return;
    queryClient.clear();
    queryClient.setQueryData(queryKeys.owner.profile(profile.id), profile);
    setUser(profile);
  };

  const register = async (data: RegisterFormData) => {
    await registerUser(data);
    try {
      await login({ email: data.email, senha: data.senha });
    } catch {
      throw new Error("Cadastro realizado, mas não foi possível entrar automaticamente. Vá para Entrar e use o e-mail e a senha cadastrados.");
    }
  };

  const updateUser = async (data: Partial<OwnerApiDTO>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    queryClient.setQueryData(queryKeys.owner.profile(user.id), updated);
    setUser(updated);
  };

  const refreshUser = async () => {
    if (!user) return;
    const version = sessionVersion.current;
    const profile = await getCurrentUser();
    if (version !== sessionVersion.current) return;
    queryClient.setQueryData(queryKeys.owner.profile(profile.id), profile);
    setUser(profile);
  };

  return (
    <AuthContext.Provider value={{ loggedIn: !!user, loading, user, login, register, logout, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
