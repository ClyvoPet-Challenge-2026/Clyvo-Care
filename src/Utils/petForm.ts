import type { PetApiDTO, PetFormValues, PetPayloadContext, CreatePetDTO } from "../Types/types";

export function petToForm(pet?: PetApiDTO, tutorName = ""): PetFormValues {
  return {
    name: pet?.name || "",
    birthDate: pet?.birthDate || "",
    unknownBirthDate: false,
    tutor: pet ? pet.owner?.name ?? "" : tutorName,
    sex: pet?.sex === "FEMALE" ? "Femea" : pet?.sex === "MALE" ? "Macho" : "",
    species: pet?.species ? String(pet.species.id) : "",
    breed: pet?.breed ? String(pet.breed.id) : "",
  };
}

export function validatePetForm(values: PetFormValues): string | null {
  if (!values.name.trim()) return "Por favor, informe o nome do pet.";
  if (!["Macho", "Femea"].includes(values.sex)) return "Selecione o sexo do pet.";
  return null;
}

function formatBirthDate(values: PetFormValues, today: string): string {
  const date = values.birthDate.trim();
  if (values.unknownBirthDate || !date) return today;
  const parts = date.split("/");
  return parts.length === 3 ? `${parts[2]}-${parts[1]}-${parts[0]}` : date;
}

export function petToPayload(values: PetFormValues, context: PetPayloadContext): CreatePetDTO {
  if (!Number.isSafeInteger(context.ownerId) || context.ownerId! <= 0) {
    throw new Error("Não foi possível identificar o tutor. Entre novamente antes de salvar.");
  }
  const species = context.species.find((item) => String(item.id) === values.species);
  if (!species || !Number.isSafeInteger(species.id) || species.id <= 0) {
    throw new Error("Selecione uma espécie disponível no catálogo.");
  }
  const breed = context.breeds.find((item) => String(item.id) === values.breed);
  if (values.breed && (!breed || !Number.isSafeInteger(breed.id) || breed.id <= 0 || breed.species?.id !== species.id)) {
    throw new Error("Selecione uma raça da espécie escolhida ou deixe a raça sem informar.");
  }

  return {
    name: values.name.trim(),
    birthDate: formatBirthDate(values, context.today),
    sex: values.sex === "Macho" ? "MALE" : "FEMALE",
    ownerId: context.ownerId!,
    speciesId: species.id,
    breedId: breed?.id,
  };
}
