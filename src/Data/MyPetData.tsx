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
    species: "Dog",
    breed: "Golden Retriever",
    sex: "Male",
    age: 3,
    tutor: "Emily Carter",
  },
  {
    identifier: 2,
    id: "cat-1",
    img: Cat,
    name: "Nova",
    species: "Cat",
    breed: "Maine Coon",
    sex: "Female",
    age: 2,
    tutor: "James Parker",
  },
  {
    identifier: 3,
    id: "bird-1",
    img: Bird,
    name: "Skye",
    species: "Bird",
    breed: "Blue-and-gold Macaw",
    sex: "Female",
    age: 4,
    tutor: "Olivia Reed",
  },
  {
    identifier: 4,
    id: "fish-1",
    img: Fish,
    name: "Nemo",
    species: "Fish",
    breed: "Clownfish",
    sex: "Male",
    age: 1,
    tutor: "Ethan Brooks",
  },
  {
    identifier: 5,
    id: "rodent-1",
    img: Rodent,
    name: "Peanut",
    species: "Rodent",
    breed: "Syrian Hamster",
    sex: "Male",
    age: 1,
    tutor: "Sophia Lane",
  },
  {
    identifier: 6,
    id: "reptile-1",
    img: Reptile,
    name: "Echo",
    species: "Reptile",
    breed: "Leopard Gecko",
    sex: "Female",
    age: 5,
    tutor: "Daniel Price",
  },
];