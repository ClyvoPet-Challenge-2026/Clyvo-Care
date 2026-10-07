import AsyncStorage from "@react-native-async-storage/async-storage";
import type { OwnerApiDTO } from "../Types/types";

// Mantém as chaves existentes para preservar sessões já gravadas no dispositivo.
const TOKEN_KEY = "authToken";
const USER_KEY = "@clyvo_user_data";

export function getStoredToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function saveStoredSession(token: string, profile: OwnerApiDTO): Promise<void> {
  await AsyncStorage.multiSet([
    [TOKEN_KEY, token],
    [USER_KEY, JSON.stringify(profile)],
  ]);
}

export async function clearStoredSession(): Promise<void> {
  await AsyncStorage.multiRemove([USER_KEY, TOKEN_KEY]);
}

// O perfil local é apenas cache; nunca serve para autenticar sem token e /auth/me.
export async function clearStoredProfile(): Promise<void> {
  await AsyncStorage.removeItem(USER_KEY);
}
