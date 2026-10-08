import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useAuth } from "../Context/AuthContext";
import { useOwnerProfile, useUpdateProfile } from "./useOwner";
import { useLocations } from "./useLocations";
import { formatPhone } from "../Utils/formatters";
import { profileToForm, profileToPayload, validateProfileUpdate } from "../Utils/profileForm";
import type { OwnerApiDTO, ProfileTextField } from "../Types/types";

export function useProfileForm() {
  const { user, updateUser, logout } = useAuth();
  const { data: ownerData } = useOwnerProfile(user?.id);
  const updateMutation = useUpdateProfile();
  const { states, cities } = useLocations({ allowFallback: false });
  const displayOwner = ownerData || user;
  const canManageProfile = user?.roleName === "ADMIN";
  const [isEditing, setIsEditing] = useState(false);
  const [values, setValues] = useState(() => profileToForm(displayOwner));

  useEffect(() => {
    if (!isEditing) setValues(profileToForm(displayOwner));
  }, [displayOwner, isEditing]);

  const updateField = (field: ProfileTextField, value: string) => {
    setValues((current) => ({ ...current, [field]: field === "phone" ? formatPhone(value) : value }));
  };

  const selectState = (stateId: number) => {
    const cityId = cities.find((city) => city.state?.id === stateId)?.id ?? 0;
    setValues((current) => ({ ...current, stateId, cityId }));
  };

  const selectCity = (cityId: number) => setValues((current) => ({ ...current, cityId }));

  const checkPermission = () => {
    if (canManageProfile) return true;
    Alert.alert("Edição indisponível", "A edição de perfil ainda não está disponível para sua conta.");
    return false;
  };

  const startEditing = () => {
    if (checkPermission()) setIsEditing(true);
  };

  const cancel = () => {
    setValues(profileToForm(displayOwner));
    setIsEditing(false);
  };

  const save = async () => {
    if (updateMutation.isPending || !checkPermission()) return;
    const validationError = validateProfileUpdate(values);
    if (validationError) {
      Alert.alert("Atenção", validationError);
      return;
    }
    const ownerId = user?.id || ownerData?.id;
    if (!ownerId) {
      Alert.alert("Erro", "Identificador de usuário não encontrado.");
      return;
    }
    const city = cities.find((item) => item.id === values.cityId) ||
      (ownerData?.city?.id === values.cityId ? ownerData.city : undefined);
    if (!city || city.state?.id !== values.stateId) {
      Alert.alert("Atenção", "Selecione uma cidade válida para o estado informado.");
      return;
    }

    let updatedOwner: OwnerApiDTO;
    try {
      updatedOwner = await updateMutation.mutateAsync({ id: ownerId, data: profileToPayload(values) });
    } catch (error) {
      Alert.alert("Não foi possível salvar", error instanceof Error ? error.message : "Tente novamente. Seus dados não foram confirmados pelo servidor.");
      return;
    }

    setIsEditing(false);
    setValues(profileToForm(updatedOwner));
    // O subject do JWT é o e-mail antigo: é necessário entrar novamente.
    const emailChanged = updatedOwner.email !== user?.email;
    try {
      if (emailChanged) await logout();
      else await updateUser(updatedOwner);
    } catch {
      Alert.alert("Perfil atualizado no servidor", emailChanged
        ? "Seus dados foram salvos, mas não foi possível limpar a sessão salva neste dispositivo. Entre novamente com seu e-mail e senha atualizados."
        : "Seus dados foram salvos, mas não foi possível atualizar a sessão neste dispositivo. Entre novamente para carregar o perfil atualizado.");
      return;
    }
    Alert.alert(emailChanged ? "Perfil atualizado" : "Sucesso!", emailChanged
      ? "Entre novamente com seu e-mail e senha atualizados."
      : "Seus dados foram atualizados com sucesso!");
  };

  const currentCity = cities.find((city) => city.id === values.cityId) || displayOwner?.city;
  const cityNameText = currentCity
    ? `${currentCity.name}${currentCity.state?.uf ? ` - ${currentCity.state.uf}` : ""}`
    : "Não informada";
  const availableCities = values.stateId ? cities.filter((city) => city.state?.id === values.stateId) : cities;
  const initial = (displayOwner?.name || displayOwner?.email || "T").charAt(0).toUpperCase();

  return {
    displayOwner, initial, cityNameText,
    form: { values, updateField, isEditing, isSaving: updateMutation.isPending, startEditing, cancel, save },
    locations: { states, cities: availableCities, stateId: values.stateId, cityId: values.cityId, selectState, selectCity },
  };
}
