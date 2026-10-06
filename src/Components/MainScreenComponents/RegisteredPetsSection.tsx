import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Heart, ChevronRight, Plus } from "lucide-react-native";
import { getPetSpeciesImage } from "../../Utils/petPresentation";
import { useTheme } from "../../Context/ThemeContext";
import type { RegisteredPetsSectionProps } from "../../Types/types";

export function RegisteredPetsSection({ pets, onViewPets, onRegisterPet }: RegisteredPetsSectionProps) {
  const { isDark } = useTheme();
  return (
    <View className="mt-8 mb-10">
      <View className="flex-row items-center justify-between mb-3 px-1">
        <View className="flex-row items-center gap-2">
          <Heart size={18} color="#1f6ae1" />
          <Text className={`text-lg font-bold ${isDark ? "text-paper" : "text-navy"}`}>
            Pets Cadastrados ({pets.length})
          </Text>
        </View>
        <TouchableOpacity
          onPress={onViewPets}
          className="flex-row items-center gap-1"
        >
          <Text className="text-xs font-semibold text-brand">Ver todos</Text>
          <ChevronRight size={14} color="#1f6ae1" />
        </TouchableOpacity>
      </View>

      {pets.length > 0 ? (
        <View className="-mx-5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingLeft: 20,
              paddingRight: 20,
              alignItems: "stretch",
            }}
            className="py-1"
          >
            {pets.map((pet) => {
              const petImg = getPetSpeciesImage(pet.species?.name);

              return (
                <TouchableOpacity
                  key={pet.id}
                  activeOpacity={0.85}
                  onPress={onViewPets}
                  className={`w-44 rounded-3xl p-4 border mr-3 flex-col justify-between ${
                    isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
                  }`}
                >
                  <View className={`w-full h-24 rounded-2xl overflow-hidden mb-2.5 items-center justify-center ${
                    isDark ? "bg-navy-2" : "bg-soft"
                  }`}>
                    <Image
                      source={petImg}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </View>
                  <View>
                    <Text className={`text-sm font-bold truncate ${isDark ? "text-paper" : "text-navy"}`} numberOfLines={1}>
                      {pet.name}
                    </Text>
                    <Text className={`text-xs truncate mt-0.5 ${isDark ? "text-soft-line" : "text-mute"}`} numberOfLines={1}>
                      {pet.breed?.name || pet.species?.name || "Pet"}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onRegisterPet}
              className={`w-36 border-2 border-dashed rounded-3xl items-center justify-center p-4 min-h-[160px] ${
                isDark ? "bg-navy/40 border-white/20" : "bg-ground/80 border-rule"
              }`}
            >
              <View className={`w-12 h-12 rounded-full items-center justify-center mb-2 ${
                isDark ? "bg-navy-2" : "bg-soft"
              }`}>
                <Plus size={22} color="#1f6ae1" />
              </View>
              <Text className={`text-xs font-bold text-center ${isDark ? "text-paper" : "text-navy"}`}>Novo Pet</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      ) : (
        <View className={`rounded-3xl p-6 border items-center ${
          isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
        }`}>
          <View className={`w-12 h-12 rounded-2xl items-center justify-center mb-3 ${
            isDark ? "bg-navy-2" : "bg-soft"
          }`}>
            <Heart size={24} color="#1f6ae1" />
          </View>
          <Text className={`text-sm font-bold ${isDark ? "text-paper" : "text-navy"}`}>Nenhum pet registrado</Text>
          <Text className={`text-xs text-center mt-1 mb-4 ${isDark ? "text-soft-line" : "text-mute"}`}>
            Cadastre seu animalzinho para gerenciar prontuário e vacinas.
          </Text>
          <TouchableOpacity
            onPress={onRegisterPet}
            className="bg-brand px-4 py-2.5 rounded-xl flex-row items-center gap-2"
          >
            <Plus size={16} color="#ffffff" />
            <Text className="text-paper text-xs font-bold">Cadastrar Pet</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
