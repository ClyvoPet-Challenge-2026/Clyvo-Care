import * as Location from "expo-location";

export type UserCoordinates = {
  latitude: number;
  longitude: number;
};

export async function obterLocalizacaoObrigatoria(): Promise<UserCoordinates> {
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
