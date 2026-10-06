import { View, Text, TouchableOpacity } from "react-native";
import { Sparkles, Calendar, Plus } from "lucide-react-native";
import { useTheme } from "../../Context/ThemeContext";
import type { WelcomeSectionProps } from "../../Types/types";

export function WelcomeSection({ userName, onAppointment, onRegisterPet }: WelcomeSectionProps) {
  const { isDark } = useTheme();
  return (
    <View className={`px-6 pt-7 pb-8 rounded-b-[36px] shadow-lg ${isDark ? "bg-navy border-b border-white/10" : "bg-brand"}`}>
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <View className="bg-paper/20 rounded-full px-3 py-1 flex-row items-center gap-1.5">
            <Sparkles size={14} color="#ffffff" />
            <Text className="text-paper text-xs font-semibold uppercase tracking-wider">
              Portal Clyvo Care
            </Text>
          </View>
        </View>
      </View>

      <Text className="text-paper text-2xl font-bold tracking-tight">
        Olá, {userName ? userName.split(" ")[0] : "Tutor"}!
      </Text>
      <Text className="text-soft text-sm mt-1.5 leading-5 opacity-95">
        Gerencie a saúde dos seus pets, acompanhe sua assinatura e agende consultas com rapidez.
      </Text>

      {/* Atalhos Rápidos */}
      <View className="flex-row gap-3 mt-6">
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onAppointment}
          className={`flex-1 rounded-2xl py-3.5 px-4 flex-row items-center justify-center gap-2 shadow-sm active:scale-98 ${
            isDark ? "bg-navy-2 border border-white/10" : "bg-paper"
          }`}
        >
          <Calendar size={18} color="#1f6ae1" />
          <Text className="text-brand font-semibold text-sm">
            Agendar Consulta
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onRegisterPet}
          className="bg-navy rounded-2xl py-3.5 px-4 flex-row items-center justify-center gap-2 border border-paper/10 active:scale-98"
        >
          <Plus size={18} color="#ffffff" />
          <Text className="text-paper font-semibold text-sm">
            Novo Pet
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
