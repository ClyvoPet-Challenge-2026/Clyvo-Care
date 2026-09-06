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
import { RootStackParamList, AuthStackParamList } from "./navigation";

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const RootStack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
    const { loggedIn, loading } = useAuth();

    if (loading) return <LoaderCircle />; // Aguarde carregar

    return (
        <RootStack.Navigator>
            {loggedIn ? (
                // Stack para usuário autenticado
                <RootStack.Group screenOptions={{ header: () => <Header /> }}>
                    <RootStack.Screen name="MainScreen" component={MainScreen} />
                    <RootStack.Screen name="RegisterPet" component={RegisterPet} />
                    <RootStack.Screen name="MyPet" component={MyPet} />
                    <RootStack.Screen name="MakeAppointment" component={MakeAppointment} />
                    <RootStack.Screen name="MyInformations" component={MyInformations} />
                </RootStack.Group>
            ) : (
                // Stack para usuário NÃO autenticado
                <AuthStack.Group screenOptions={{ headerShown: false }}>
                    <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
                    <AuthStack.Screen name="RegisterScreen" component={RegisterScreen} />
                </AuthStack.Group>
            )}
        </RootStack.Navigator>
    );
}

export default function AppNavigator() {
    return <RootNavigator />;
}