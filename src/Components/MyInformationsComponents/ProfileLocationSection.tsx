import { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { MapPin, ChevronDown, Check } from "lucide-react-native";
import type { ProfileLocationSectionProps } from "../../Types/types";

export function ProfileLocationSection({ isDark, isEditing, cityNameText, locations }: ProfileLocationSectionProps) {
  const [openStateDropdown, setOpenStateDropdown] = useState(false);
  const [openCityDropdown, setOpenCityDropdown] = useState(false);

  const selectState = (id: number) => {
    locations.selectState(id);
    setOpenStateDropdown(false);
  };

  return (
    !isEditing ? (
        <View className="mb-4">
          <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Cidade e Estado</Text>
          <View className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
            isDark ? "border-white/10 bg-navy-2/60" : "border-rule bg-ground/50"
          }`}>
            <MapPin size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
            <Text className={`flex-1 ml-2 text-sm ${isDark ? "text-paper" : "text-ink"}`}>{cityNameText}</Text>
          </View>
        </View>
      ) : (
        <View className="mb-4">
          {/* Dropdown Estado */}
          <View className="mb-4">
            <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Estado</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setOpenStateDropdown(!openStateDropdown);
                setOpenCityDropdown(false);
              }}
              className={`w-full min-h-[46px] rounded-xl border px-3.5 py-2.5 flex-row items-center justify-between ${
                openStateDropdown
                  ? (isDark ? "border-brand bg-navy-2" : "border-brand bg-paper")
                  : (isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50")
              }`}
            >
              <View className="flex-row items-center flex-1 mr-2">
                <MapPin size={16} color={isDark ? "#99b6e6" : "#6c778c"} className="mr-2.5" />
                <Text className={`text-sm font-medium ml-2 ${isDark ? "text-paper" : "text-ink"}`}>
                  {locations.states.find((s) => s.id === locations.stateId)?.name || "Selecione o Estado"}
                </Text>
              </View>
              <ChevronDown
                size={16}
                color={isDark ? "#99b6e6" : "#6c778c"}
                style={{ transform: [{ rotate: openStateDropdown ? "180deg" : "0deg" }] }}
              />
            </TouchableOpacity>

            {openStateDropdown && (
              <View className={`mt-1.5 border rounded-2xl overflow-hidden max-h-52 ${
                isDark ? "bg-navy-2 border-white/10" : "bg-paper border-rule-2"
              }`}>
                <ScrollView nestedScrollEnabled>
                  {locations.states.map((st, index) => {
                    const isSelected = st.id === locations.stateId;
                    return (
                      <TouchableOpacity
                        key={st.id}
                        activeOpacity={0.7}
                        onPress={() => selectState(st.id)}
                        className={`px-4 py-3 flex-row items-center justify-between ${
                          isSelected
                            ? (isDark ? "bg-navy" : "bg-soft/50")
                            : (isDark ? "bg-navy-2" : "bg-paper")
                        } ${index < locations.states.length - 1 ? (isDark ? "border-b border-white/10" : "border-b border-rule-2/70") : ""}`}
                      >
                        <Text className={`text-sm ${
                          isSelected ? "text-brand font-semibold" : (isDark ? "text-paper" : "text-body")
                        }`}>
                          {st.name} ({st.uf})
                        </Text>
                        {isSelected && <Check size={16} color="#1f6ae1" />}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Dropdown Cidade */}
          <View className="mb-1">
            <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Cidade</Text>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setOpenCityDropdown(!openCityDropdown);
                setOpenStateDropdown(false);
              }}
              className={`w-full min-h-[46px] rounded-xl border px-3.5 py-2.5 flex-row items-center justify-between ${
                openCityDropdown
                  ? (isDark ? "border-brand bg-navy-2" : "border-brand bg-paper")
                  : (isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50")
              }`}
            >
              <View className="flex-row items-center flex-1 mr-2">
                <MapPin size={16} color={isDark ? "#99b6e6" : "#6c778c"} className="mr-2.5" />
                <Text className={`text-sm font-medium ml-2 ${isDark ? "text-paper" : "text-ink"}`}>
                  {locations.cities.find((c) => c.id === locations.cityId)?.name || "Selecione a Cidade"}
                </Text>
              </View>
              <ChevronDown
                size={16}
                color={isDark ? "#99b6e6" : "#6c778c"}
                style={{ transform: [{ rotate: openCityDropdown ? "180deg" : "0deg" }] }}
              />
            </TouchableOpacity>

            {openCityDropdown && (
              <View className={`mt-1.5 border rounded-2xl overflow-hidden max-h-52 ${
                isDark ? "bg-navy-2 border-white/10" : "bg-paper border-rule-2"
              }`}>
                <ScrollView nestedScrollEnabled>
                  {locations.cities.map((ct, index) => {
                    const isSelected = ct.id === locations.cityId;
                    return (
                      <TouchableOpacity
                        key={ct.id}
                        activeOpacity={0.7}
                        onPress={() => {
                          locations.selectCity(ct.id);
                          setOpenCityDropdown(false);
                        }}
                        className={`px-4 py-3 flex-row items-center justify-between ${
                          isSelected
                            ? (isDark ? "bg-navy" : "bg-soft/50")
                            : (isDark ? "bg-navy-2" : "bg-paper")
                        } ${index < locations.cities.length - 1 ? (isDark ? "border-b border-white/10" : "border-b border-rule-2/70") : ""}`}
                      >
                        <Text className={`text-sm ${
                          isSelected ? "text-brand font-semibold" : (isDark ? "text-paper" : "text-body")
                        }`}>
                          {ct.name}
                        </Text>
                        {isSelected && <Check size={16} color="#1f6ae1" />}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      )
  );
}
