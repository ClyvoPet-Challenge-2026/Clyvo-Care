import { View, Text, TouchableOpacity, Image } from "react-native";
import { Tag, Calendar, ArrowRight, Trash2, Edit3 } from "lucide-react-native";
import { getPetSpeciesImage } from "../../Utils/petPresentation";
import type { PetCardProps } from "../../Types/types";

export function PetCard({ pet, onEdit, onDelete, onAppointment }: PetCardProps) {
  const petImg = getPetSpeciesImage(pet.species?.name);
  return (
    <View
      className="bg-paper dark:bg-navy rounded-3xl p-4 border border-rule dark:border-white/10"
      style={{
        shadowColor: "#0c0d10",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center gap-3.5">
        <View className="w-16 h-16 rounded-2xl overflow-hidden border border-rule dark:border-white/10 bg-soft dark:bg-navy-2 items-center justify-center">
          <Image
            source={petImg}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>

        <View className="flex-1">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-bold text-navy dark:text-paper truncate" numberOfLines={1}>
              {pet.name}
            </Text>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity onPress={onEdit} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Edit3 size={16} color="#1f6ae1" />
              </TouchableOpacity>
              <TouchableOpacity onPress={onDelete} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Trash2 size={16} color="#e53935" />
              </TouchableOpacity>
            </View>
          </View>

          <Text className="text-xs text-mute dark:text-soft-line mt-0.5">
            {pet.species?.name || "Espécie"} • {pet.breed?.name || "Sem raça"}
          </Text>

          <View className="flex-row items-center gap-3 mt-1.5">
            <View className="flex-row items-center gap-1 bg-ground dark:bg-navy-2 px-2 py-0.5 rounded-lg border border-rule-2 dark:border-white/10">
              <Tag size={11} color="#525a6a" />
              <Text className="text-[11px] text-soft-ink dark:text-soft font-medium">
                {pet.sex === "MALE" ? "Macho" : "Fêmea"}
              </Text>
            </View>
            <View className="flex-row items-center gap-1 bg-ground dark:bg-navy-2 px-2 py-0.5 rounded-lg border border-rule-2 dark:border-white/10">
              <Calendar size={11} color="#525a6a" />
              <Text className="text-[11px] text-soft-ink dark:text-soft font-medium">
                {pet.birthDate}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Ação */}
      <View className="flex-row gap-2.5 mt-3.5 pt-3 border-t border-rule-2 dark:border-white/10">
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onAppointment}
          className="flex-1 bg-soft dark:bg-navy-2 rounded-xl py-2 px-3 flex-row items-center justify-center gap-1.5 border border-transparent dark:border-white/10"
        >
          <Text className="text-xs font-semibold text-brand">Agendar Consulta</Text>
          <ArrowRight size={13} color="#1f6ae1" />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onEdit}
          className="bg-ground dark:bg-navy-2 border border-rule dark:border-white/10 rounded-xl py-2 px-3.5 items-center justify-center"
        >
          <Text className="text-xs font-semibold text-soft-ink dark:text-soft">Editar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
