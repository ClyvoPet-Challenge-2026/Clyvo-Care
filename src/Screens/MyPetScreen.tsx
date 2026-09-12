import { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput, Alert, ActivityIndicator } from "react-native";
import { Plus, Search, Heart, Tag, Calendar, ArrowRight, Trash2, Edit3 } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigation/navigation";
import { MyPetData } from "../Data/MyPetData";
import { SPECIES_FILTER_LIST } from "../Data/SpeciesFilterData";
import { useAuth } from "../Context/AuthContext";
import { usePets, useDeletePet } from "../Hooks/usePets";
import { PetSpecieBreedListData } from "../Data/PetSpecieBreedListData";
import { PetApiDTO } from "../Types/types";
import { ErrorState } from "../Components/ErrorState";

export function MyPet() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();

  const { data: pets = [], isLoading: loading, isError, error, refetch } = usePets(user?.id);
  const deletePetMutation = useDeletePet();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Todos");

  const speciesList = SPECIES_FILTER_LIST;

  const handleDeletePet = (petId: number, petName: string) => {
    Alert.alert(
      "Remover Pet",
      `Tem certeza que deseja remover ${petName}?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          style: "destructive",
          onPress: async () => {
            try {
              await deletePetMutation.mutateAsync(petId);
            } catch (err: any) {
              Alert.alert("Erro", err.message || "Não foi possível remover o pet.");
            }
          },
        },
      ]
    );
  };

  const handleEditPet = (pet: PetApiDTO) => {
    navigation.navigate("RegisterPet", { petToEdit: pet });
  };

  const filteredPets = pets.filter((pet) => {
    const breedName = pet.breed?.name || "";
    const speciesName = pet.species?.name || "";
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      breedName.toLowerCase().includes(searchTerm.toLowerCase());

    // Mapeia nome em inglês retornado da API (ex: "Dog") para o filtro local (ex: "Canino")
    const matchedSpecieConfig = PetSpecieBreedListData.find(
      (item) =>
        item.species.toLowerCase() === speciesName.toLowerCase() ||
        item.apiName?.toLowerCase() === speciesName.toLowerCase()
    );
    const resolvedSpecieLabel = matchedSpecieConfig?.species || speciesName;

    const matchesFilter =
      selectedFilter === "Todos" ||
      (selectedFilter === "Outros"
        ? !["Canino", "Felino", "Ave"].includes(resolvedSpecieLabel)
        : resolvedSpecieLabel.toLowerCase() === selectedFilter.toLowerCase());

    return matchesSearch && matchesFilter;
  });

  return (
    <View className="flex-1 bg-ground">
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
                <Text className="text-2xl font-bold text-navy">Meus Pets</Text>
              </View>
              <Text className="text-xs text-mute mt-1">
                {pets.length} {pets.length === 1 ? "pet registrado" : "pets registrados"} na sua conta
              </Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate("RegisterPet")}
              className="flex-row items-center gap-2 bg-brand rounded-2xl py-2.5 px-4 shadow-sm active:scale-98"
              style={{
                shadowColor: "#1f6ae1",
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.25,
                shadowRadius: 6,
                elevation: 3,
              }}
            >
              <Plus size={16} color="#ffffff" />
              <Text className="text-paper text-xs font-bold uppercase tracking-wider">
                Novo Pet
              </Text>
            </TouchableOpacity>
          </View>

          {/* Barra de Pesquisa */}
          <View className="mt-5 flex-row items-center bg-paper rounded-2xl px-4 py-3 border border-rule">
            <Search size={18} color="#6c778c" />
            <TextInput
              placeholder="Buscar por nome ou raça..."
              placeholderTextColor="#6c778c"
              value={searchTerm}
              onChangeText={setSearchTerm}
              className="flex-1 ml-3 text-sm text-ink p-0"
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm("")}>
                <Text className="text-xs font-semibold text-mute">Limpar</Text>
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
                      : "bg-paper border-rule"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      active ? "text-paper" : "text-soft-ink"
                    }`}
                  >
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
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
            filteredPets.map((pet) => {
              const currentSpeciesName = pet.species?.name?.toLowerCase() || "";
              const matchedConfig = PetSpecieBreedListData.find(
                (item) =>
                  item.species.toLowerCase() === currentSpeciesName ||
                  item.apiName?.toLowerCase() === currentSpeciesName
              );
              const targetSpecies = matchedConfig?.species.toLowerCase() || currentSpeciesName;

              const petImg =
                MyPetData.find((item) => item.species.toLowerCase() === targetSpecies)?.img ||
                MyPetData[0]?.img;
              return (
                <View
                  key={pet.id}
                  className="bg-paper rounded-3xl p-4 border border-rule"
                  style={{
                    shadowColor: "#0c0d10",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 8,
                    elevation: 2,
                  }}
                >
                  <View className="flex-row items-center gap-3.5">
                    <View className="w-16 h-16 rounded-2xl overflow-hidden border border-rule bg-soft items-center justify-center">
                      <Image
                        source={petImg}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                    </View>

                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text className="text-base font-bold text-navy truncate" numberOfLines={1}>
                          {pet.name}
                        </Text>
                        <View className="flex-row items-center gap-2">
                          <TouchableOpacity onPress={() => handleEditPet(pet)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                            <Edit3 size={16} color="#1f6ae1" />
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => handleDeletePet(pet.id, pet.name)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                            <Trash2 size={16} color="#e53935" />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <Text className="text-xs text-mute mt-0.5">
                        {pet.species?.name || "Espécie"} • {pet.breed?.name || "Sem raça"}
                      </Text>

                      <View className="flex-row items-center gap-3 mt-1.5">
                        <View className="flex-row items-center gap-1 bg-ground px-2 py-0.5 rounded-lg border border-rule-2">
                          <Tag size={11} color="#525a6a" />
                          <Text className="text-[11px] text-soft-ink font-medium">
                            {pet.sex === "MALE" ? "Macho" : "Fêmea"}
                          </Text>
                        </View>
                        <View className="flex-row items-center gap-1 bg-ground px-2 py-0.5 rounded-lg border border-rule-2">
                          <Calendar size={11} color="#525a6a" />
                          <Text className="text-[11px] text-soft-ink font-medium">
                            {pet.birthDate}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>

                  {/* Ação */}
                  <View className="flex-row gap-2.5 mt-3.5 pt-3 border-t border-rule-2">
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => navigation.navigate("MakeAppointment")}
                      className="flex-1 bg-soft rounded-xl py-2 px-3 flex-row items-center justify-center gap-1.5"
                    >
                      <Text className="text-xs font-semibold text-brand">Agendar Consulta</Text>
                      <ArrowRight size={13} color="#1f6ae1" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => handleEditPet(pet)}
                      className="bg-ground border border-rule rounded-xl py-2 px-3.5 items-center justify-center"
                    >
                      <Text className="text-xs font-semibold text-soft-ink">Editar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          ) : (
            <View className="bg-paper rounded-3xl p-8 border border-rule items-center justify-center mt-2">
              <View className="w-14 h-14 rounded-full bg-soft items-center justify-center mb-3">
                <Heart size={24} color="#1f6ae1" />
              </View>
              <Text className="text-base font-bold text-navy text-center">
                Nenhum pet encontrado
              </Text>
              <Text className="text-xs text-mute text-center mt-1 leading-5 px-4">
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
