import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  LoginScreen: undefined;
  RegisterScreen: undefined;
  MainScreen: undefined;
  MyPet: undefined;
  RegisterPet: undefined;
  MakeAppointment: undefined;
  MyInformations: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'LoginScreen'
>;

export type RegisterScreenProps = NativeStackScreenProps<
  RootStackParamList,
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
