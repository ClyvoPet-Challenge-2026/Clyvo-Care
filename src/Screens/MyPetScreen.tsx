import { usePetList } from "../Hooks/usePetList";
import { PetCard } from "../Components/MyPetComponents/PetCard";
import { PetFilters } from "../Components/MyPetComponents/PetFilters";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Plus, Heart } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigation/navigation";
import { PetApiDTO } from "../Types/types";
import { ErrorState } from "../Components/ErrorState";
import { useTheme } from "../Context/ThemeContext";

export function MyPet() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { isDark } = useTheme();
  const {
    pets, filteredPets, loading, isError, error, refetch,
    searchTerm, setSearchTerm, selectedFilter, setSelectedFilter,
    speciesList, handleDeletePet,
  } = usePetList();

  const handleEditPet = (pet: PetApiDTO) => {
    navigation.navigate("RegisterPet", { petToEdit: pet });
  };

  return (
    <View className={`flex-1 ${isDark ? "bg-navy-2" : "bg-ground"}`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Header da Tela */}
        <View className="px-5 pt-6 pb-4">
          <View className="flex-row items-center justify-between">
            <View>
              <View className="flex-row items-center gap-2">
                <Heart size={20} color="#1f6ae1" />
                <Text className={`text-2xl font-bold ${isDark ? "text-paper" : "text-navy"}`}>Meus Pets</Text>
              </View>
              <Text className={`text-xs mt-1 ${isDark ? "text-soft-line" : "text-mute"}`}>
                {pets.length} {pets.length === 1 ? "pet registrado" : "pets registrados"} na sua conta
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate("RegisterPet")}
              className="flex-row items-center gap-2 bg-brand rounded-2xl py-2.5 px-4 shadow-sm active:scale-98">
              <Plus size={16} color="#ffffff" />
              <Text className="text-paper text-xs font-bold uppercase tracking-wider">
                Novo Pet
              </Text>
            </TouchableOpacity>
          </View>

          <PetFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedFilter={selectedFilter}
            setSelectedFilter={setSelectedFilter}
            speciesList={speciesList}
          />
        </View>

        {/* Lista de Pets */}
        <View className="px-5 mt-2 gap-3">
          {loading ? (
            <ActivityIndicator size="large" color="#1f6ae1" className="py-10" />
          ) : isError ? (
            <ErrorState
              title="Erro ao carregar pets"
              message={
                error instanceof Error
                  ? error.message
                  : "Não foi possível obter a lista de pets da API. Verifique sua conexão com o servidor."
              }
              onRetry={() => refetch()}
            />
          ) : filteredPets.length > 0 ? (
            filteredPets.map((pet) => (
              <PetCard
                key={pet.id}
                pet={pet}
                onEdit={() => handleEditPet(pet)}
                onDelete={() => handleDeletePet(pet.id, pet.name)}
                onAppointment={() => navigation.navigate("MakeAppointment")}
              />
            ))
          ) : (
            <View className="bg-paper dark:bg-navy rounded-3xl p-8 border border-rule dark:border-white/10 items-center justify-center mt-2">
              <View className="w-14 h-14 rounded-full bg-soft dark:bg-navy-2 items-center justify-center mb-3">
                <Heart size={24} color="#1f6ae1" />
              </View>
              <Text className="text-base font-bold text-navy dark:text-paper text-center">
                Nenhum pet encontrado
              </Text>
              <Text className="text-xs text-mute dark:text-soft-line text-center mt-1 leading-5 px-4">
                {searchTerm
                  ? "Tente ajustar o termo da busca ou alterar os filtros aplicados."
                  : "Você ainda não possui pets registrados nesta conta."}
              </Text>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate("RegisterPet")}
                className="mt-4 bg-brand rounded-2xl py-2.5 px-5 flex-row items-center gap-2"
              >
                <Plus size={15} color="#ffffff" />
                <Text className="text-paper text-xs font-bold uppercase tracking-wider">
                  Cadastrar Pet
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
