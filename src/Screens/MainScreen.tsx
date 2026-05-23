import { View, ScrollView, Text, TouchableOpacity} from "react-native"
import { LocationCarrousel } from "../Components/LocationCarrousel";
import { MainScreenProps } from "../Types/types";


export function MainScreen({ navigation }: MainScreenProps) {
  return (
    <View className="flex-1 bg-mainBackground">
      <ScrollView
        className="flex-1 h-screen overflow-y-scroll "
        contentContainerStyle={{ alignItems: "center", paddingTop: 32, paddingBottom: 24 }}
      >

        {/* Secção de Introdução */}
        <View className="items-center w-11/12">
          <Text className="text-neutral-900 text-3xl font-bold text-center mb-4">
            Cuidado completo para o seu pet, do jeitinho que ele merece
          </Text>
          <Text className="text-neutral-600 text-base text-center mb-8">
            Agende consultas, acompanhe o histórico e encontre a unidade mais próxima com facilidade.
          </Text>

          <View className="flex-row gap-4 mb-8">
            <TouchableOpacity
              onPress={() => navigation.navigate("RegisterPet")}
              className="w-40 items-center justify-center bg-blue rounded-lg py-3 ml-4"
            >
              <Text className="text-white text-sm font-semibold">Registrar Pet</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("MyPet")}
              className="w-40 items-center justify-center bg-white border border-blue rounded-lg py-3"
            >
              <Text className="text-blue text-sm font-semibold">Ver Pets</Text>
            </TouchableOpacity>
          </View>

          {/* Secção de Nossas Unidades */}
          <View className="w-screen items-center bg-white mt-4 mb-4 p-4 rounded-lg">
            <Text className="text-lg font-bold mb-4 text-blue">Nossas Unidades</Text>
            <LocationCarrousel />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}