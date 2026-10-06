import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MapPin, ChevronDown, Check } from "lucide-react-native";
import { locations } from "../../Data/LocationData";
import { useTheme } from "../../Context/ThemeContext";
import type { ClinicSelectorProps } from "../../Types/types";

export function ClinicSelector({ selectedLocation, setSelectedLocation }: ClinicSelectorProps) {
  const { isDark } = useTheme();
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  return (
    <View className={`rounded-3xl p-5 mb-5 border ${
      isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
    }`}>
      <View className="flex-row items-center gap-2 mb-1">
        <MapPin size={18} color="#1f6ae1" />
        <Text className={`text-base font-bold ${isDark ? "text-paper" : "text-navy"}`}>
          Unidade de Atendimento
        </Text>
      </View>
      <Text className={`text-xs mb-3.5 ${isDark ? "text-soft-line" : "text-mute"}`}>
        Selecione onde deseja ser atendido:
      </Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setLocationDropdownOpen(!locationDropdownOpen)}
        className={`w-full min-h-[50px] rounded-xl border px-3.5 py-3 flex-row items-center justify-between ${
          locationDropdownOpen
            ? (isDark ? "border-brand bg-navy-2" : "border-brand bg-paper")
            : (isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50")
        }`}
      >
        <View className="flex-row items-center flex-1 mr-2">
          <View className="mr-2.5">
            <MapPin size={18} color="#1f6ae1" />
          </View>
          <View className="flex-1">
            <Text className={`text-sm font-semibold ${isDark ? "text-paper" : "text-navy"}`}>
              {selectedLocation}
            </Text>
          </View>
        </View>
        <ChevronDown
          size={18}
          color={isDark ? "#99b6e6" : "#6c778c"}
          style={{
            transform: [{ rotate: locationDropdownOpen ? "180deg" : "0deg" }],
          }}
        />
      </TouchableOpacity>

      {locationDropdownOpen && (
        <View className={`mt-2 border rounded-2xl overflow-hidden ${
          isDark ? "bg-navy-2 border-white/10" : "bg-paper border-rule-2"
        }`}>
          {locations.map((loc, index) => {
            const isSelected = loc.name === selectedLocation;
            return (
              <TouchableOpacity
                key={loc.id}
                activeOpacity={0.7}
                onPress={() => {
                  setSelectedLocation(loc.name);
                  setLocationDropdownOpen(false);
                }}
                className={`p-3.5 flex-row items-center justify-between ${
                  isSelected
                    ? (isDark ? "bg-navy" : "bg-soft/50")
                    : (isDark ? "bg-navy-2" : "bg-paper")
                } ${index < locations.length - 1 ? (isDark ? "border-b border-white/10" : "border-b border-rule-2/70") : ""}`}
              >
                <View className="flex-1 mr-3">
                  <Text
                    className={`text-sm font-bold ${
                      isSelected ? "text-brand" : (isDark ? "text-paper" : "text-navy")
                    }`}
                  >
                    {loc.name}
                  </Text>
                  <Text className={`text-xs mt-0.5 ${isDark ? "text-soft-line" : "text-soft-ink"}`} numberOfLines={2}>
                    {loc.location}
                  </Text>
                </View>
                {isSelected && <Check size={18} color="#1f6ae1" />}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
}
