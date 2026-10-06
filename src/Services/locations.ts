import { api } from "./http";
import { StateApiDTO, CityApiDTO } from "../Types/types";

export async function getStates(): Promise<StateApiDTO[]> {
  const response = await api.get<StateApiDTO[]>("/estados");
  return response.data;
}

export async function getCities(): Promise<CityApiDTO[]> {
  const response = await api.get<CityApiDTO[]>("/cidades");
  return response.data;
}
