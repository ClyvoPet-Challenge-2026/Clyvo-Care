import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { Search } from "lucide-react-native";
import { useTheme } from "../../Context/ThemeContext";
import type { PetFiltersProps } from "../../Types/types";

export function PetFilters({ searchTerm, setSearchTerm, selectedFilter, setSelectedFilter, speciesList }: PetFiltersProps) {
  const { isDark } = useTheme();
  return (
    <>
      {/* Barra de Pesquisa */}
      <View className={`mt-5 flex-row items-center rounded-2xl px-4 py-3 border ${
        isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
      }`}>
        <Search size={18} color="#6c778c" />
        <TextInput
          placeholder="Buscar por nome ou raça..."
          placeholderTextColor="#6c778c"
          value={searchTerm}
          onChangeText={setSearchTerm}
          className={`flex-1 ml-3 text-sm p-0 ${isDark ? "text-paper" : "text-ink"}`}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm("")}>
            <Text className={`text-xs font-semibold ${isDark ? "text-soft-line" : "text-mute"}`}>Limpar</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filtro Rápido por Espécie */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingTop: 12 }}
      >
        {speciesList.map((item) => {
          const active = selectedFilter === item;
          return (
            <TouchableOpacity
              key={item}
              activeOpacity={0.8}
              onPress={() => setSelectedFilter(item)}
              className={`px-3.5 py-1.5 rounded-xl border ${
                active
                  ? "bg-brand border-brand"
                  : (isDark ? "bg-navy border-white/10" : "bg-paper border-rule")
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  active ? "text-paper" : (isDark ? "text-soft" : "text-soft-ink")
                }`}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </>
  );
}
