import { ImageSourcePropType } from "react-native";

const ClyvoSJCampos = require("../Images/ClyvoSJCampos.png");

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
]