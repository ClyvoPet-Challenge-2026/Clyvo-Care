import { View, Text, TouchableOpacity } from "react-native";
import { Clock } from "lucide-react-native";
import { QUICK_DATES, AVAILABLE_TIMES } from "../../Data/AppointmentData";
import { useTheme } from "../../Context/ThemeContext";
import type { AppointmentDateTimeSelectorProps } from "../../Types/types";

export function AppointmentDateTimeSelector({ selectedDate, setSelectedDate, selectedTime, setSelectedTime }: AppointmentDateTimeSelectorProps) {
  const { isDark } = useTheme();
  return (
    <View className={`rounded-3xl p-5 mb-5 border ${
      isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
    }`}>
      <View className="flex-row items-center gap-2 mb-1">
        <Clock size={18} color="#1f6ae1" />
        <Text className={`text-base font-bold ${isDark ? "text-paper" : "text-navy"}`}>
          Data e Horário
        </Text>
      </View>
      <Text className={`text-xs mb-3.5 ${isDark ? "text-soft-line" : "text-mute"}`}>
        Selecione uma data para a consulta:
      </Text>

      {/* Atalhos de Datas Rápidas */}
      <View className="flex-row flex-wrap gap-2 mb-4">
        {QUICK_DATES.map((qDate) => {
          const isSelected = selectedDate === qDate.label;
          return (
            <TouchableOpacity
              key={qDate.label}
              activeOpacity={0.8}
              onPress={() => setSelectedDate(qDate.label)}
              style={
                isSelected
                  ? {
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 1,
                    }
                  : undefined
              }
              className={`flex-1 min-w-[70px] py-2.5 px-3 rounded-2xl border items-center justify-center ${
                isSelected
                  ? "border-brand bg-brand"
                  : (isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50")
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  isSelected ? "text-paper" : (isDark ? "text-paper" : "text-navy")
                }`}
              >
                {qDate.label}
              </Text>
              <Text
                className={`text-[10px] mt-0.5 ${
                  isSelected ? "text-paper" : (isDark ? "text-soft-line" : "text-mute")
                }`}
              >
                {qDate.sublabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Grade de Horários */}
      <Text className={`text-xs font-medium mb-2 ${isDark ? "text-soft-line" : "text-mute"}`}>
        Horários disponíveis:
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {AVAILABLE_TIMES.map((time) => {
          const isSelected = selectedTime === time;
          return (
            <TouchableOpacity
              key={time}
              activeOpacity={0.8}
              onPress={() => setSelectedTime(time)}
              className={`py-2 px-3.5 rounded-xl border items-center justify-center ${
                isSelected
                  ? "border-brand bg-brand"
                  : (isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50")
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  isSelected ? "text-paper" : (isDark ? "text-soft" : "text-body")
                }`}
              >
                {time}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
