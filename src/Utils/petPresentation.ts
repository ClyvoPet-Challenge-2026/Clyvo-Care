import { MyPetData } from "../Data/MyPetData";
import { PetSpecieBreedListData } from "../Data/PetSpecieBreedListData";

export function getPetSpeciesLabel(speciesName = "") {
  const normalizedName = speciesName.toLowerCase();
  const species = PetSpecieBreedListData.find(
    (item) => item.species.toLowerCase() === normalizedName
      || item.apiName?.toLowerCase() === normalizedName
  );

  return species?.species || speciesName;
}

export function getPetSpeciesImage(speciesName = "") {
  const label = getPetSpeciesLabel(speciesName).toLowerCase();

  return MyPetData.find((pet) => pet.species.toLowerCase() === label)?.img
    || MyPetData[0]?.img;
}

export function getLocalPetBreeds(speciesLabel: string) {
  return PetSpecieBreedListData.find((item) => item.species === speciesLabel)?.breeds || [];
}
