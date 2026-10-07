import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../Context/AuthContext";
import { usePets, useDeletePet } from "./usePets";
import { SPECIES_FILTER_LIST } from "../Data/SpeciesFilterData";
import { filterPets } from "../Utils/petFilters";

export function usePetList() {
  const { user } = useAuth();

  const query = usePets(user?.id);
  const deletePetMutation = useDeletePet();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Todos");

  const requestDelete = (petId: number, petName: string) => {
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

  return {
    query,
    filteredPets: filterPets(query.data ?? [], searchTerm, selectedFilter),
    filters: { searchTerm, setSearchTerm, selectedFilter, setSelectedFilter, speciesList: SPECIES_FILTER_LIST },
    requestDelete,
  };
}
