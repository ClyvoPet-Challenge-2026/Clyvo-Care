export interface PetSpecieBreed {
  species: string;
  breeds: string[];
}

export const PetSpecieBreedListData: PetSpecieBreed[] = [
  {
    species: "Canino",
    breeds: ["Golden Retriever", "Labrador", "Poodle", "Vira-lata"],
  },
  {
    species: "Felino",
    breeds: ["Maine Coon", "Siamese", "Persa", "SRD"],
  },
  {
    species: "Ave",
    breeds: ["Calopsita", "Arara", "Canario"],
  },
  {
    species: "Peixe",
    breeds: ["Peixe-palhaco", "Betta", "Guppy"],
  },
  {
    species: "Roedor",
    breeds: ["Hamster Sirio", "Porquinho-da-India"],
  },
  {
    species: "Reptil",
    breeds: ["Leopard Gecko", "Iguana"],
  },
];
