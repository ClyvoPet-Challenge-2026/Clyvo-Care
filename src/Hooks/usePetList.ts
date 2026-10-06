import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../Context/AuthContext";
import { usePets, useDeletePet } from "./usePets";
import { SPECIES_FILTER_LIST } from "../Data/SpeciesFilterData";
import { getPetSpeciesLabel } from "../Utils/petPresentation";

export function usePetList() {
  const { user } = useAuth();

  const { data: pets = [], isLoading: loading, isError, error, refetch } = usePets(user?.id);
  const deletePetMutation = useDeletePet();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Todos");

  const speciesList = SPECIES_FILTER_LIST;

  const handleDeletePet = (petId: number, petName: string) => {
    Alert.alert(
      "Remover Pet",
      `Tem certeza que deseja remover ${petName}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePetMutation.mutateAsync(petId);
            } catch (err: any) {
              Alert.alert("Erro", err.message || "Não foi possível remover o pet.");
            }
          },
        },
      ]
    );
  };

  const filteredPets = pets.filter((pet) => {
    const breedName = pet.breed?.name || "";
    const speciesName = pet.species?.name || "";
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      breedName.toLowerCase().includes(searchTerm.toLowerCase());

    const resolvedSpecieLabel = getPetSpeciesLabel(speciesName);

    const matchesFilter =
      selectedFilter === "Todos" ||
      (selectedFilter === "Outros"
        ? !["Canino", "Felino", "Ave"].includes(resolvedSpecieLabel)
        : resolvedSpecieLabel.toLowerCase() === selectedFilter.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  return {
    pets, filteredPets, loading, isError, error, refetch,
    searchTerm, setSearchTerm, selectedFilter, setSelectedFilter,
    speciesList, handleDeletePet,
  };
}
