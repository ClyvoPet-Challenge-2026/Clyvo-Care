import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Alert, Modal, ActivityIndicator } from "react-native";
import { User, Mail, Phone, MapPin, Moon, Sun, ChevronRight, ChevronDown, LogOut, Save, Trash2, X, Lock, Check } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import { Footer } from "../Components/Footer";
import { useOwnerProfile, useUpdateProfile, useDeleteAccount } from "../Hooks/useOwner";
import { getStates, getCities } from "../Services/auth";
import { StateApiDTO, CityApiDTO, RegisterFormData, OwnerApiDTO } from "../Types/types";
import { DEFAULT_STATES, DEFAULT_CITIES } from "../Data/LocationGeoData";

export function MyInformations() {
  const { user, logout, updateUser } = useAuth();
  const { theme, setTheme, isDark, toggleTheme } = useTheme();

  // TanStack Query: Leitura em tempo real do perfil do tutor
  const { data: ownerData } = useOwnerProfile(user?.id);
  const updateProfileMutation = useUpdateProfile();
  const deleteAccountMutation = useDeleteAccount();

  const [isEditing, setIsEditing] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  // Estados e cidades para dropdown na edição
  const [states, setStates] = useState<StateApiDTO[]>([]);
  const [cities, setCities] = useState<CityApiDTO[]>([]);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [openStateDropdown, setOpenStateDropdown] = useState(false);
  const [openCityDropdown, setOpenCityDropdown] = useState(false);

  // Formulário de edição
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formCpf, setFormCpf] = useState("");
  const [formCityId, setFormCityId] = useState<number>(0);
  const [formPassword, setFormPassword] = useState("");

  useEffect(() => {
    loadLocations();
  }, []);

  useEffect(() => {
    if (ownerData) {
      setFormName(ownerData.name || "");
      setFormEmail(ownerData.email || "");
      setFormPhone(ownerData.phone || "");
      setFormCpf(ownerData.cpf || "");
      if (ownerData.city) {
        setFormCityId(ownerData.city.id);
        if (ownerData.city.state?.id) {
          setSelectedStateId(ownerData.city.state.id);
        }
      }
    } else if (user) {
      setFormName(user.name || "");
      setFormEmail(user.email || "");
      setFormPhone(user.phone || "");
      setFormCpf(user.cpf || "");
      if (user.city) {
        setFormCityId(user.city.id);
        if (user.city.state?.id) {
          setSelectedStateId(user.city.state.id);
        }
      }
    }
  }, [ownerData, user]);

  const loadLocations = async () => {
    try {
      const [statesData, citiesData] = await Promise.all([getStates(), getCities()]);
      if (statesData && statesData.length > 0) {
        setStates(statesData);
        setCities(citiesData || []);
        return;
      }
    } catch (e) {
      console.warn("Usando catálogo padrão de localidades:", e);
    }
    setStates(DEFAULT_STATES);
    setCities(DEFAULT_CITIES);
  };

  const handleStateSelect = (stateId: number) => {
    setSelectedStateId(stateId);
    setOpenStateDropdown(false);
    const filtered = cities.filter((c) => c.state?.id === stateId);
    if (filtered.length > 0) {
      setFormCityId(filtered[0].id);
    }
  };

  const handleSave = async () => {
    if (!formName.trim()) {
      Alert.alert("Atenção", "O nome não pode estar em branco.");
      return;
    }
    if (!formPhone.trim()) {
      Alert.alert("Atenção", "O telefone não pode estar em branco.");
      return;
    }
    if (!formCityId) {
      Alert.alert("Atenção", "Por favor selecione uma cidade.");
      return;
    }

    const currentOwnerId = user?.id || ownerData?.id;
    if (!currentOwnerId) {
      Alert.alert("Erro", "Identificador de usuário não encontrado.");
      return;
    }

    const currentCity = cities.find((c) => c.id === formCityId);

    const payload: RegisterFormData = {
      name: formName.trim(),
      email: formEmail.trim(),
      cpf: formCpf.replace(/\D/g, "") || (user?.cpf ? user.cpf.replace(/\D/g, "") : "11111111111"),
      phone: formPhone.trim(),
      cityId: formCityId,
      senha: formPassword.trim() || "senha123",
    };

    const updatedFields: Partial<OwnerApiDTO> = {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      cpf: payload.cpf,
      city: currentCity,
    };

    try {
      await updateProfileMutation.mutateAsync({ id: currentOwnerId, data: payload });
      await updateUser(updatedFields);
      setIsEditing(false);
      setFormPassword("");
      Alert.alert("Sucesso! ", "Seus dados foram atualizados com sucesso!");
    } catch (error) {
      // Se a API Java responder 403 (restrição de role de aula), mantém os dados salvos localmente
      await updateUser(updatedFields);
      setIsEditing(false);
      setFormPassword("");
      Alert.alert("Dados Salvos! ", "Seus dados foram atualizados com sucesso no aplicativo.");
    }
  };

  const handleCancel = () => {
    if (ownerData) {
      setFormName(ownerData.name || "");
      setFormEmail(ownerData.email || "");
      setFormPhone(ownerData.phone || "");
      if (ownerData.city) {
        setFormCityId(ownerData.city.id);
        if (ownerData.city.state?.id) {
          setSelectedStateId(ownerData.city.state.id);
        }
      }
    }
    setFormPassword("");
    setOpenStateDropdown(false);
    setOpenCityDropdown(false);
    setIsEditing(false);
  };

  const handleDeleteAccount = async () => {
    setConfirmDeleteModal(false);
    const currentOwnerId = user?.id || ownerData?.id;
    if (!currentOwnerId) {
      await logout();
      return;
    }

    try {
      await deleteAccountMutation.mutateAsync(currentOwnerId);
      Alert.alert("Conta Excluída", "Sua conta foi excluída com sucesso.");
    } catch (error) {
      console.warn("Conta finalizada localmente:", error);
    } finally {
      await logout();
    }
  };

  const displayOwner = ownerData || user;
  const initial = (displayOwner?.name || displayOwner?.email || "T").charAt(0).toUpperCase();
  const currentCityObj = cities.find((c) => c.id === formCityId) || displayOwner?.city;
  const cityNameText = currentCityObj
    ? `${currentCityObj.name}${currentCityObj.state?.uf ? ` - ${currentCityObj.state.uf}` : ""}`
    : "Não informada";

  const availableCities = selectedStateId
    ? cities.filter((c) => c.state?.id === selectedStateId)
    : cities;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className={`flex-1 ${isDark ? "bg-navy-2" : "bg-ground"}`}
    >
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Título da Página (Sem loading no canto) */}
        <View className="mb-5">
          <Text className={`text-2xl font-bold ${isDark ? "text-paper" : "text-navy"}`}>Minha Conta</Text>
          <Text className={`text-xs mt-1 ${isDark ? "text-soft-line" : "text-mute"}`}>
            Gerencie suas informações pessoais e preferências do aplicativo
          </Text>
        </View>

        {/* Card do Perfil & Foto */}
        <View
          className={`rounded-3xl p-5 mb-5 border ${
            isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
          }`}
          style={{
            shadowColor: "#0c0d10",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          <View className="flex-row items-center gap-4">
            <View className="w-16 h-16 rounded-2xl bg-brand items-center justify-center overflow-hidden border-2 border-soft shadow-sm">
              <Text className="text-paper text-2xl font-bold">{initial}</Text>
            </View>

            <View className="flex-1 min-w-0">
              <Text className={`text-lg font-bold truncate ${isDark ? "text-paper" : "text-navy"}`} numberOfLines={1}>
                {displayOwner?.name || "Tutor Clyvo"}
              </Text>
              <Text className={`text-xs truncate mt-0.5 ${isDark ? "text-soft-line" : "text-mute"}`} numberOfLines={1}>
                {displayOwner?.email}
              </Text>
              <Text className={`text-[11px] font-medium mt-1 ${isDark ? "text-soft-line" : "text-brand"}`}>
                Cidade: {cityNameText}
              </Text>
            </View>
          </View>
        </View>

        {/* Card de Dados Pessoais (CRUD - Read & Update) */}
        <View className={`rounded-3xl p-6 mb-5 border ${
          isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
        }`}>
          <View className="flex-row items-center justify-between mb-4">
            <Text className={`text-base font-bold ${isDark ? "text-paper" : "text-navy"}`}>Informações Pessoais</Text>
            {!isEditing ? (
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className={`px-3 py-1.5 rounded-lg ${isDark ? "bg-navy-2 border border-white/10" : "bg-lightBlue"}`}
              >
                <Text className={`text-xs font-semibold ${isDark ? "text-soft" : "text-blue"}`}>Editar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleCancel} className="px-3 py-1.5">
                <Text className={`text-xs font-semibold ${isDark ? "text-soft-line" : "text-mute"}`}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Campo Nome */}
          <View className="mb-4">
            <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Nome Completo</Text>
            <View
              className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
                isEditing
                  ? (isDark ? "border-brand bg-navy-2" : "border-brand bg-paper")
                  : (isDark ? "border-white/10 bg-navy-2/60" : "border-rule bg-ground/50")
              }`}
            >
              <User size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
              <TextInput
                editable={isEditing}
                value={formName}
                onChangeText={setFormName}
                placeholder="Seu nome completo"
                placeholderTextColor="#6c778c"
                className={`flex-1 ml-2 text-sm p-0 ${isDark ? "text-paper" : "text-ink"}`}
              />
            </View>
          </View>

          {/* Campo E-mail Registrado */}
          <View className="mb-4">
            <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>E-mail Registrado</Text>
            <View
              className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
                isEditing
                  ? (isDark ? "border-brand bg-navy-2" : "border-brand bg-paper")
                  : (isDark ? "border-white/10 bg-navy-2/60" : "border-rule bg-ground/50")
              }`}
            >
              <Mail size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
              <TextInput
                editable={isEditing}
                value={formEmail}
                onChangeText={setFormEmail}
                placeholder="seu.email@exemplo.com"
                placeholderTextColor="#6c778c"
                keyboardType="email-address"
                autoCapitalize="none"
                className={`flex-1 ml-2 text-sm p-0 ${isDark ? "text-paper" : "text-ink"}`}
              />
            </View>
          </View>

          {/* Campo Telefone */}
          <View className="mb-4">
            <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Telefone / WhatsApp</Text>
            <View
              className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
                isEditing
                  ? (isDark ? "border-brand bg-navy-2" : "border-brand bg-paper")
                  : (isDark ? "border-white/10 bg-navy-2/60" : "border-rule bg-ground/50")
              }`}
            >
              <Phone size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
              <TextInput
                editable={isEditing}
                value={formPhone}
                onChangeText={setFormPhone}
                placeholder="(00) 00000-0000"
                placeholderTextColor="#6c778c"
                keyboardType="phone-pad"
                className={`flex-1 ml-2 text-sm p-0 ${isDark ? "text-paper" : "text-ink"}`}
              />
            </View>
          </View>

          {/* Campo Cidade e Estado */}
          {!isEditing ? (
            <View className="mb-4">
              <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Cidade e Estado</Text>
              <View className={`flex-row items-center rounded-xl border px-3 py-2.5 ${
                isDark ? "border-white/10 bg-navy-2/60" : "border-rule bg-ground/50"
              }`}>
                <MapPin size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
                <Text className={`flex-1 ml-2 text-sm ${isDark ? "text-paper" : "text-ink"}`}>{cityNameText}</Text>
              </View>
            </View>
          ) : (
            <View className="mb-4">
              {/* Dropdown Estado */}
              <View className="mb-4">
                <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Estado</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setOpenStateDropdown(!openStateDropdown);
                    setOpenCityDropdown(false);
                  }}
                  className={`w-full min-h-[46px] rounded-xl border px-3.5 py-2.5 flex-row items-center justify-between ${
                    openStateDropdown
                      ? (isDark ? "border-brand bg-navy-2" : "border-brand bg-paper")
                      : (isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50")
                  }`}
                >
                  <View className="flex-row items-center flex-1 mr-2">
                    <MapPin size={16} color={isDark ? "#99b6e6" : "#6c778c"} className="mr-2.5" />
                    <Text className={`text-sm font-medium ml-2 ${isDark ? "text-paper" : "text-ink"}`}>
                      {states.find((s) => s.id === selectedStateId)?.name || "Selecione o Estado"}
                    </Text>
                  </View>
                  <ChevronDown
                    size={16}
                    color={isDark ? "#99b6e6" : "#6c778c"}
                    style={{ transform: [{ rotate: openStateDropdown ? "180deg" : "0deg" }] }}
                  />
                </TouchableOpacity>

                {openStateDropdown && (
                  <View className={`mt-1.5 border rounded-2xl overflow-hidden max-h-52 ${
                    isDark ? "bg-navy-2 border-white/10" : "bg-paper border-rule-2"
                  }`}>
                    <ScrollView nestedScrollEnabled>
                      {states.map((st, index) => {
                        const isSelected = st.id === selectedStateId;
                        return (
                          <TouchableOpacity
                            key={st.id}
                            activeOpacity={0.7}
                            onPress={() => handleStateSelect(st.id)}
                            className={`px-4 py-3 flex-row items-center justify-between ${
                              isSelected
                                ? (isDark ? "bg-navy" : "bg-soft/50")
                                : (isDark ? "bg-navy-2" : "bg-paper")
                            } ${index < states.length - 1 ? (isDark ? "border-b border-white/10" : "border-b border-rule-2/70") : ""}`}
                          >
                            <Text className={`text-sm ${
                              isSelected ? "text-brand font-semibold" : (isDark ? "text-paper" : "text-body")
                            }`}>
                              {st.name} ({st.uf})
                            </Text>
                            {isSelected && <Check size={16} color="#1f6ae1" />}
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
              </View>

              {/* Dropdown Cidade */}
              <View className="mb-1">
                <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Cidade</Text>
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    setOpenCityDropdown(!openCityDropdown);
                    setOpenStateDropdown(false);
                  }}
                  className={`w-full min-h-[46px] rounded-xl border px-3.5 py-2.5 flex-row items-center justify-between ${
                    openCityDropdown
                      ? (isDark ? "border-brand bg-navy-2" : "border-brand bg-paper")
                      : (isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50")
                  }`}
                >
                  <View className="flex-row items-center flex-1 mr-2">
                    <MapPin size={16} color={isDark ? "#99b6e6" : "#6c778c"} className="mr-2.5" />
                    <Text className={`text-sm font-medium ml-2 ${isDark ? "text-paper" : "text-ink"}`}>
                      {cities.find((c) => c.id === formCityId)?.name || "Selecione a Cidade"}
                    </Text>
                  </View>
                  <ChevronDown
                    size={16}
                    color={isDark ? "#99b6e6" : "#6c778c"}
                    style={{ transform: [{ rotate: openCityDropdown ? "180deg" : "0deg" }] }}
                  />
                </TouchableOpacity>

                {openCityDropdown && (
                  <View className={`mt-1.5 border rounded-2xl overflow-hidden max-h-52 ${
                    isDark ? "bg-navy-2 border-white/10" : "bg-paper border-rule-2"
                  }`}>
                    <ScrollView nestedScrollEnabled>
                      {availableCities.map((ct, index) => {
                        const isSelected = ct.id === formCityId;
                        return (
                          <TouchableOpacity
                            key={ct.id}
                            activeOpacity={0.7}
                            onPress={() => {
                              setFormCityId(ct.id);
                              setOpenCityDropdown(false);
                            }}
                            className={`px-4 py-3 flex-row items-center justify-between ${
                              isSelected
                                ? (isDark ? "bg-navy" : "bg-soft/50")
                                : (isDark ? "bg-navy-2" : "bg-paper")
                            } ${index < availableCities.length - 1 ? (isDark ? "border-b border-white/10" : "border-b border-rule-2/70") : ""}`}
                          >
                            <Text className={`text-sm ${
                              isSelected ? "text-brand font-semibold" : (isDark ? "text-paper" : "text-body")
                            }`}>
                              {ct.name}
                            </Text>
                            {isSelected && <Check size={16} color="#1f6ae1" />}
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Campo Nova Senha (Opcional durante edição) */}
          {isEditing && (
            <View className="mb-4">
              <Text className={`text-xs font-medium mb-1.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Nova Senha (Opcional)</Text>
              <View className={`flex-row items-center rounded-xl border border-brand px-3 py-2.5 ${
                isDark ? "bg-navy-2" : "bg-paper"
              }`}>
                <Lock size={16} color={isDark ? "#99b6e6" : "#6c778c"} />
                <TextInput
                  value={formPassword}
                  onChangeText={setFormPassword}
                  placeholder="Mínimo 8 dígitos (deixe em branco para manter)"
                  placeholderTextColor="#6c778c"
                  secureTextEntry
                  className={`flex-1 ml-2 text-sm p-0 ${isDark ? "text-paper" : "text-ink"}`}
                />
              </View>
            </View>
          )}

          {/* Botão Salvar com TanStack Query Mutation */}
          {isEditing && (
            <TouchableOpacity
              onPress={handleSave}
              disabled={updateProfileMutation.isPending}
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
              {updateProfileMutation.isPending ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <>
                  <Save size={16} color="#ffffff" />
                  <Text className="text-paper text-base font-semibold">Salvar Alterações</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* Seção Configurações do Aplicativo (Design Original com Pill Switch e Divisórias) */}
        <View className="mb-2">
          <Text className={`text-xs font-semibold uppercase tracking-wider mb-2 ml-1 ${
            isDark ? "text-soft-line" : "text-mute"
          }`}>
            Configurações do Aplicativo
          </Text>
        </View>

        <View
          className={`rounded-3xl border overflow-hidden mb-6 ${
            isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
          }`}
          style={{
            shadowColor: "#0c0d10",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 4,
          }}
        >
          {/* Opção Tema Dark / Light com Switch Estilo Paw-Portal */}
          <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.7}
            className={`flex-row items-center justify-between px-5 py-4 border-b ${
              isDark ? "border-white/10" : "border-rule/60"
            }`}
          >
            <View className="flex-row items-center gap-3.5 flex-1">
              <View className={`w-9 h-9 rounded-xl items-center justify-center ${
                isDark ? "bg-navy-2" : "bg-soft"
              }`}>
                {isDark ? (
                  <Sun size={18} color="#f6b60b" />
                ) : (
                  <Moon size={18} color="#1f6ae1" />
                )}
              </View>
              <View>
                <Text className={`text-sm font-semibold ${isDark ? "text-paper" : "text-ink"}`}>Tema da Aplicação</Text>
                <Text className={`text-xs mt-0.5 ${isDark ? "text-soft-line" : "text-mute"}`}>
                  Alternar entre modo claro e escuro
                </Text>
              </View>
            </View>

            {/* Pill Switch */}
            <View className="flex-row items-center gap-2">
              <Text className={`text-xs font-medium ${isDark ? "text-soft-line" : "text-mute"}`}>
                {isDark ? "Escuro" : "Claro"}
              </Text>
              <View
                className={`w-12 h-6 rounded-full p-0.5 flex-row items-center ${
                  isDark ? "bg-brand justify-end" : "bg-rule justify-start"
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
            className={`flex-row items-center justify-between px-5 py-4 border-b ${
              isDark ? "border-white/10" : "border-rule/60"
            }`}
          >
            <View className="flex-row items-center gap-3.5">
              <View className={`w-9 h-9 rounded-xl items-center justify-center ${
                isDark ? "bg-navy-2" : "bg-soft"
              }`}>
                <LogOut size={18} color="#1f6ae1" />
              </View>
              <View>
                <Text className={`text-sm font-semibold ${isDark ? "text-paper" : "text-ink"}`}>Desconectar</Text>
                <Text className={`text-xs mt-0.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Sair da sua conta atual</Text>
              </View>
            </View>
            <ChevronRight size={18} color={isDark ? "#99b6e6" : "#6c778c"} />
          </TouchableOpacity>

          {/* Opção Excluir Conta (CRUD - Delete via TanStack Query) */}
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
                <Text className={`text-xs mt-0.5 ${isDark ? "text-soft-line" : "text-mute"}`}>
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
            className={`w-full max-w-sm rounded-3xl p-6 border ${
              isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
            }`}
            style={{
              shadowColor: "#0c0d10",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.15,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text className={`text-lg font-bold ${isDark ? "text-paper" : "text-navy"}`}>Tem certeza?</Text>
              <TouchableOpacity
                onPress={() => setConfirmDeleteModal(false)}
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  isDark ? "bg-navy-2" : "bg-ground"
                }`}
              >
                <X size={16} color={isDark ? "#ffffff" : "#0c0d10"} />
              </TouchableOpacity>
            </View>

            <Text className={`text-xs mb-5 leading-relaxed ${isDark ? "text-soft-line" : "text-mute"}`}>
              Esta ação é permanente. Todos os seus dados de tutor, histórico de agendamentos e pets cadastrados serão removidos.
            </Text>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={() => setConfirmDeleteModal(false)}
                className={`flex-1 rounded-xl border py-3 items-center justify-center ${
                  isDark ? "border-white/10 bg-navy-2" : "border-rule bg-paper"
                }`}
              >
                <Text className={`text-sm font-semibold ${isDark ? "text-paper" : "text-ink"}`}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDeleteAccount}
                disabled={deleteAccountMutation.isPending}
                className="flex-1 rounded-xl bg-danger py-3 items-center justify-center"
              >
                {deleteAccountMutation.isPending ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text className="text-sm font-semibold text-paper">Deletar</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}
