import { Platform } from "react-native";

function getApiUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Fallbacks caso o arquivo .env não tenha sido criado
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8080";
  }
  return "http://localhost:8080";
}

export const JAVA_API_BASE_URL = getApiUrl();

export const env = {
  apiUrl: JAVA_API_BASE_URL,
  dotnetApiUrl: process.env.EXPO_PUBLIC_DOTNET_API_URL || (Platform.OS === "android" ? "http://10.0.2.2:5067" : "http://localhost:5067"),
};
