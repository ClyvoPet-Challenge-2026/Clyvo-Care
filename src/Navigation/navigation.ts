import { PetApiDTO } from "../Types/types";

export type RootStackParamList = {
    MainScreen: undefined;
    RegisterPet: { petToEdit?: PetApiDTO } | undefined;
    MyPet: undefined;
    MakeAppointment: undefined;
    MyInformations: undefined;
};

export type AuthStackParamList = {
    LoginScreen: undefined;
    RegisterScreen: undefined;
    SignOut: undefined;
    ForgotPasswordScreen: undefined;
}