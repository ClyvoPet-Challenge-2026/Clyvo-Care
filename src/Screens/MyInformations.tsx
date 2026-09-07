import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, KeyboardAvoidingView, Platform, Alert, Modal } from "react-native";
import { User, Mail, Phone, MapPin, Camera, Moon, Sun, ChevronRight, LogOut, Save, Trash2, X } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import { Footer } from "../Components/Footer";
import { UserProfile } from "../Types/types";
import { DEFAULT_USER_PROFILE } from "../Data/DefaultUserProfileData";

const STORAGE_KEY = "@clyvo_user_profile";

export function MyInformations() {
  const { logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const [profile, setProfile] = useState<UserProfile>(DEFAULT_USER_PROFILE);

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<UserProfile>(profile);
  const [isSaving, setIsSaving] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile(parsed);
        setFormData(parsed);
      }
    } catch (e) {
      console.error("Erro ao carregar dados do usuário:", e);
    }
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert("Atenção", "O nome não pode estar em branco.");
      return;
    }
    setIsSaving(true);
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
      setProfile(formData);
      setIsEditing(false);
      Alert.alert("Sucesso", "Informações atualizadas com sucesso!");
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar as informações.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const initial = (profile.name || profile.email || "U").charAt(0).toUpperCase();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-mainBackground"
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Título da Página */}
        <View className="mb-5">
          <Text className="text-2xl font-bold text-navy">Minha Conta</Text>
          <Text className="text-xs text-mute mt-1">
            Gerencie suas informações pessoais e preferências do aplicativo
          </Text>
        </View>

        {/* Card do Perfil & Foto */}
        <View
          className="bg-paper rounded-3xl p-5 mb-5 border border-rule"
          style={{
            shadowColor: "#0c0d10",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center gap-4">
            {/* Foto de Perfil (Adicionar função de adicionar foto da biblioteca/câmera) */}
            <View className="relative">
              <View className="w-16 h-16 rounded-2xl bg-brand items-center justify-center overflow-hidden border-2 border-soft shadow-sm">
                {profile.photoUrl ? (
                  <Image
                    source={{ uri: profile.photoUrl }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-paper text-2xl font-bold">{initial}</Text>
                )}
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() =>
                  Alert.alert(
                    "Foto de perfil",
                    "Deseja atualizar a foto do seu perfil?",
                    [
                      { text: "Cancelar", style: "cancel" },
                      {
                        text: "Usar Padrão",
                        onPress: () => {
                          const updated = { ...formData, photoUrl: "" };
                          setFormData(updated);
                          setProfile(updated);
                          AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
                        },
                      },
                    ]
                  )
                }
                className="absolute -bottom-1 -right-1 bg-paper border border-rule rounded-full p-1.5 shadow"
              >
                <Camera size={14} color="#1f6ae1" />
              </TouchableOpacity>
            </View>

            {/* Informações Resumidas ao lado da foto */}
            <View className="flex-1 min-w-0">
              <Text className="text-lg font-bold text-navy truncate" numberOfLines={1}>
                {profile.name}
              </Text>
              <Text className="text-xs text-mute truncate mt-0.5" numberOfLines={1}>
                {profile.email}
              </Text>
              <View className="flex-row items-center mt-2">
              </View>
            </View>
          </View>
        </View>

        {/* Card de Dados Pessoais */}
        <View className="bg-paper rounded-3xl p-6 mb-5 border border-rule">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base font-bold text-navy">Informações Pessoais</Text>
            {!isEditing ? (
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="px-3 py-1.5 rounded-lg bg-lightBlue"
              >
                <Text className="text-xs font-semibold text-blue">Editar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleCancel} className="px-3 py-1.5">
                <Text className="text-xs font-semibold text-mute">Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Campo Nome */}
          <View className="mb-4">
            <Text className="text-xs font-medium text-mute mb-1.5">Nome Completo</Text>
            <View
              className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
                isEditing ? "border-brand bg-paper" : "border-rule bg-ground/50"
              }`}
            >
              <User size={16} color="#6c778c" />
              <TextInput
                editable={isEditing}
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
                placeholder="Seu nome completo"
                placeholderTextColor="#6c778c"
                className="flex-1 ml-2 text-sm text-ink p-0"
              />
            </View>
          </View>

          {/* Campo E-mail Registrado */}
          <View className="mb-4">
            <Text className="text-xs font-medium text-mute mb-1.5">E-mail Registrado</Text>
            <View
              className={`flex-row items-center rounded-xl border px-3 py-2.5  ${ 
                isEditing ? "border-brand bg-paper" : "border-rule bg-ground/50" 
              }`}
            >
              <Mail size={16} color="#6c778c" />
              <TextInput
                editable={isEditing}
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="seu.email@exemplo.com"
                placeholderTextColor="#6c778c"
                keyboardType="email-address"
                autoCapitalize="none"
                className="flex-1 ml-2 text-sm text-ink p-0"
              />
            </View>
          </View>

          {/* Campo Telefone */}
          <View className="mb-4">
            <Text className="text-xs font-medium text-mute mb-1.5">Telefone / WhatsApp</Text>
            <View
              className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
                isEditing ? "border-brand bg-paper" : "border-rule bg-ground/50"
              }`}
            >
              <Phone size={16} color="#6c778c" />
              <TextInput
                editable={isEditing}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="(00) 00000-0000"
                placeholderTextColor="#6c778c"
                keyboardType="phone-pad"
                className="flex-1 ml-2 text-sm text-ink p-0"
              />
            </View>
          </View>

          {/* Campo Endereço */}
          <View className="mb-4">
            <Text className="text-xs font-medium text-mute mb-1.5">Endereço Residencial</Text>
            <View
              className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
                isEditing
                  ? "border-brand bg-paper"
                  : "border-rule bg-ground/50"
              }`}
            >
              <MapPin size={16} color="#6c778c" />
              <TextInput
                editable={isEditing}
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                placeholder="Rua, número, bairro, cidade"
                placeholderTextColor="#6c778c"
                className="flex-1 ml-2 text-sm text-ink p-0"
              />
            </View>
          </View>

          {/* Botão Salvar (visível durante edição) */}
          {isEditing && (
            <TouchableOpacity
              onPress={handleSave}
              disabled={isSaving}
              activeOpacity={0.85}
              className="w-full rounded-xl bg-brand py-3.5 items-center justify-center flex-row gap-2 mt-2"
              style={{
                shadowColor: "#1f6ae1",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 4,
              }}
            >
              <Save size={16} color="#ffffff" />
              <Text className="text-paper text-base font-semibold">
                {isSaving ? "Salvando..." : "Salvar Alterações"}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Seção Configurações (Modelo Paw-Portal) */}
        <View className="mb-2">
          <Text className="text-xs font-semibold text-mute uppercase tracking-wider mb-2 ml-1">
            Configurações do Aplicativo
          </Text>
        </View>

        <View
          className="bg-paper rounded-3xl border border-rule overflow-hidden mb-6"
          style={{
            shadowColor: "#0c0d10",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          {/* Opção Tema Dark / Light */}
          <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.7}
            className="flex-row items-center justify-between px-5 py-4 border-b border-rule/60"
          >
            <View className="flex-row items-center gap-3.5 flex-1">
              <View className="w-9 h-9 rounded-xl bg-soft items-center justify-center">
                {theme === "dark" ? (
                  <Moon size={18} color="#1f6ae1" />
                ) : (
                  <Sun size={18} color="#1f6ae1" />
                )}
              </View>
              <View>
                <Text className="text-sm font-semibold text-ink">Tema da Aplicação</Text>
                <Text className="text-xs text-mute mt-0.5">
                  Alternar entre modo claro e escuro
                </Text>
              </View>
            </View>

            {/* Pill Switch estilo paw-portal */}
            <View className="flex-row items-center gap-2">
              <Text className="text-xs font-medium text-mute">
                {theme === "dark" ? "Escuro" : "Claro"}
              </Text>
              <View
                className={`w-12 h-6 rounded-full p-0.5 flex-row items-center ${
                  theme === "dark" ? "bg-brand justify-end" : "bg-rule justify-start"
                }`}
              >
                <View className="w-5 h-5 rounded-full bg-paper shadow-sm" />
              </View>
            </View>
          </TouchableOpacity>

          {/* Opção Encerrar Sessão */}
          <TouchableOpacity
            onPress={logout}
            activeOpacity={0.7}
            className="flex-row items-center justify-between px-5 py-4 border-b border-rule/60"
          >
            <View className="flex-row items-center gap-3.5">
              <View className="w-9 h-9 rounded-xl bg-soft items-center justify-center">
                <LogOut size={18} color="#1f6ae1" />
              </View>
              <View>
                <Text className="text-sm font-semibold text-ink">Desconectar</Text>
                <Text className="text-xs text-mute mt-0.5">Sair da sua conta atual</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#6c778c" />
          </TouchableOpacity>

          {/* Opção Excluir Conta (Destrutiva) */}
          <TouchableOpacity
            onPress={() => setConfirmDeleteModal(true)}
            activeOpacity={0.7}
            className="flex-row items-center justify-between px-5 py-4"
          >
            <View className="flex-row items-center gap-3.5">
              <View className="w-9 h-9 rounded-xl bg-danger/10 items-center justify-center">
                <Trash2 size={18} color="#d32f2f" />
              </View>
              <View>
                <Text className="text-sm font-semibold text-danger">Excluir Conta</Text>
                <Text className="text-xs text-mute mt-0.5">
                  Remover permanentemente seus dados
                </Text>
              </View>
            </View>
            <ChevronRight size={18} color="#d32f2f" />
          </TouchableOpacity>
        </View>

        {/* Rodapé institucional */}
        <Footer />
      </ScrollView>

      {/* Modal de Confirmação de Exclusão (Modelo Paw-Portal) */}
      <Modal
        visible={confirmDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setConfirmDeleteModal(false)}
      >
        <View className="flex-1 bg-black/60 items-center justify-center p-5">
          <View
            className="w-full max-w-sm bg-paper rounded-3xl p-6 border border-rule"
            style={{
              shadowColor: "#0c0d10",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-navy">Tem certeza?</Text>
              <TouchableOpacity
                onPress={() => setConfirmDeleteModal(false)}
                className="w-8 h-8 rounded-full items-center justify-center bg-ground"
              >
                <X size={16} color="#0c0d10" />
              </TouchableOpacity>
            </View>

            <Text className="text-xs text-mute mb-5 leading-relaxed">
              Esta ação é permanente. Todos os seus dados de tutor, histórico de agendamentos e pets cadastrados serão removidos.
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setConfirmDeleteModal(false)}
                className="flex-1 rounded-xl border border-rule py-3 items-center justify-center"
              >
                <Text className="text-sm font-semibold text-ink">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  setConfirmDeleteModal(false);
                  await AsyncStorage.removeItem(STORAGE_KEY);
                  await logout();
                }}
                className="flex-1 rounded-xl bg-danger py-3 items-center justify-center"
              >
                <Text className="text-sm font-semibold text-paper">Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}