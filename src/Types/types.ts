import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  LoginScreen: String;
  RegisterScreen: String;
  MainScreen: String;
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
