import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ImageSourcePropType } from "react-native";
import { RootStackParamList, AuthStackParamList } from "../Navigation/navigation";

// Re-export das listas de parâmetros de navegação para conveniência
export type { RootStackParamList, AuthStackParamList };

// ==========================================
// Tipos de Autenticação & Cadastro
// ==========================================

export interface LoginFormData {
  email: string;
  senha: string;
}

export interface RegisterFormData {
  name: string;
  cpf: string;
  email: string;
  senha: string;
  confirmarSenha?: string;
  phone: string;
  cityId: number;
}

export interface LoginResponseDTO {
  token: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

// ==========================================
// Perfil do Usuário / Tutor
// ==========================================

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  username?: string; // Nome de usuário único (@usuario)
  phone?: string;
  address?: string;
  photoUrl?: string;
  cpf?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==========================================
// Usuário - API
// ==========================================

export interface OwnerApiDTO {
  id: number;
  name: string;
  cpf: string;
  email: string;
  phone: string;
  city?: {
    id: number;
    name: string;
    state?: {
      id: number;
      name: string;
      uf: string;
    };
  };
  createdAt?: string;
}

export interface StateApiDTO {
  id: number;
  name: string;
  uf: string;
}

export interface CityApiDTO {
  id: number;
  name: string;
  state?: StateApiDTO;
}

// ==========================================
// Tipos de Pets
// ==========================================

export type PetSpecies =
  | "Canino"
  | "Felino"
  | "Ave"
  | "Peixe"
  | "Roedor"
  | "Reptil"
  | string;

export type PetSex = "Macho" | "Femea";

export interface Pet {
  identifier?: number;
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  sex: PetSex;
  age?: number;
  birthDate?: string;
  tutor?: string;
  tutorId?: string;
  img?: ImageSourcePropType;
  photoUrl?: string;
  weight?: number;
  observations?: string;
}

export interface RegisterPetFormData {
  name: string;
  birthDate: string;
  sex: PetSex;
  tutor: string;
  species: string;
  breed: string;
  photoUrl?: string;
}

export interface DropdownProps {
  label: string;
  value: string;
  placeholder?: string;
  options: string[];
  onSelect: (value: string) => void;
  icon?: React.ReactNode;
}

// ==========================================
// Tipos de Agendamentos / Consultas
// ==========================================

export interface AppointmentReason {
  id: string;
  title: string;
  description: string;
  badge?: string;
}

export interface QuickDate {
  label: string;
  sublabel: string;
}

export type AppointmentStatus =
  | "Pendente"
  | "Confirmado"
  | "Cancelado"
  | "Realizado";

export interface Appointment {
  id: string;
  petId: string;
  petName: string;
  userId: string;
  unit: string;
  serviceType: string;
  date: string; // ISO ou DD/MM/AAAA
  time: string; // HH:mm
  status: AppointmentStatus;
  notes?: string;
}

// ==========================================
// Unidades / Clínicas
// ==========================================

export interface LocationUnit {
  identifier: number | string;
  name: string;
  location: string;
  linkMaps: string;
  img: ImageSourcePropType;
  phone?: string;
}

// ==========================================
// "pets" para API Java Spring Boot
// ==========================================

export interface SpeciesApiDTO {
  id: number;
  name: string;
}

export interface BreedApiDTO {
  id: number;
  name: string;
  species?: SpeciesApiDTO;
}

export interface PetApiDTO {
  id: number;
  name: string;
  birthDate: string;
  sex: "MALE" | "FEMALE";
  owner?: {
    id: number;
    name: string;
  };
  species?: SpeciesApiDTO;
  breed?: BreedApiDTO;
  createdAt?: string;
}

export interface CreatePetDTO {
  name: string;
  birthDate: string; // YYYY-MM-DD
  sex: "MALE" | "FEMALE";
  ownerId: number;
  speciesId: number;
  breedId?: number;
}

// ==========================================
// Planos de Assinatura / Subscrições - API
// ==========================================

export interface PlanApiDTO {
  id: number;
  name: string;
  description: string;
  monthlyValue: number;
}

export interface PaymentMethodApiDTO {
  id: number;
  name: string;
}

export interface SubStatusApiDTO {
  id: number;
  name: string;
}

export interface SubscriptionApiDTO {
  id: number;
  pet: {
    id: number;
    name: string;
  };
  plan: PlanApiDTO;
  status: SubStatusApiDTO;
  paymentMethod: PaymentMethodApiDTO;
  contractedValue: number;
  createdAt: string;
}

export interface CreateSubscriptionDTO {
  petId: number;
  planId: number;
  statusId: number;
  paymentMethodId: number;
}

// ==========================================
// Navegação de Telas
// ==========================================

export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'LoginScreen'
>;

export type RegisterScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'RegisterScreen'
>;

export type MainScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MainScreen'
>;

export type MyPet = NativeStackScreenProps<
  RootStackParamList,
  'MyPet'
>;


export type RegisterPet = NativeStackScreenProps<
  RootStackParamList,
  'RegisterPet'
>;

export type MakeAppointmentProps = NativeStackScreenProps<
  RootStackParamList,
  'MakeAppointment'
>;