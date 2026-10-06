import { View, Text } from "react-native";
import { MapPin } from "lucide-react-native";
import { LocationCarrousel } from "../LocationCarrousel";
import { useTheme } from "../../Context/ThemeContext";

export function ClinicsSection() {
  const { isDark } = useTheme();
  return (
    <View className={`rounded-3xl p-5 border shadow-sm ${
      isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
    }`}>
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2.5">
          <View className={`w-9 h-9 rounded-2xl items-center justify-center ${
            isDark ? "bg-navy-2" : "bg-soft"
          }`}>
            <MapPin size={18} color="#1f6ae1" />
          </View>
          <View>
            <Text className={`text-base font-bold ${isDark ? "text-paper" : "text-navy"}`}>Nossas Clínicas e Unidades</Text>
            <Text className={`text-xs ${isDark ? "text-soft-line" : "text-mute"}`}>Encontre a Clyvo Care mais próxima de você</Text>
          </View>
        </View>
      </View>
      <LocationCarrousel />
    </View>
  );
}
