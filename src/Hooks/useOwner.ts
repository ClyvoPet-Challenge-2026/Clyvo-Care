import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { updateProfile, deleteAccount } from "../Services/owner";
import { getCurrentUser } from "../Services/auth";
import { RegisterFormData } from "../Types/types";
import { queryKeys } from "../Lib/queryKeys";

export function useOwnerProfile(ownerId?: number) {
  return useQuery({
    queryKey: queryKeys.owner.profile(ownerId),
    queryFn: () => {
      if (!ownerId) return Promise.resolve(null);
      return getCurrentUser();
    },
    enabled: !!ownerId,
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RegisterFormData }) =>
      updateProfile(id, data),
    onSuccess: (updatedOwner, variables) => {
      queryClient.setQueryData(queryKeys.owner.profile(variables.id), updatedOwner);
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteAccount(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: queryKeys.owner.profile(id) });
      queryClient.clear();
    },
  });
}
