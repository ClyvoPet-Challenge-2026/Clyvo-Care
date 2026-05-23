import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { CirclePlus } from "lucide-react-native";
import { MyPetData } from "../Data/MyPetData";

export function MyPet() {
  const hasPets = MyPetData.length > 0;

  return (
    <View className="flex-1 bg-mainBackground">
      {/* titulo da página e botão */}
      <View className="w-full px-4 pt-4 pb-2">
        <View className="flex-row items-center relative justify-between">
          <Text className="text-lg font-bold">Meus Pets</Text>

          <TouchableOpacity className="flex-row items-center gap-2 bg-lightBlue rounded-full py-3 px-4">
            <CirclePlus size={20} color="#1F6AE1" />
            <Text className="text-blue text-sm font-semibold">Registrar Pet</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Visualização dos pets */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ alignItems: "center", paddingBottom: 24 }}
      >
        {hasPets ? (
          <View className="w-full items-center mt-2">
            {MyPetData.map((pet) => (
              <View
                key={pet.identifier}
                className="w-11/12 flex-row gap-4 bg-white rounded-lg p-4 mb-4"
              >
                <Image
                  source={pet.img}
                  className="w-24 h-24 rounded-lg"
                  resizeMode="cover"
                />
                <View className="flex-1">
                  <Text className="text-base font-bold text-neutral-900">
                    {pet.name}
                  </Text>
                  <View className="flex-row gap-2 mt-1">
                    <Text className="text-sm text-neutral-600">
                      Species: {pet.species}
                    </Text>
                    <Text className="text-sm text-neutral-600">
                      Breed: {pet.breed}
                    </Text>
                  </View>
                  <View className="flex-row gap-2 mt-1">
                    <Text className="text-sm text-neutral-600">
                      Sex: {pet.sex}
                    </Text>
                    <Text className="text-sm text-neutral-600">
                      Age: {pet.age}
                    </Text>
                  </View>
                  <Text className="text-sm text-neutral-600 mt-1">
                    Tutor: {pet.tutor}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="items-center justify-center mt-10">
            <Text className="text-gray-500 text-sm">
              Não há pets registrados.
            </Text>
            <Text className="text-gray-500 text-sm">
              Clique no botão acima para registrar seu pet.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}