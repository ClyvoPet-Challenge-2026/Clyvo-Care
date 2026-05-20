import {View, Text} from "react-native"
import Header from "../Components/Header";
import Footer from "../Components/Footer";

export function MainScreen() {
  return (
    <View className="flex-1 bg-mainBackground">
      <Header />
      <View className="flex-1 items-center justify-center h-screen">
        <View className="items-center justify-center">
          <Text className="text-neutral-900 text-3xl font-bold mb-4">
            Bem-vindo!
          </Text>
          <Text className="text-neutral-600 text-base text-center mb-8">
            Você foi redirecionado com sucesso
          </Text>
        </View>
      </View>
      <Footer />
    </View>
  );
}