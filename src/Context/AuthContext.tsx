import AsyncStorage from "@react-native-async-storage/async-storage";
import { createContext, useContext, useEffect, useState } from "react";
import { loginUser, registerUser, getProfile } from "../Services/auth";
import { LoginFormData, RegisterFormData, OwnerApiDTO } from "../Types/types";

interface AuthContextType {
  loggedIn: boolean;
  loading: boolean;
  user: OwnerApiDTO | null;
  login: (data: LoginFormData) => Promise<void>;
  loginGuest: () => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const USER_KEY = "@clyvo_user_data";

export const GUEST_USER: OwnerApiDTO = {
  id: 1,
  name: "Dr. Roberto Silva",
  email: "roberto.silva@clyvo.com.br",
  cpf: "11111111111",
  phone: "(11) 98765-4321",
  city: {
    id: 1,
    name: "São Paulo",
    state: {
      id: 1,
      name: "São Paulo",
      uf: "SP",
    },
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<OwnerApiDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredSession();
  }, []);

  const loadStoredSession = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_KEY);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Erro ao carregar sessão do usuário:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (data: LoginFormData) => {
    const authRes = await loginUser(data);
    await AsyncStorage.setItem("authToken", authRes.token);

    // Constrói o perfil com base nas credenciais autenticadas pelo JWT
    const authenticatedUser: OwnerApiDTO = {
      id: 1, // Identificador padrão da sessão autenticada
      name: data.email.split("@")[0],
      email: data.email,
      cpf: "",
      phone: "",
    };

    await AsyncStorage.setItem(USER_KEY, JSON.stringify(authenticatedUser));
    setUser(authenticatedUser);
  };

  const loginGuest = async () => {
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(GUEST_USER));
    await AsyncStorage.setItem("authToken", "guest-token");
    setUser(GUEST_USER);
  };

  const register = async (data: RegisterFormData) => {
    const owner = await registerUser(data);
    // Após registrar, autentica para obter o token JWT
    try {
      const authRes = await loginUser({ email: data.email, senha: data.senha });
      await AsyncStorage.setItem("authToken", authRes.token);
    } catch (e) {
      console.warn("Não foi possível logar automaticamente após cadastro:", e);
    }
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(owner));
    setUser(owner);
  };

  const refreshUser = async () => {
    if (user?.id) {
      try {
        const refreshed = await getProfile(user.id);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(refreshed));
        setUser(refreshed);
      } catch (e) {
        console.warn("Não foi possível atualizar o perfil online:", e);
      }
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(USER_KEY);
      await AsyncStorage.removeItem("authToken");
      setUser(null);
    } catch (error) {
      console.error("Erro ao encerrar sessão:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loggedIn: !!user,
        loading,
        user,
        login,
        loginGuest,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
