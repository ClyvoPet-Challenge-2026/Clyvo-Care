import { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, TextInput } from "react-native";
import { Plus, Search, Heart, ShieldCheck, User, Calendar, Tag, Dna, ArrowRight } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Navigation/navigation";
import { MyPetData } from "../Data/MyPetData";
import { SPECIES_FILTER_LIST } from "../Data/SpeciesFilterData";
import { Footer } from "../Components/Footer";

export function MyPet() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("Todos");

  const speciesList = SPECIES_FILTER_LIST;

  const filteredPets = MyPetData.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pet.tutor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      selectedFilter === "Todos" ||
      (selectedFilter === "Outros"
        ? !["Canino", "Felino", "Ave"].includes(pet.species)
        : pet.species.toLowerCase() === selectedFilter.toLowerCase());

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
                {MyPetData.length} {MyPetData.length === 1 ? "pet registrado" : "pets registrados"} na sua conta
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
              placeholder="Buscar por nome, raça ou tutor..."
              placeholderTextColor="#6c778c"
              value={searchTerm}
              onChangeText={setSearchTerm}
              className="flex-1 ml-3 text-sm text-ink p-0"
            />
            {searchTerm.length > 0 && (
              <TouchableOpacity onPress={() => setSearchTerm("")} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
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
                  className={`px-3.5 py-1.5 rounded-full border ${
                    active
                      ? "bg-navy border-navy"
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
        <View className="px-5 space-y-4">
          {filteredPets.length > 0 ? (
            filteredPets.map((pet) => (
              <View
                key={pet.identifier ?? pet.id}
                className="bg-paper rounded-3xl p-4 border border-rule overflow-hidden"
                style={{
                  shadowColor: "#0c0d10",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.05,
                  shadowRadius: 10,
                  elevation: 3,
                }}
              >
                <View className="flex-row gap-4">
                  {/* Imagem do Pet */}
                  <View className="relative">
                    <Image
                      source={pet.img}
                      className="w-24 h-24 rounded-2xl bg-soft"
                      resizeMode="cover"
                    />
                    <View className="absolute top-1.5 left-1.5 bg-navy/85 px-2 py-0.5 rounded-md">
                      <Text className="text-[10px] text-paper font-semibold">
                        {pet.species}
                      </Text>
                    </View>
                  </View>

                  {/* Informações Principais */}
                  <View className="flex-1 justify-between py-0.5">
                    <View>
                      <View className="flex-row items-center justify-between">
                        <Text className="text-lg font-bold text-navy" numberOfLines={1}>
                          {pet.name}
                        </Text>
                        <View className="flex-row items-center gap-1 bg-soft/60 px-2 py-0.5 rounded-full">
                          <ShieldCheck size={12} color="#008c4d" />
                          <Text className="text-[10px] font-semibold text-ok">Ativo</Text>
                        </View>
                      </View>

                      {/* Raça */}
                      <View className="flex-row items-center gap-1.5 mt-1">
                        <Dna size={13} color="#6c778c" />
                        <Text className="text-xs text-soft-ink font-medium" numberOfLines={1}>
                          {pet.breed}
                        </Text>
                      </View>

                      {/* Sexo e Idade */}
                      <View className="flex-row items-center gap-3 mt-1.5">
                        <View className="flex-row items-center gap-1 bg-ground px-2 py-0.5 rounded-lg border border-rule-2">
                          <Tag size={11} color="#525a6a" />
                          <Text className="text-[11px] text-soft-ink font-medium">
                            {pet.sex}
                          </Text>
                        </View>

                        <View className="flex-row items-center gap-1 bg-ground px-2 py-0.5 rounded-lg border border-rule-2">
                          <Calendar size={11} color="#525a6a" />
                          <Text className="text-[11px] text-soft-ink font-medium">
                            {pet.age} {pet.age === 1 ? "ano" : "anos"}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Tutor */}
                    <View className="flex-row items-center gap-1.5 mt-2 pt-2 border-t border-rule-2">
                      <User size={13} color="#6c778c" />
                      <Text className="text-xs text-mute truncate" numberOfLines={1}>
                        Tutor(a): <Text className="font-semibold text-soft-ink">{pet.tutor}</Text>
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Ações Rápidas do Card */}
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
                    onPress={() => navigation.navigate("RegisterPet")}
                    className="bg-ground border border-rule rounded-xl py-2 px-3.5 items-center justify-center"
                  >
                    <Text className="text-xs font-semibold text-soft-ink">Editar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
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
                  : "Você ainda não possui pets registrados nesta categoria."}
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