import * as Location from "expo-location";
import { UserCoordinates } from "../Types/chatbot";

export async function obtainMandatoryLocation(): Promise<UserCoordinates> {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== Location.PermissionStatus.GRANTED) {
    throw new Error(
      "A permissão de localização é obrigatória para usar o assistente.",
    );
  }

  const position = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });

  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
  };
}
