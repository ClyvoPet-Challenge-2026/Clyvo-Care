import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LoaderCircle } from "lucide-react-native"
import { useAuth } from "../Context/AuthContext";
import { MainScreen } from "../Screens/MainScreen";
import { LoginScreen } from "../Screens/LoginScreen";
import { RegisterScreen } from "../Screens/RegisterScreen";
import { RegisterPet } from "../Screens/RegisterPetScreen";
import { MyPet } from "../Screens/MyPetScreen";
import { MakeAppointment } from "../Screens/MakeAppointment";
import { MyInformations } from "../Screens/MyInformations";
import Header from "../Components/Header";
import { RootStackParamList } from "../Types/types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
    const { loggedIn, loading } = useAuth();

    if (loading) return <LoaderCircle />; // Aguarde carregar

    return (
        <Stack.Navigator>
            {loggedIn ? (
                // Stack para usuário autenticado
                <Stack.Group screenOptions={{ header: () => <Header /> }}>
                    <Stack.Screen name="MainScreen" component={MainScreen} />
                    <Stack.Screen name="RegisterPet" component={RegisterPet} />
                    <Stack.Screen name="MyPet" component={MyPet} />
                    <Stack.Screen name="MakeAppointment" component={MakeAppointment} />
                    <Stack.Screen name="MyInformations" component={MyInformations} />
                </Stack.Group>
            ) : (
                // Stack para usuário NÃO autenticado
                <Stack.Group screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                </Stack.Group>
            )}
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    return <RootNavigator />;
}