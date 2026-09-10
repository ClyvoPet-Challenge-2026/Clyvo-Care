import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listPlans,
  listPaymentMethods,
  listSubscriptionsByPet,
  createSubscription,
  cancelSubscription,
} from "../Services/plans";
import { CreateSubscriptionDTO } from "../Types/types";
import { queryKeys } from "../Lib/queryKeys";

export function usePlans() {
  return useQuery({
    queryKey: queryKeys.plans.list(),
    queryFn: () => listPlans(),
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
}

export function usePaymentMethods() {
  return useQuery({
    queryKey: queryKeys.plans.paymentMethods,
    queryFn: () => listPaymentMethods(),
    staleTime: 1000 * 60 * 10,
  });
}

export function usePetSubscriptions(petId?: number) {
  return useQuery({
    queryKey: queryKeys.plans.subscriptions(petId),
    queryFn: () => {
      if (!petId) return Promise.resolve([]);
      return listSubscriptionsByPet(petId);
    },
    enabled: !!petId,
  });
}

export function useCreateSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSubscriptionDTO) => createSubscription(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.subscriptions(variables.petId) });
    },
  });
}

export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (subscriptionId: number) => cancelSubscription(subscriptionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.plans.all });
    },
  });
}
