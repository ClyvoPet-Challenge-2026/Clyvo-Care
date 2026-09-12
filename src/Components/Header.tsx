import { View, Text, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Menu, X, User, LogOut, Home, Heart, PlusCircle, Calendar, Settings, Moon, Sun } from "lucide-react-native";
import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useOwnerProfile } from "../Hooks/useOwner";
import { useTheme } from "../Context/ThemeContext";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../Types/types";

interface HeaderProps {
  navigation?: NativeStackNavigationProp<RootStackParamList>;
}

export default function Header({ navigation: propNavigation }: HeaderProps = {}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const { data: ownerData } = useOwnerProfile(user?.id);
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
      className={`border-b relative z-40 ${isDark ? "bg-navy border-white/10" : "bg-paper border-rule"}`}
    >
      <View className="h-14 flex-row items-center justify-between px-4">
        {/* Botão Hambúrguer */}
        <TouchableOpacity
          onPress={() => setDrawerOpen(true)}
          activeOpacity={0.7}
          className="w-10 h-10 items-center justify-center"
        >
          <Menu size={22} color={isDark ? "#ffffff" : "#0c0d10"} />
        </TouchableOpacity>

        {/* Logo */}
        <TouchableOpacity
          onPress={() => navigation.navigate("MainScreen")}
          className="flex-row items-center"
          activeOpacity={0.8}
        >
          <Text className={`font-semibold text-2xl ml-2 mt-1 ${isDark ? "text-paper" : "text-ink"}`}>
            Clyvo
          </Text>
          <Text className="text-brand font-semibold text-2xl mt-1">Care</Text>
        </TouchableOpacity>

        {/* Ações da Direita: Toggle Theme + Avatar */}
        <View className="flex-row items-center gap-2">
          {/* Botão Perfil/Avatar */}
          <TouchableOpacity
            onPress={() => setDropOpen(!dropOpen)}
            activeOpacity={0.8}
            className="w-10 h-10 rounded-full bg-brand items-center justify-center">
            <User size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>
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
            className={`absolute right-4 w-60 rounded-2xl border z-50 overflow-hidden ${
              isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
            }`}
            style={{
              top: dropdownTop,
              elevation: 8,
            }}
          >
            <View className={`px-4 py-3 border-b ${isDark ? "bg-navy-2 border-white/10" : "bg-ground/50 border-rule"}`}>
              <Text className={`text-xs font-medium ${isDark ? "text-soft-line" : "text-mute"}`}>Logado como</Text>
              <Text className={`text-sm font-semibold truncate mt-0.5 ${isDark ? "text-paper" : "text-ink"}`} numberOfLines={1}>
                {ownerData?.name || user?.name || "Usuário Clyvo"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => {
                setDropOpen(false);
                navigation.navigate("MyInformations");
              }}
              className={`flex-row items-center px-4 py-3 border-b ${
                isDark ? "border-white/10 active:bg-navy-2" : "border-rule/50 active:bg-ground"
              }`}
            >
              <Settings size={16} color={isDark ? "#99b6e6" : "#393f4b"} />
              <Text className={`ml-3 text-sm font-medium ${isDark ? "text-soft" : "text-body"}`}>
                Meus Dados
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogout}
              className={`flex-row items-center px-4 py-3 ${isDark ? "active:bg-navy-2" : "active:bg-ground"}`}
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
          <SafeAreaView className={`w-72 h-full flex-col shadow-xl z-50 border-r ${
            isDark ? "bg-navy-2 border-white/10" : "bg-paper border-rule"
          }`}>
            {/* Header do Menu */}
            <View className={`h-16 px-4 flex-row items-center justify-between border-b ${
              isDark ? "border-white/10" : "border-rule"
            }`}>
              <View className="flex-row items-center">
                <Text className={`font-semibold text-xl ${isDark ? "text-paper" : "text-ink"}`}>Clyvo</Text>
                <Text className="text-brand font-semibold text-xl">Care</Text>
              </View>
              <TouchableOpacity
                onPress={() => setDrawerOpen(false)}
                className="w-9 h-9 rounded-full items-center justify-center"
              >
                <X size={20} color={isDark ? "#ffffff" : "#0c0d10"} />
              </TouchableOpacity>
            </View>

            {/* Itens de Navegação */}
            <View className="p-3 space-y-1">
              <TouchableOpacity
                onPress={() => navigateTo("MainScreen")}
                className={`flex-row items-center gap-3 px-3 py-3 rounded-xl ${
                  isDark ? "active:bg-navy" : "active:bg-soft"
                }`}
              >
                <Home size={20} color="#1f6ae1" />
                <Text className={`text-sm font-medium ${isDark ? "text-paper" : "text-ink"}`}>Início</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigateTo("MyPet")}
                className={`flex-row items-center gap-3 px-3 py-3 rounded-xl ${
                  isDark ? "active:bg-navy" : "active:bg-soft"
                }`}
              >
                <Heart size={20} color="#1f6ae1" />
                <Text className={`text-sm font-medium ${isDark ? "text-paper" : "text-ink"}`}>Meus Pets</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigateTo("RegisterPet")}
                className={`flex-row items-center gap-3 px-3 py-3 rounded-xl ${
                  isDark ? "active:bg-navy" : "active:bg-soft"
                }`}
              >
                <PlusCircle size={20} color="#1f6ae1" />
                <Text className={`text-sm font-medium ${isDark ? "text-paper" : "text-ink"}`}>
                  Cadastrar Pet
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigateTo("MakeAppointment")}
                className={`flex-row items-center gap-3 px-3 py-3 rounded-xl ${
                  isDark ? "active:bg-navy" : "active:bg-soft"
                }`}
              >
                <Calendar size={20} color="#1f6ae1" />
                <Text className={`text-sm font-medium ${isDark ? "text-paper" : "text-ink"}`}>
                  Marcar Consulta
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigateTo("MyInformations")}
                className={`flex-row items-center gap-3 px-3 py-3 rounded-xl ${
                  isDark ? "active:bg-navy" : "active:bg-soft"
                }`}
              >
                <User size={20} color="#1f6ae1" />
                <Text className={`text-sm font-medium ${isDark ? "text-paper" : "text-ink"}`}>Minha Conta</Text>
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