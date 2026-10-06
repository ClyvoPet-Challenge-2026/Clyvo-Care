import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../Context/AuthContext";
import { useSpecies, useBreeds, useCreatePet, useUpdatePet } from "./usePets";
import { getPetSpeciesImage, getLocalPetBreeds } from "../Utils/petPresentation";
import { PetSpecieBreedListData } from "../Data/PetSpecieBreedListData";
import type { UsePetFormOptions } from "../Types/types";

export function usePetForm({ petToEdit, onSuccess }: UsePetFormOptions) {
    const isEditing = !!petToEdit;
    const { user } = useAuth();
    const { data: apiSpecies = [] } = useSpecies();
    const { data: apiBreeds = [] } = useBreeds();
    const createPetMutation = useCreatePet();
    const updatePetMutation = useUpdatePet();
    const isSaving = createPetMutation.isPending || updatePetMutation.isPending;

    // Listas do design original
    const specieOptions = PetSpecieBreedListData.map((item) => item.species);
    const initialSpecie = specieOptions[0] || "Canino";
    const initialBreeds = getLocalPetBreeds(initialSpecie);
    const fallbackDefaultBreed = initialBreeds[0] || "";

    const [petName, setPetName] = useState(petToEdit?.name || "");
    const [petBirthDate, setPetBirthDate] = useState(petToEdit?.birthDate || "");
    const [unknownBirthDate, setUnknownBirthDate] = useState(false);
    const [petTutor, setPetTutor] = useState(petToEdit?.owner?.name || user?.name || "");
    const [selectedSex, setSelectedSex] = useState<string>(
        petToEdit?.sex === "FEMALE" ? "Femea" : "Macho"
    );
    const [selectedSpecie, setSelectedSpecie] = useState<string>(
        petToEdit?.species?.name || initialSpecie
    );
    const [selectedBreed, setSelectedBreed] = useState<string>(
        petToEdit?.breed?.name || fallbackDefaultBreed
    );

    const breedOptions =
        getLocalPetBreeds(selectedSpecie);

    const selectedPetImage = getPetSpeciesImage(selectedSpecie);

    const handleSpecieSelect = (value: string) => {
        setSelectedSpecie(value);
        const nextBreeds =
            getLocalPetBreeds(value);
        setSelectedBreed(nextBreeds[0] || "");
    };

    const handleSavePet = async () => {
        if (!petName.trim()) {
            Alert.alert("Atenção", "Por favor, informe o nome do pet.");
            return;
        }

        const ownerId = user?.id || 1;

        // Tenta encontrar ID da espécie na API (comparando com nome em PT ou EN)
        const currentSpecieItem = PetSpecieBreedListData.find(
            (item) => item.species.toLowerCase() === selectedSpecie.toLowerCase()
        );
        const targetApiName = currentSpecieItem?.apiName?.toLowerCase() || selectedSpecie.toLowerCase();

        const matchedSpecies = apiSpecies.find((s) => {
            const sName = s.name.toLowerCase();
            return sName === selectedSpecie.toLowerCase() || sName === targetApiName;
        }) || apiSpecies[0];
        const speciesId = matchedSpecies ? matchedSpecies.id : 1;

        // Tenta encontrar ID da raça na API
        const matchedBreed = apiBreeds.find(
            (b) => b.name.toLowerCase() === selectedBreed.toLowerCase()
        );
        const breedId = matchedBreed ? matchedBreed.id : undefined;

        // Formatação da data (se "Não sei", usa a data atual)
        let formattedDate = petBirthDate.trim();
        if (unknownBirthDate || !formattedDate) {
            formattedDate = new Date().toISOString().split("T")[0];
        } else if (formattedDate.includes("/")) {
            const parts = formattedDate.split("/");
            if (parts.length === 3) {
                formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
            }
        }

        const payload = {
            name: petName.trim(),
            birthDate: formattedDate,
            sex: (selectedSex === "Macho" ? "MALE" : "FEMALE") as "MALE" | "FEMALE",
            ownerId,
            speciesId,
            breedId,
        };

        try {
            if (isEditing && petToEdit) {
                await updatePetMutation.mutateAsync({ id: petToEdit.id, data: payload });
                Alert.alert("Sucesso! 🐾", "Pet atualizado com sucesso!", [
                    { text: "OK", onPress: onSuccess }
                ]);
            } else {
                await createPetMutation.mutateAsync(payload);
                Alert.alert("Sucesso! 🐾", "Pet cadastrado com sucesso!", [
                    { text: "Ver Pets", onPress: onSuccess }
                ]);
            }
        } catch (err: any) {
            Alert.alert("Erro ao salvar pet", err.message || "Tente novamente.");
        }
    };

    const toggleUnknownBirthDate = () => {
        const next = !unknownBirthDate;
        setUnknownBirthDate(next);
        if (next) setPetBirthDate("");
    };

    return {
        isEditing,
        isSaving,
        petName,
        setPetName,
        petBirthDate,
        setPetBirthDate,
        unknownBirthDate,
        toggleUnknownBirthDate,
        petTutor,
        setPetTutor,
        selectedSex,
        setSelectedSex,
        selectedSpecie,
        selectedBreed,
        setSelectedBreed,
        specieOptions,
        breedOptions,
        selectedPetImage,
        handleSpecieSelect,
        handleSavePet,
    };
}
