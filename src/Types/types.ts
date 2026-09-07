import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { ImageSourcePropType } from "react-native";
import { RootStackParamList, AuthStackParamList } from "../Navigation/navigation";

// Re-export das listas de parâmetros de navegação para conveniência
export type { RootStackParamList, AuthStackParamList };

// ==========================================
// 1. Tipos de Autenticação & Cadastro
// ==========================================

export interface LoginFormData {
  email: string;
  senha: string;
}

export interface RegisterFormData {
  email: string;
  senha: string;
  confirmarSenha?: string;
  name?: string;
  username?: string; // Suporte para Username solicitado
  phone?: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

// ==========================================
// 2. Perfil do Usuário / Tutor
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
// 3. Tipos de Pets
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
// 4. Tipos de Agendamentos / Consultas
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
// 5. Unidades / Clínicas
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
// 6. Navegação de Telas
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