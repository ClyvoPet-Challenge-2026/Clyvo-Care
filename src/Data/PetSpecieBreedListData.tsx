export interface PetSpecieBreed {
  species: string;
  apiName?: string;
  breeds: string[];
}

export const PetSpecieBreedListData: PetSpecieBreed[] = [
  {
    species: "Canino",
    apiName: "Dog",
    breeds: ["Golden Retriever", "Labrador", "Bulldog", "Poodle", "Mixed"],
  },
  {
    species: "Felino",
    apiName: "Cat",
    breeds: ["Maine Coon", "Siamese", "Persian"],
  },
  {
    species: "Ave",
    apiName: "Bird",
    breeds: ["Cockatiel"],
  },
  {
    species: "Roedor",
    apiName: "Rabbit",
    breeds: ["Mini Lop"],
  },
  {
    species: "Peixe",
    apiName: "Fish",
    breeds: ["Peixe-palhaço", "Betta", "Guppy"],
  },
  {
    species: "Reptil",
    apiName: "Reptile",
    breeds: ["Leopard Gecko", "Iguana"],
  },
];
