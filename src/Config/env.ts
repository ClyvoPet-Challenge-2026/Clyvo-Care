export const JAVA_API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ||
  "https://clyvocare-java-rm561584.azurewebsites.net";

export const env = {
  apiUrl: JAVA_API_BASE_URL,
  dotnetApiUrl: process.env.EXPO_PUBLIC_DOTNET_API_URL ||
    "https://clyvocare-dotnet-rm561584.azurewebsites.net",
};
