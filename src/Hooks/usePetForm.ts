import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../Context/AuthContext";
import { useSpecies, useBreeds, useCreatePet, useUpdatePet } from "./usePets";
import { getPetSpeciesImage } from "../Utils/petPresentation";
import { petToForm, petToPayload, validatePetForm } from "../Utils/petForm";
import type { PetFormTextField, UsePetFormOptions } from "../Types/types";

export function usePetForm({ petToEdit, onSuccess }: UsePetFormOptions) {
  const { user } = useAuth();
  const speciesQuery = useSpecies();
  const breedsQuery = useBreeds();
  const species = speciesQuery.data ?? [];
  const breeds = breedsQuery.data ?? [];
  const catalogError = speciesQuery.isError || breedsQuery.isError;
  const catalogLoading = speciesQuery.isPending || breedsQuery.isPending;
  const catalogMessage = catalogError ? "Não foi possível carregar espécies e raças. Tente novamente."
    : catalogLoading ? "Carregando espécies e raças..."
    : !species.length ? "Nenhuma espécie disponível para cadastro." : "";
  const createMutation = useCreatePet();
  const updateMutation = useUpdatePet();
  const isEditing = !!petToEdit;
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const [values, setValues] = useState(() => petToForm(petToEdit, user?.name));

  const updateField = (field: PetFormTextField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const selectSpecies = (species: string) => {
    setValues((current) => ({ ...current, species, breed: current.species === species ? current.breed : "" }));
  };

  const toggleUnknownBirthDate = () => {
    setValues((current) => ({
      ...current,
      unknownBirthDate: !current.unknownBirthDate,
      birthDate: current.unknownBirthDate ? current.birthDate : "",
    }));
  };

  const save = async () => {
    const error = validatePetForm(values);
    if (error) {
      Alert.alert("Atenção", error);
      return;
    }
    if (isSaving) return;
    if (catalogMessage) {
      Alert.alert("Atenção", catalogMessage);
      return;
    }

    try {
      if (petToEdit && (!Number.isSafeInteger(petToEdit.id) || petToEdit.id <= 0)) {
        throw new Error("Não foi possível identificar o pet. Reabra a listagem.");
      }
      if (!Number.isSafeInteger(user?.id) || user!.id <= 0) {
        throw new Error("Não foi possível identificar sua sessão. Entre novamente.");
      }
      const payload = petToPayload(values, {
        ownerId: petToEdit ? petToEdit.owner?.id : user?.id,
        species, breeds, today: new Date().toISOString().split("T")[0],
      });
      if (petToEdit) {
        await updateMutation.mutateAsync({ id: petToEdit.id, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      Alert.alert("Sucesso! 🐾", isEditing ? "Pet atualizado com sucesso!" : "Pet cadastrado com sucesso!", [
        { text: isEditing ? "OK" : "Ver Pets", onPress: onSuccess },
      ]);
    } catch (error) {
      Alert.alert("Erro ao salvar pet", error instanceof Error && error.message ? error.message : "Tente novamente.");
    }
  };

  return {
    values, updateField, isEditing, isSaving, save, selectSpecies, toggleUnknownBirthDate,
    catalogMessage,
    canRetryCatalog: catalogError || (!catalogLoading && !species.length),
    retryCatalog: () => Promise.all([speciesQuery.refetch(), breedsQuery.refetch()]),
    speciesLabel: (id: string) => species.find((item) => String(item.id) === id)?.name
      ?? (String(petToEdit?.species?.id) === id ? petToEdit?.species?.name : undefined) ?? "Espécie indisponível",
    breedLabel: (id: string) => !id ? "Não informada" : breeds.find((item) => String(item.id) === id)?.name
      ?? (String(petToEdit?.breed?.id) === id ? petToEdit?.breed?.name : undefined) ?? "Raça indisponível",
    options: {
      species: species.map((item) => String(item.id)),
      breeds: ["", ...breeds.filter((item) => String(item.species?.id) === values.species).map((item) => String(item.id))],
    },
    image: getPetSpeciesImage(species.find((item) => String(item.id) === values.species)?.name ?? petToEdit?.species?.name),
  };
}
