import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainScreen } from "../Screens/MainScreen";
import { LoginScreen } from "../Screens/LoginScreen";
import { RegisterScreen } from "../Screens/RegisterScreen";
import { LoaderCircle } from "lucide-react-native"
import { useAuth } from "../Context/AuthContext";
import React from 'react';
 
const Stack = createNativeStackNavigator();

export function RootNavigator() {
    const { loggedIn, loading } = useAuth();

    if (loading) return <LoaderCircle />; // Aguarde carregar

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {loggedIn ? (
                // Stack para usuário autenticado
                <>
                    <Stack.Screen name="MainScreen" component={MainScreen} />
                </>
            ) : (
                // Stack para usuário NÃO autenticado
                <>
                    <Stack.Screen name="LoginScreen" component={LoginScreen} />
                    <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
                </>
            )}
        </Stack.Navigator>
    );
}

export default function AppNavigator() {
    return <RootNavigator />;
}