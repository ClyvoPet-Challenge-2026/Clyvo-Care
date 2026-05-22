import { ImageSourcePropType } from "react-native";

const ClyvoSJCampos = require("../Images/Location/ClyvoSJCampos.png");

export interface Location {
  identifier: number;
  id : string; 
  name: string;
  img: ImageSourcePropType; 
  linkMaps: string;
  location: string;
}

export const locations: Location[] = [
  { 
    identifier: 1,
    id: 'ClyvoSJCampos', 
    name: 'São José dos Campos', 
    img: ClyvoSJCampos, 
    linkMaps: 'https://maps.app.goo.gl/UUYKJi6ByGNdPTk46',
    location: 'Rua Giacomo Versolato, 520, Casa 02 CEP 09770-440 – São Bernardo do Campo/SP'
  },
    { 
    identifier: 2,
    id: 'Ficticio1', 
    name: 'Clinica 1', 
    img: ClyvoSJCampos, 
    linkMaps: '',
    location: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
  },
    { 
    identifier: 3,
    id: 'Ficticio2', 
    name: 'Clinica 2', 
    img: ClyvoSJCampos, 
    linkMaps: '',
    location: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
    { 
    identifier: 4,
    id: 'Ficticio3', 
    name: 'Clinica 3', 
    img: ClyvoSJCampos, 
    linkMaps: '',
    location: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
  },
]