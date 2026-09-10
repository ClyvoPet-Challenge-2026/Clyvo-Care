import { StateApiDTO, CityApiDTO } from "../Types/types";

export const DEFAULT_STATES: StateApiDTO[] = [
  { id: 1, name: "São Paulo", uf: "SP" },
  { id: 2, name: "Rio de Janeiro", uf: "RJ" },
  { id: 3, name: "Minas Gerais", uf: "MG" },
  { id: 4, name: "Paraná", uf: "PR" },
  { id: 5, name: "Rio Grande do Sul", uf: "RS" },
  { id: 6, name: "Bahia", uf: "BA" },
  { id: 7, name: "Santa Catarina", uf: "SC" },
  { id: 8, name: "Ceará", uf: "CE" },
];

export const DEFAULT_CITIES: CityApiDTO[] = [
  { id: 1, name: "São Paulo", state: DEFAULT_STATES[0] },
  { id: 2, name: "São José dos Campos", state: DEFAULT_STATES[0] },
  { id: 3, name: "Campinas", state: DEFAULT_STATES[0] },
  { id: 4, name: "Santos", state: DEFAULT_STATES[0] },
  { id: 5, name: "Rio de Janeiro", state: DEFAULT_STATES[1] },
  { id: 6, name: "Niterói", state: DEFAULT_STATES[1] },
  { id: 7, name: "Belo Horizonte", state: DEFAULT_STATES[2] },
  { id: 8, name: "Curitiba", state: DEFAULT_STATES[3] },
  { id: 9, name: "Porto Alegre", state: DEFAULT_STATES[4] },
  { id: 10, name: "Salvador", state: DEFAULT_STATES[5] },
  { id: 11, name: "Florianópolis", state: DEFAULT_STATES[6] },
  { id: 12, name: "Fortaleza", state: DEFAULT_STATES[7] },
];
