import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../Context/AuthContext";
import { useDeleteAccount } from "./useOwner";

export function useAccountActions(ownerId?: number) {
  const { logout, user } = useAuth();
  const deleteAccountMutation = useDeleteAccount();
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteAccountMutation.isPending) return;
    if (user?.roleName !== "ADMIN") {
      Alert.alert("Exclusão indisponível", "A exclusão de conta ainda não está disponível para sua conta.");
      return;
    }
    setConfirmDeleteModal(false);
    const currentOwnerId = ownerId;
    if (!currentOwnerId) {
      Alert.alert("Erro", "Não foi possível identificar sua conta. Entre novamente.");
      return;
    }

    try {
      await deleteAccountMutation.mutateAsync(currentOwnerId);
      await logout();
      Alert.alert("Conta Excluída", "Sua conta foi excluída com sucesso.");
    } catch (error) {
      Alert.alert("Não foi possível excluir", error instanceof Error ? error.message : "Tente novamente. A exclusão não foi confirmada pelo servidor.");
    }
  };

  return {
    logout,
    confirmDeleteModal,
    openDeleteModal: () => {
      if (user?.roleName !== "ADMIN") {
        Alert.alert("Exclusão indisponível", "A exclusão de conta ainda não está disponível para sua conta.");
        return;
      }
      setConfirmDeleteModal(true);
    },
    closeDeleteModal: () => setConfirmDeleteModal(false),
    handleDeleteAccount,
    isDeleting: deleteAccountMutation.isPending,
  };
}
