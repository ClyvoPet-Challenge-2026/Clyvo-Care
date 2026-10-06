import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { Heart, Check, Plus } from "lucide-react-native";
import { getPetSpeciesImage } from "../../Utils/petPresentation";
import { useTheme } from "../../Context/ThemeContext";
import type { PetSelectorProps } from "../../Types/types";

export function PetSelector({ pets, loadingPets, selectedPet, setSelectedPet, onRegisterPet }: PetSelectorProps) {
  const { isDark } = useTheme();
  return (
    <View className={`rounded-3xl p-5 mb-5 border ${
      isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
    }`}>
      <View className="flex-row items-center justify-between mb-3.5">
        <View className="flex-row items-center gap-2">
          <Heart size={18} color="#1f6ae1" />
          <Text className={`text-base font-bold ${isDark ? "text-paper" : "text-navy"}`}>
            Qual pet passará na consulta?
          </Text>
        </View>
      </View>

      {/* Carrossel Horizontal de Seleção de Pets da API */}
      {loadingPets ? (
        <ActivityIndicator size="small" color="#1f6ae1" className="py-4" />
      ) : pets.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="-mx-1 py-1"
        >
          {pets.map((pet) => {
            const isSelected = selectedPet === pet.id;
            const petImg = getPetSpeciesImage(pet.species?.name);

            return (
              <TouchableOpacity
                key={pet.id}
                activeOpacity={0.8}
                onPress={() => setSelectedPet(pet.id)}
                style={
                  isSelected
                    ? {
                        shadowColor: "#000",
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.08,
                        shadowRadius: 2,
                        elevation: 1,
                      }
                    : undefined
                }
                className={`mr-3 p-3 rounded-2xl border items-center w-28 ${
                  isSelected
                    ? (isDark ? "border-brand bg-brand/20" : "border-brand bg-soft")
                    : (isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground")
                }`}
              >
                <View className="relative mb-2">
                  <View
                    className={`w-14 h-14 rounded-full overflow-hidden border-2 ${
                      isSelected ? "border-brand" : (isDark ? "border-white/10" : "border-rule")
                    }`}
                  >
                    <Image
                      source={petImg}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                  {isSelected && (
                    <View className={`absolute -bottom-1 -right-1 bg-brand rounded-full w-5 h-5 items-center justify-center border-2 ${
                      isDark ? "border-navy" : "border-paper"
                    }`}>
                      <Check size={11} color="#ffffff" />
                    </View>
                  )}
                </View>
                <Text
                  className={`text-xs font-bold text-center ${
                    isSelected ? "text-brand" : (isDark ? "text-paper" : "text-navy")
                  }`}
                  numberOfLines={1}
                >
                  {pet.name}
                </Text>
                <Text className={`text-[10px] text-center ${isDark ? "text-soft-line" : "text-mute"}`} numberOfLines={1}>
                  {pet.breed?.name || pet.species?.name || "Pet"}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : (
        <View className="items-center py-4">
          <Text className={`text-xs mb-2 ${isDark ? "text-soft-line" : "text-mute"}`}>Nenhum pet cadastrado para agendamento.</Text>
          <TouchableOpacity
            onPress={onRegisterPet}
            className="flex-row items-center gap-1.5 bg-brand px-3.5 py-2 rounded-xl"
          >
            <Plus size={14} color="#ffffff" />
            <Text className="text-xs text-paper font-semibold">Cadastrar Pet</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
