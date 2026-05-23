import { ImageSourcePropType } from "react-native";

const Dog = require("../Images/PetImage/dog.jpg");
const Cat = require("../Images/PetImage/cat.jpg");
const Bird = require("../Images/PetImage/bird.jpg");
const Fish = require("../Images/PetImage/fish.jpg");
const Rodent = require("../Images/PetImage/rodent.jpg");
const Reptile = require("../Images/PetImage/reptile.jpg");

export interface Pet {
  identifier: number;
  id: string;
  name: string;
  img: ImageSourcePropType;
  species: string;
  breed: string;
  sex: string;
  age: number;
  tutor: string;
}

export const MyPetData: Pet[] = [
  {
    identifier: 1,
    id: "dog-1",
    img: Dog,
    name: "Thor",
    species: "Canino",
    breed: "Golden Retriever",
    sex: "Macho",
    age: 3,
    tutor: "Emily Carter",
  },
  {
    identifier: 2,
    id: "cat-1",
    img: Cat,
    name: "Nova",
    species: "Felino",
    breed: "Maine Coon",
    sex: "Femea",
    age: 2,
    tutor: "James Parker",
  },
  {
    identifier: 3,
    id: "bird-1",
    img: Bird,
    name: "Blue",
    species: "Ave",
    breed: "Blue-and-gold Macaw",
    sex: "Femea",
    age: 4,
    tutor: "Jade",
  },
  {
    identifier: 4,
    id: "fish-1",
    img: Fish,
    name: "Nemo",
    species: "Peixe",
    breed: "Clownfish",
    sex: "Macho",
    age: 1,
    tutor: "Ethan Brooks",
  },
  {
    identifier: 5,
    id: "rodent-1",
    img: Rodent,
    name: "Rattatouille",
    species: "Roedor",
    breed: "Syrian Hamster",
    sex: "Macho",
    age: 1,
    tutor: "Sophia Lane",
  },
  {
    identifier: 6,
    id: "reptile-1",
    img: Reptile,
    name: "Charizard",
    species: "Reptil",
    breed: "Leopard Gecko",
    sex: "Femea",
    age: 5,
    tutor: "Ash Ketchum",
  },
];