import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../Context/AuthContext";
import { useSpecies, useBreeds, useCreatePet, useUpdatePet } from "./usePets";
import { getPetSpeciesImage, getLocalPetBreeds } from "../Utils/petPresentation";
import { petToForm, petToPayload, validatePetForm } from "../Utils/petForm";
import { PetSpecieBreedListData } from "../Data/PetSpecieBreedListData";
import type { PetFormTextField, UsePetFormOptions } from "../Types/types";

export function usePetForm({ petToEdit, onSuccess }: UsePetFormOptions) {
  const { user } = useAuth();
  const { data: species = [] } = useSpecies();
  const { data: breeds = [] } = useBreeds();
  const createMutation = useCreatePet();
  const updateMutation = useUpdatePet();
  const isEditing = !!petToEdit;
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const [values, setValues] = useState(() => petToForm(petToEdit, user?.name));

  const updateField = (field: PetFormTextField, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const selectSpecies = (species: string) => {
    setValues((current) => ({ ...current, species, breed: getLocalPetBreeds(species)[0] || "" }));
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
    const payload = petToPayload(values, {
      ownerId: user?.id, species, breeds, today: new Date().toISOString().split("T")[0],
    });

    try {
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
    options: {
      species: PetSpecieBreedListData.map((item) => item.species),
      breeds: getLocalPetBreeds(values.species),
    },
    image: getPetSpeciesImage(values.species),
  };
}
