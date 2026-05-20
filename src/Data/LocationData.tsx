const ClyvoSJCampos = "/src/Images/ClyvoSJCampos.png";

export interface Unidade {
  identificador: number;
  id : string; 
  nome: string;
  img: string; 
  linkMaps: string;
  localizacao: string;
}

export const unidades: Unidade[] = [
  { 
    identificador: 1,
    id: 'ClyvoSJCampos', 
    nome: 'São José dos Campos', 
    img: ClyvoSJCampos, 
    linkMaps: 'https://maps.app.goo.gl/UUYKJi6ByGNdPTk46',
    localizacao: 'Rua Giacomo Versolato, 520, Casa 02 CEP 09770-440 – São Bernardo do Campo/SP'
  },
]