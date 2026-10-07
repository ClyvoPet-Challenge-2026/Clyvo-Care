import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { listPlans, listPaymentMethods, listMySubscriptions, simulateSubscription, createSubscription, cancelSubscription } from "../Services/plans";
import type { SubscriptionApiDTO } from "../Types/types";
import { queryKeys } from "../Lib/queryKeys";

export function usePlans() {
  return useQuery({ queryKey: queryKeys.plans.list(), queryFn: listPlans, staleTime: 1000 * 60 * 10 });
}

export function usePaymentMethods() {
  return useQuery({ queryKey: queryKeys.plans.paymentMethods, queryFn: listPaymentMethods, staleTime: 1000 * 60 * 10 });
}

export function useMySubscriptions(ownerId?: number) {
  return useQuery({
    queryKey: queryKeys.plans.subscriptions(ownerId),
    queryFn: listMySubscriptions,
    enabled: !!ownerId,
  });
}

export function useSimulateSubscription() {
  return useMutation({ mutationFn: simulateSubscription });
}

function useSubscriptionCache(ownerId?: number) {
  const queryClient = useQueryClient();
  const key = queryKeys.plans.subscriptions(ownerId);
  return async (subscription: SubscriptionApiDTO) => {
    // O logout remove o cache; uma resposta tardia não deve recriá-lo.
    if (!queryClient.getQueryState(key)) return;
    await queryClient.cancelQueries({ queryKey: key });
    if (!queryClient.getQueryState(key)) return;
    queryClient.setQueryData<SubscriptionApiDTO[]>(key, (current = []) => {
      const others = current.filter((item) => item.id !== subscription.id);
      return subscription.status === "ACTIVE" ? [...others, subscription] : others;
    });
    void queryClient.invalidateQueries({ queryKey: key });
  };
}

export function useCreateSubscription(ownerId?: number) {
  const updateCache = useSubscriptionCache(ownerId);
  return useMutation({ mutationFn: createSubscription, onSuccess: updateCache });
}

export function useCancelSubscription(ownerId?: number) {
  const updateCache = useSubscriptionCache(ownerId);
  return useMutation({ mutationFn: cancelSubscription, onSuccess: updateCache });
}
