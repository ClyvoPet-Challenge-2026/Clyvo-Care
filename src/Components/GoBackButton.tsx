import {View, Text, TouchableOpacity} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";

export function GoBackButton() {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      className="flex-row items-center space-x-2 mb-4"
      >
        <ArrowLeft size={20} color="#4B5563" />
        <Text className="text-gray-700 text-sm">Voltar</Text>
      </TouchableOpacity>
  )
};