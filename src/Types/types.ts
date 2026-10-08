import { NativeStackScreenProps, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ImageSourcePropType, TextInputProps } from "react-native";

// ==========================================
// Tipos de Tema (Dark / Light Mode)
// ==========================================

export type ThemeType = "light" | "dark";
export type Theme = ThemeType;

export interface ClyvoThemeColors {
  background: string;
  card: string;
  surface: string;
  soft: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderSecondary: string;
  brand: string;
  icon: string;
  iconSecondary: string;
}

// ==========================================
// Tipos de Autenticação & Cadastro
// ==========================================

export interface LoginFormData {
  email: string;
  senha: string;
}

export type LoginFormErrors = Record<keyof LoginFormData, string>;

export interface RegisterFormData {
  name: string;
  cpf: string;
  email: string;
  senha: string;
  confirmarSenha?: string;
  phone: string;
  cityId: number;
}

export type RegisterFormErrors = Partial<Record<keyof RegisterFormData | "city", string>>;

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
  roleName?: string;
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

export interface UseLocationsOptions {
  allowFallback?: boolean;
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
  getOptionLabel?: (value: string) => string;
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

export interface PetFormValues {
  name: string;
  birthDate: string;
  unknownBirthDate: boolean;
  tutor: string;
  sex: string;
  species: string; // ID da API; vazio quando não selecionado.
  breed: string; // ID da API; vazio quando não informado.
}

export type PetFormTextField = "name" | "birthDate" | "tutor" | "sex" | "breed";

export interface PetPayloadContext {
  ownerId?: number;
  species: SpeciesApiDTO[];
  breeds: BreedApiDTO[];
  today: string;
}

export interface UsePetFormOptions {
  petToEdit?: PetApiDTO;
  onSuccess: () => void;
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
  monthlyValue: number;
}

export type PaymentMethodApiDTO = "CREDIT_CARD" | "DEBIT_CARD" | "BOLETO" | "PIX";
export type SubStatusApiDTO = "ACTIVE" | "INACTIVE" | "PENDING";

export interface SubscriptionApiDTO {
  id: number;
  startDate: string;
  pet: PetApiDTO;
  plan: PlanApiDTO;
  status: SubStatusApiDTO;
  paymentMethod: PaymentMethodApiDTO;
  contractedValue: number;
}

export interface CreateSubscriptionDTO {
  petId: number;
  planId: number;
  paymentMethod: PaymentMethodApiDTO;
}

export interface SubscriptionSimulationDTO {
  baseValue: number;
  discountRate: number;
  discountAmount: number;
  finalValue: number;
}

export interface SpringPage<T> {
  content: T[];
  last: boolean;
  totalPages: number;
  number: number;
}

// ==========================================
// Navegação de Telas
// ==========================================

export type RootStackParamList = {
    MainScreen: undefined;
    RegisterPet: { petToEdit?: PetApiDTO } | undefined;
    MyPet: undefined;
    MakeAppointment: undefined;
    MyInformations: undefined;
    AboutScreen: undefined;
};

export type AuthStackParamList = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
    SignOut: undefined;
    ForgotPasswordScreen: undefined;
}

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

export type AboutScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'AboutScreen'
>;

// ==========================================
// Props de Componentes
// ==========================================

export interface AppointmentFormValues {
  petId: number | string;
  reason: string;
  location: string;
  date: string;
  time: string;
  notes: string;
}

export interface UseAppointmentFormOptions {
  onViewPets: () => void;
  onGoHome: () => void;
}

export interface PetSelectorProps {
  pets: PetApiDTO[];
  loadingPets: boolean;
  selectedPet: number | string;
  setSelectedPet: (value: number | string) => void;
  onRegisterPet: () => void;
}

export interface AppointmentReasonSelectorProps {
  selectedReason: string;
  setSelectedReason: (value: string) => void;
}

export interface ClinicSelectorProps {
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
}

export interface AppointmentDateTimeSelectorProps {
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  selectedTime: string;
  setSelectedTime: (value: string) => void;
}

