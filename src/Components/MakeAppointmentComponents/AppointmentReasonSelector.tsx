import { View, Text, TouchableOpacity } from "react-native";
import { Stethoscope } from "lucide-react-native";
import { APPOINTMENT_REASONS } from "../../Data/AppointmentData";
import { useTheme } from "../../Context/ThemeContext";
import type { AppointmentReasonSelectorProps } from "../../Types/types";

export function AppointmentReasonSelector({ selectedReason, setSelectedReason }: AppointmentReasonSelectorProps) {
  const { isDark } = useTheme();
  return (
    <View className={`rounded-3xl p-5 mb-5 border ${
      isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
    }`}>
      <View className="flex-row items-center gap-2 mb-1">
        <Stethoscope size={18} color="#1f6ae1" />
        <Text className={`text-base font-bold ${isDark ? "text-paper" : "text-navy"}`}>
          Qual o motivo da consulta?
        </Text>
      </View>
      <Text className={`text-xs mb-3.5 ${isDark ? "text-soft-line" : "text-mute"}`}>
        Selecione a opção que melhor descreve a necessidade do seu pet:
      </Text>

      <View className="gap-2.5">
        {APPOINTMENT_REASONS.map((reason) => {
          const isSelected = selectedReason === reason.id;
          return (
            <TouchableOpacity
              key={reason.id}
              activeOpacity={0.8}
              onPress={() => setSelectedReason(reason.id)}
              className={`p-3.5 rounded-2xl border flex-row items-center justify-between ${
                isSelected
                  ? (isDark ? "border-brand bg-brand/20" : "border-brand bg-soft")
                  : (isDark ? "border-white/10 bg-navy-2/60" : "border-rule bg-ground/30")
              }`}
            >
              <View className="flex-1 mr-3">
                <View className="flex-row items-center gap-2 mb-0.5">
                  <Text
                    className={`text-sm font-bold ${
                      isSelected ? "text-brand" : (isDark ? "text-paper" : "text-navy")
                    }`}
                  >
                    {reason.title}
                  </Text>
                  {reason.badge && (
                    <View
                      className={`px-2 py-0.5 rounded-full ${
                        isSelected ? "bg-brand/15" : (isDark ? "bg-navy-2" : "bg-rule/60")
                      }`}
                    >
                      <Text
                        className={`text-[10px] font-semibold ${
                          isSelected ? "text-brand" : (isDark ? "text-soft" : "text-soft-ink")
                        }`}
                      >
                        {reason.badge}
                      </Text>
                    </View>
                  )}
                </View>
                <Text className={`text-xs ${isDark ? "text-soft-line" : "text-soft-ink"}`}>
                  {reason.description}
                </Text>
              </View>

              {/* Radio Indicator */}
              <View
                className={`w-5 h-5 rounded-full border items-center justify-center ${
                  isSelected
                    ? "border-brand bg-brand"
                    : (isDark ? "border-soft-line bg-navy-2" : "border-mute bg-paper")
                }`}
              >
                {isSelected && (
                  <View className="w-2 h-2 rounded-full bg-paper" />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
