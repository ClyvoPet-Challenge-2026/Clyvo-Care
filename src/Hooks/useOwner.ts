import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, deleteAccount } from "../Services/auth";
import { RegisterFormData, OwnerApiDTO } from "../Types/types";
import { queryKeys } from "../Lib/queryKeys";

export function useOwnerProfile(ownerId?: number) {
  return useQuery({
    queryKey: queryKeys.owner.profile(ownerId),
    queryFn: () => {
      if (!ownerId) return Promise.resolve(null);
      return getProfile(ownerId);
    },
    enabled: !!ownerId,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: RegisterFormData }) =>
      updateProfile(id, data),
    onSuccess: (updatedOwner, variables) => {
      queryClient.setQueryData(queryKeys.owner.profile(variables.id), updatedOwner);
      queryClient.invalidateQueries({ queryKey: queryKeys.owner.profile(variables.id) });
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
