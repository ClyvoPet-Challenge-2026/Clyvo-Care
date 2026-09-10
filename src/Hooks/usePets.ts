import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listPetsByOwner, createPet, updatePet, deletePet, listSpecies, listBreeds, } from "../Services/pets";
import { CreatePetDTO, PetApiDTO } from "../Types/types";
import { queryKeys } from "../Lib/queryKeys";

export function usePets(ownerId?: number) {
  return useQuery({
    queryKey: queryKeys.pets.list(ownerId),
    queryFn: () => {
      if (!ownerId) return Promise.resolve([] as PetApiDTO[]);
      return listPetsByOwner(ownerId);
    },
    enabled: !!ownerId,
  });
}

export function useSpecies() {
  return useQuery({
    queryKey: queryKeys.pets.species,
    queryFn: () => listSpecies(),
    staleTime: 1000 * 60 * 10, // 10 minutos (dados estáticos)
  });
}

export function useBreeds() {
  return useQuery({
    queryKey: queryKeys.pets.breeds(),
    queryFn: () => listBreeds(),
    staleTime: 1000 * 60 * 10,
  });
}

export function useCreatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePetDTO) => createPet(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.list(variables.ownerId) });
    },
  });
}

export function useUpdatePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: CreatePetDTO }) => updatePet(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
    },
  });
}

export function useDeletePet() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deletePet(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.pets.all });
    },
  });
}
