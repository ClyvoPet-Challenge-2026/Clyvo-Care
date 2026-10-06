import AsyncStorage from "@react-native-async-storage/async-storage";

// Persistência legada da seleção local. Ainda não representa contratação na API.
const SUBSCRIPTION_STORAGE_KEY = "@clyvo_active_plan";

export async function getStoredPlanId(): Promise<string | null> {
  return AsyncStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
}

export async function saveStoredPlanId(planId: string): Promise<void> {
  await AsyncStorage.setItem(SUBSCRIPTION_STORAGE_KEY, planId);
}
