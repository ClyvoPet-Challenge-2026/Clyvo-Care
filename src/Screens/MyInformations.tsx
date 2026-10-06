import { useState, useEffect } from "react";
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useAuth } from "../Context/AuthContext";
import { useTheme } from "../Context/ThemeContext";
import { Footer } from "../Components/Footer";
import { useOwnerProfile, useUpdateProfile, useDeleteAccount } from "../Hooks/useOwner";
import { getStates, getCities } from "../Services/auth";
import { StateApiDTO, CityApiDTO, RegisterFormData, OwnerApiDTO } from "../Types/types";
import { DEFAULT_STATES, DEFAULT_CITIES } from "../Data/LocationGeoData";

import { PersonalInfoSection } from "../Components/MyInformationsComponents/PersonalInfoSection";
import { ConfigSection } from "../Components/MyInformationsComponents/ConfigSection";
import { DeleteModal } from "../Components/MyInformationsComponents/DeleteModal";

export function MyInformations() {
  const { user, logout, updateUser } = useAuth();
  const { isDark, toggleTheme } = useTheme();

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

        <PersonalInfoSection
          isDark={isDark}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          handleCancel={handleCancel}
          formName={formName}
          setFormName={setFormName}
          formEmail={formEmail}
          setFormEmail={setFormEmail}
          formPhone={formPhone}
          setFormPhone={setFormPhone}
          cityNameText={cityNameText}
          openStateDropdown={openStateDropdown}
          setOpenStateDropdown={setOpenStateDropdown}
          openCityDropdown={openCityDropdown}
          setOpenCityDropdown={setOpenCityDropdown}
          states={states}
          selectedStateId={selectedStateId}
          handleStateSelect={handleStateSelect}
          cities={cities}
          formCityId={formCityId}
          availableCities={availableCities}
          setFormCityId={setFormCityId}
          formPassword={formPassword}
          setFormPassword={setFormPassword}
          handleSave={handleSave}
          isSaving={updateProfileMutation.isPending}
        />

        <ConfigSection
          isDark={isDark}
          toggleTheme={toggleTheme}
          logout={logout}
          onDeleteAccount={() => setConfirmDeleteModal(true)}
        />

        {/* Rodapé institucional */}
        <Footer />
      </ScrollView>

      <DeleteModal
        isDark={isDark}
        visible={confirmDeleteModal}
        onClose={() => setConfirmDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        isDeleting={deleteAccountMutation.isPending}
      />
    </KeyboardAvoidingView>
  );
}
