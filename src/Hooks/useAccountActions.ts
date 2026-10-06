import { useState } from "react";
import { Alert } from "react-native";
import { useAuth } from "../Context/AuthContext";
import { useDeleteAccount } from "./useOwner";

export function useAccountActions(ownerId?: number) {
  const { logout } = useAuth();
  const deleteAccountMutation = useDeleteAccount();
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);

  const handleDeleteAccount = async () => {
    setConfirmDeleteModal(false);
    const currentOwnerId = ownerId;
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

  return {
    logout,
    confirmDeleteModal,
    openDeleteModal: () => setConfirmDeleteModal(true),
    closeDeleteModal: () => setConfirmDeleteModal(false),
    handleDeleteAccount,
    isDeleting: deleteAccountMutation.isPending,
  };
}
