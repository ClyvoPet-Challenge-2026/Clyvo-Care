import type { LocalLocation } from "../Types/types";

const ClyvoSJCampos = require("../Images/Location/ClyvoSJCampos.png");

export type { LocalLocation as Location };

export const locations: LocalLocation[] = [
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
    linkMaps: 'https://maps.app.goo.gl/UUYKJi6ByGNdPTk46',
    location: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua'
  },
]