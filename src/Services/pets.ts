import { api } from "./http";
import { SpeciesApiDTO, BreedApiDTO, PetApiDTO, CreatePetDTO } from "../Types/types";

export async function listPetsByOwner(ownerId: number): Promise<PetApiDTO[]> {
  const response = await api.get<{ content: PetApiDTO[] } | PetApiDTO[]>("/pets", {
    params: { ownerId },
  });
  // Se a API retornar objeto paginado Spring Page (content) ou List
  if ("content" in response.data) {
    return response.data.content;
  }
  return response.data;
}

export async function getPetById(id: number): Promise<PetApiDTO> {
  const response = await api.get<PetApiDTO>(`/pets/${id}`);
  return response.data;
}

export async function createPet(data: CreatePetDTO): Promise<PetApiDTO> {
  const response = await api.post<PetApiDTO>("/pets", data);
  return response.data;
}

export async function updatePet(id: number, data: CreatePetDTO): Promise<PetApiDTO> {
  const response = await api.put<PetApiDTO>(`/pets/${id}`, data);
  return response.data;
}

export async function deletePet(id: number): Promise<void> {
  await api.delete(`/pets/${id}`);
}

export async function listSpecies(): Promise<SpeciesApiDTO[]> {
  const response = await api.get<SpeciesApiDTO[]>("/especies");
  return response.data;
}

export async function listBreeds(): Promise<BreedApiDTO[]> {
  const response = await api.get<BreedApiDTO[]>("/racas");
  return response.data;
}