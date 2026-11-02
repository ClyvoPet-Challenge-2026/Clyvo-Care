import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../Context/AuthContext";
import { useDeleteAccount } from "./useOwner";

export function useAccountActions(ownerId?: number) {
  const { logout } = useAuth();
  const deleteAccountMutation = useDeleteAccount();
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteAccountMutation.isPending) return;
    setConfirmDeleteModal(false);
    const currentOwnerId = ownerId;
    if (!currentOwnerId) {
      Alert.alert("Erro", "Não foi possível identificar sua conta. Entre novamente.");
      return;
    }

    try {
      await deleteAccountMutation.mutateAsync(currentOwnerId);
    } catch (error) {
      Alert.alert("Não foi possível desativar", error instanceof Error ? error.message : "Tente novamente. A desativação não foi confirmada pelo servidor.");
      return;
    }

    try {
      await logout();
    } catch {
      Alert.alert("Conta desativada", "O servidor confirmou a desativação, mas não foi possível limpar a sessão salva neste dispositivo.");
      return;
    }
    Alert.alert("Conta desativada", "Sua conta foi desativada com sucesso.");
  };

  return {
    logout,
    confirmDeleteModal,
    openDeleteModal: () => setConfirmDeleteModal(true),
    closeDeleteModal: () => setConfirmDeleteModal(false),
    handleDeleteAccount,
    isDeleting: deleteAccountMutation.isPending,
  };
}
