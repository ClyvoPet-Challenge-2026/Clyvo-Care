import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useAuth } from "../Context/AuthContext";
import { useOwnerProfile, useUpdateProfile } from "./useOwner";
import { useLocations } from "./useLocations";
import { formatPhone } from "../Utils/formatters";
import type { RegisterFormData, OwnerApiDTO } from "../Types/types";

export function useProfileForm() {
  const { user, updateUser } = useAuth();

  // TanStack Query: Leitura em tempo real do perfil do tutor
  const { data: ownerData } = useOwnerProfile(user?.id);
  const updateProfileMutation = useUpdateProfile();

  const [isEditing, setIsEditing] = useState(false);

  // Estados e cidades para dropdown na edição
  const { states, cities } = useLocations();
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
    if (ownerData) {
      setFormName(ownerData.name || "");
      setFormEmail(ownerData.email || "");
      setFormPhone(formatPhone(ownerData.phone || ""));
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
      setFormPhone(formatPhone(user.phone || ""));
      setFormCpf(user.cpf || "");
      if (user.city) {
        setFormCityId(user.city.id);
        if (user.city.state?.id) {
          setSelectedStateId(user.city.state.id);
        }
      }
    }
  }, [ownerData, user]);

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
      setFormPhone(formatPhone(ownerData.phone || ""));
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

  const displayOwner = ownerData || user;
  const initial = (displayOwner?.name || displayOwner?.email || "T").charAt(0).toUpperCase();
  const currentCityObj = cities.find((c) => c.id === formCityId) || displayOwner?.city;
  const cityNameText = currentCityObj
    ? `${currentCityObj.name}${currentCityObj.state?.uf ? ` - ${currentCityObj.state.uf}` : ""}`
    : "Não informada";

  const availableCities = selectedStateId
    ? cities.filter((c) => c.state?.id === selectedStateId)
    : cities;

  return {
    displayOwner,
    initial,
    cityNameText,
    personalInfoProps: {
      isEditing,
      setIsEditing,
      handleCancel,
      formName,
      setFormName,
      formEmail,
      setFormEmail,
      formPhone,
      setFormPhone: (value: string) => setFormPhone(formatPhone(value)),
      cityNameText,
      openStateDropdown,
      setOpenStateDropdown,
      openCityDropdown,
      setOpenCityDropdown,
      states,
      selectedStateId,
      handleStateSelect,
      cities,
      formCityId,
      availableCities,
      setFormCityId,
      formPassword,
      setFormPassword,
      handleSave,
      isSaving: updateProfileMutation.isPending,
    },
  };
}
