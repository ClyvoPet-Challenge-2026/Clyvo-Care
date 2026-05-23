import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { User, LogOut } from "lucide-react-native";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Types/types";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const { logout } = useAuth();
    const insets = useSafeAreaInsets();
    const iconTop = insets.top + 8;
    const dropdownTop = iconTop + 48;
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const handleLogout = () => {
        setMenuOpen(false);
        logout();
    };

    return (
        <SafeAreaView className="bg-mainBackground w-screen h-25">
            <TouchableOpacity onPress={() => navigation.navigate("MainScreen")} className="flex-row m-auto p-3 items-center">
                <Text className="text-black font-semibold text-2xl ml-2 mt-1">Clyvo</Text>
                <Text className="text-blue font-semibold text-2xl mt-1">Care</Text>
            </TouchableOpacity>
            
            <View className="absolute right-5" style={{ top: iconTop }}>
                <TouchableOpacity 
                    onPress={() => setMenuOpen(!menuOpen)}
                    className="p-2 rounded-full bg-gray-200"
                >
                    <User size={24} color="#1F6AE1" />
                </TouchableOpacity>
            </View>

            {menuOpen && (
                <View className="absolute right-5 bg-white rounded-lg shadow-lg p-2 w-40" style={{ top: dropdownTop }}>
                    <TouchableOpacity
                        onPress={handleLogout}
                        className="flex-row items-center p-3 rounded-md"
                    >
                        <LogOut size={20} color="#ef4444" />
                        <Text className="ml-3 text-red-500 font-semibold">Logout</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    )
}