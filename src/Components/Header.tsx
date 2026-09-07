import { View, Text, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Menu, X, User, LogOut, Home, Heart, PlusCircle, Calendar, Settings } from "lucide-react-native";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Types/types";

interface HeaderProps {
  navigation?: NativeStackNavigationProp<RootStackParamList>;
}

export default function Header({ navigation: propNavigation }: HeaderProps = {}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();
  const hookNavigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const navigation = propNavigation || hookNavigation;

  const handleLogout = () => {
    setDropOpen(false);
    setDrawerOpen(false);
    logout();
  };

  const navigateTo = (screen: keyof RootStackParamList) => {
    setDrawerOpen(false);
    navigation.navigate(screen);
  };

  const iconTop = insets.top + 10;
  const dropdownTop = iconTop + 46;

  return (
    <SafeAreaView
      edges={["top"]}
      className="bg-paper border-b border-rule relative z-40"
    >
      <View className="h-14 flex-row items-center justify-between px-4">
        {/* Botão Hambúrguer */}
        <TouchableOpacity
          onPress={() => setDrawerOpen(true)}
          activeOpacity={0.7}
          className="w-10 h-10 items-center justify-center"
        >
          <Menu size={22} color="#0c0d10" />
        </TouchableOpacity>

        {/* Logo */}
        <TouchableOpacity
          onPress={() => navigation.navigate("MainScreen")}
          className="flex-row items-center"
          activeOpacity={0.8}
        >
          <Text className="text-black font-semibold text-2xl ml-2 mt-1">
            Clyvo
          </Text>
          <Text className="text-blue font-semibold text-2xl mt-1">Care</Text>
        </TouchableOpacity>

        {/* Botão Perfil/Avatar */}
        <TouchableOpacity
          onPress={() => setDropOpen(!dropOpen)}
          activeOpacity={0.8}
          className="w-10 h-10 rounded-full bg-brand items-center justify-center"
          style={{
            shadowColor: "#1f6ae1",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.25,
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <User size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Dropdown do Perfil */}
      {dropOpen && (
        <View className="absolute right-4 z-50">
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setDropOpen(false)}
            className="absolute -bottom-[1000px] left-0 right-0 top-0 z-40"
          />
          <View
            className="absolute right-4 w-60 rounded-2xl bg-paper border border-rule z-50 overflow-hidden"
            style={{
              top: dropdownTop,
              shadowColor: "#0c0d10",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.15,
              shadowRadius: 14,
              elevation: 8,
            }}
          >
            <View className="px-4 py-3 border-b border-rule bg-ground/50">
              <Text className="text-xs text-mute font-medium">Logado como</Text>
              <Text className="text-sm font-semibold text-ink truncate mt-0.5">
                Usuário Clyvo {/* aqui vai ser o nome do usuário */} 
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setDropOpen(false);
                navigation.navigate("MyInformations");
              }}
              className="flex-row items-center px-4 py-3 border-b border-rule/50 active:bg-ground"
            >
              <Settings size={16} color="#393f4b" />
              <Text className="ml-3 text-sm text-body font-medium">
                Meus Dados
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className="flex-row items-center px-4 py-3 active:bg-ground"
            >
              <LogOut size={16} color="#d32f2f" />
              <Text className="ml-3 text-sm text-danger font-semibold">
                Sair
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Menu Hambúrguer Lateral */}
      <Modal
        visible={drawerOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDrawerOpen(false)}
      >
        <View className="flex-1 flex-row">
          {/* Menu Lateral */}
          <SafeAreaView className="w-72 bg-paper h-full flex-col shadow-xl z-50 border-r border-rule">
            {/* Header do Menu */}
            <View className="h-16 px-4 flex-row items-center justify-between border-b border-rule">
              <View className="flex-row items-center">
                <Text className="text-black font-semibold text-xl">Clyvo</Text>
                <Text className="text-blue font-semibold text-xl">Care</Text>
              </View>
              <TouchableOpacity
                onPress={() => setDrawerOpen(false)}
                className="w-9 h-9 rounded-full items-center justify-center"
              >
                <X size={20} color="#0c0d10" />
              </TouchableOpacity>
            </View>

            {/* Itens de Navegação */}
            <View className="p-3 space-y-1">
              <TouchableOpacity
                onPress={() => navigateTo("MainScreen")}
                className="flex-row items-center gap-3 px-3 py-3 rounded-xl active:bg-soft"
              >
                <Home size={20} color="#1f6ae1" />
                <Text className="text-sm font-medium text-ink">Início</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigateTo("MyPet")}
                className="flex-row items-center gap-3 px-3 py-3 rounded-xl active:bg-soft"
              >
                <Heart size={20} color="#1f6ae1" />
                <Text className="text-sm font-medium text-ink">Meus Pets</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigateTo("RegisterPet")}
                className="flex-row items-center gap-3 px-3 py-3 rounded-xl active:bg-soft"
              >
                <PlusCircle size={20} color="#1f6ae1" />
                <Text className="text-sm font-medium text-ink">
                  Cadastrar Pet
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigateTo("MakeAppointment")}
                className="flex-row items-center gap-3 px-3 py-3 rounded-xl active:bg-soft"
              >
                <Calendar size={20} color="#1f6ae1" />
                <Text className="text-sm font-medium text-ink">
                  Marcar Consulta
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigateTo("MyInformations")}
                className="flex-row items-center gap-3 px-3 py-3 rounded-xl active:bg-soft"
              >
                <User size={20} color="#1f6ae1" />
                <Text className="text-sm font-medium text-ink">Minha Conta</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>

          {/* Fundo escuro transparente */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => setDrawerOpen(false)}
            className="flex-1 bg-black/70"
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}