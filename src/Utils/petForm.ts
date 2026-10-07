import { PetSpecieBreedListData } from "../Data/PetSpecieBreedListData";
import { getLocalPetBreeds } from "./petPresentation";
import type { PetApiDTO, PetFormValues, PetPayloadContext, CreatePetDTO } from "../Types/types";

export function petToForm(pet?: PetApiDTO, tutorName = ""): PetFormValues {
  const initialSpecies = PetSpecieBreedListData[0]?.species || "Canino";
  return {
    name: pet?.name || "",
    birthDate: pet?.birthDate || "",
    unknownBirthDate: false,
    tutor: pet?.owner?.name || tutorName,
    sex: pet?.sex === "FEMALE" ? "Femea" : "Macho",
    species: pet?.species?.name || initialSpecies,
    breed: pet?.breed?.name || getLocalPetBreeds(initialSpecies)[0] || "",
  };
}

export function validatePetForm(values: PetFormValues): string | null {
  return values.name.trim() ? null : "Por favor, informe o nome do pet.";
}

function formatBirthDate(values: PetFormValues, today: string): string {
  const date = values.birthDate.trim();
  if (values.unknownBirthDate || !date) return today;
  const parts = date.split("/");
  return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : date;
}

// Preserva as regras legadas; IDs padrão e resolução de raça serão revistos
// na etapa de integração dos catálogos, separadamente desta refatoração.
export function petToPayload(values: PetFormValues, context: PetPayloadContext): CreatePetDTO {
  const speciesName = values.species.toLowerCase();
  const localSpecies = PetSpecieBreedListData.find((item) => item.species.toLowerCase() === speciesName);
  const apiName = localSpecies?.apiName?.toLowerCase() || speciesName;
  const species = context.species.find((item) =>
    item.name.toLowerCase() === speciesName || item.name.toLowerCase() === apiName
  ) || context.species[0];
  const breed = context.breeds.find((item) => item.name.toLowerCase() === values.breed.toLowerCase());

  return {
    name: values.name.trim(),
    birthDate: formatBirthDate(values, context.today),
    sex: values.sex === "Macho" ? "MALE" : "FEMALE",
    ownerId: context.ownerId || 1,
    speciesId: species?.id ?? 1,
    breedId: breed?.id,
  };
}
