import { api } from "./http";
import { SpeciesApiDTO, BreedApiDTO, PetApiDTO, CreatePetDTO, SpringPage } from "../Types/types";

export async function listPetsByOwner(ownerId: number): Promise<PetApiDTO[]> {
  const pets: PetApiDTO[] = [];
  let page = 0;
  while (true) {
    const { data } = await api.get<SpringPage<PetApiDTO> | PetApiDTO[]>("/pets", {
      params: { ownerId, page, size: 100, sort: "id,asc" },
    });
    if (Array.isArray(data)) return data;
    pets.push(...data.content);
    if (data.last || page + 1 >= data.totalPages) return pets;
    page += 1;
  }
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