export interface AppointmentNotesProps {
  notes: string;
  setNotes: (value: string) => void;
}

export interface WelcomeSectionProps {
  userName?: string;
  onAppointment: () => void;
  onRegisterPet: () => void;
}

export interface RegisteredPetsSectionProps {
  pets: PetApiDTO[];
  onViewPets: () => void;
  onRegisterPet: () => void;
}

export interface HomePlansState {
  pets: PetApiDTO[];
  selectedPet?: PetApiDTO;
  paymentMethods: PaymentMethodApiDTO[];
  paymentMethod?: PaymentMethodApiDTO;
  plans: PlanApiDTO[];
  subscription?: SubscriptionApiDTO;
  loading: boolean;
  error: string | null;
  busy: boolean;
  canCancel: boolean;
}

export interface HomePlansActions {
  selectPet: (id: number) => void;
  selectPayment: (method: PaymentMethodApiDTO) => void;
  subscribe: (plan: PlanApiDTO) => Promise<void>;
  cancel: () => void;
  retry: () => void;
}

export interface PlansSectionProps {
  state: HomePlansState;
  actions: HomePlansActions;
  onRegisterPet: () => void;
}

export interface PetCardProps {
  pet: PetApiDTO;
  onEdit: () => void;
  onDelete: () => void;
  onAppointment: () => void;
}

export interface PetFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedFilter: string;
  setSelectedFilter: (value: string) => void;
  speciesList: string[];
}

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export interface FormattedTextInputProps extends Omit<TextInputProps, "value" | "defaultValue" | "onChangeText" | "maxLength" | "keyboardType"> {
  format: "cpf" | "phone";
  value: string;
  onChangeText: (value: string) => void;
}

export interface HeaderProps {
  navigation?: NativeStackNavigationProp<RootStackParamList>;
}

export interface ProfileFormValues {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  password: string;
  cityId: number;
  stateId: number | null;
}

export type ProfileTextField = "name" | "email" | "phone" | "password";

export interface ProfileFormControls {
  values: ProfileFormValues;
  updateField: (field: ProfileTextField, value: string) => void;
  isEditing: boolean;
  isSaving: boolean;
  startEditing: () => void;
  cancel: () => void;
  save: () => Promise<void>;
}

export interface ProfileLocationControls {
  states: StateApiDTO[];
  cities: CityApiDTO[];
  stateId: number | null;
  cityId: number;
  selectState: (id: number) => void;
  selectCity: (id: number) => void;
}

export interface PersonalInfoSectionProps {
  isDark: boolean;
  form: ProfileFormControls;
  children: React.ReactNode;
}

export interface ProfileLocationSectionProps {
  isDark: boolean;
  isEditing: boolean;
  cityNameText: string;
  locations: ProfileLocationControls;
}

export interface ConfigSectionProps {
  isDark: boolean;
  toggleTheme: () => void;
  logout: () => Promise<void>;
  onDeleteAccount: () => void;
}

export interface DeleteModalProps {
  isDark: boolean;
  visible: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isDeleting: boolean;
}

// ==========================================
// Tipos de Contexto
// ==========================================

export interface AuthContextType {
  loggedIn: boolean;
  loading: boolean;
  user: OwnerApiDTO | null;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (data: Partial<OwnerApiDTO>) => Promise<void>;
}

export interface ThemeContextType {
  theme: ThemeType;
  isDark: boolean;
  colors: ClyvoThemeColors;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
}

// ==========================================
// Dados Locais (Mock / Static Data)
// ==========================================

export interface LocalLocation {
  identifier: number;
  id: string;
  name: string;
  img: ImageSourcePropType;
  linkMaps: string;
  location: string;
}

export interface LocalPet {
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

export interface PetSpecieBreed {
  species: string;
  apiName?: string;
  breeds: string[];
}

export interface ClyvoPlan {
  id: string;
  name: string;
  tagline: string;
  price: string;
  period: string;
  popular?: boolean;
  color: string;
  badgeBg: string;
  badgeText: string;
  features: string[];
}
