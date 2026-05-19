import {View, Text, TouchableOpacity} from "react-native"
import { useAuth } from "../Context/AuthContext";

export function MainScreen() {
  const { logout } = useAuth();

  return (
    <View className="flex-1 items-center justify-center h-screen bg-white">
      <View className="items-center justify-center">
        <Text className="text-neutral-900 text-3xl font-bold mb-4">
          Bem-vindo!
        </Text>
        <Text className="text-neutral-600 text-base text-center mb-8">
          Você foi redirecionado com sucesso
        </Text>
        <TouchableOpacity 
          onPress={logout}
          className="bg-red-500 rounded-lg p-3 px-8"
        >
          <Text className="text-white text-lg font-semibold">Fazer Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}