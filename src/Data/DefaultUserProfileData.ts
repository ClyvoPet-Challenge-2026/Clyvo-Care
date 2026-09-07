import { UserProfile } from "../Types/types";

//Será removido ao impletar a autenticação de usuário e a API de perfil do usuário.
export const DEFAULT_USER_PROFILE: UserProfile = {
  name: "Dr. Roberto Silva",
  email: "roberto.silva@clyvo.com.br",
  phone: "(11) 98765-4321",
  address: "Av. Paulista, 1000 - São Paulo, SP",
  photoUrl: "",
};
