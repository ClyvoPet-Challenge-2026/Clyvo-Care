import type { PetApiDTO } from "../Types/types";
import { getPetSpeciesLabel } from "./petPresentation";

export function filterPets(pets: PetApiDTO[], searchTerm: string, selectedFilter: string): PetApiDTO[] {
  const search = searchTerm.toLowerCase();
  const filter = selectedFilter.toLowerCase();

  return pets.filter((pet) => {
    const matchesSearch = pet.name.toLowerCase().includes(search) ||
      (pet.breed?.name || "").toLowerCase().includes(search);
    if (!matchesSearch) return false;
    if (selectedFilter === "Todos") return true;

    const species = getPetSpeciesLabel(pet.species?.name || "");
    if (selectedFilter === "Outros") return !["Canino", "Felino", "Ave"].includes(species);
    return species.toLowerCase() === filter;
  });
}
