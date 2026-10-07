import { useState, useRef, useEffect } from "react";
import { Alert } from "react-native";
import { useAuth } from "../Context/AuthContext";
import { usePets } from "./usePets";
import { usePlans, usePaymentMethods, useMySubscriptions, useSimulateSubscription, useCreateSubscription, useCancelSubscription } from "./usePlans";
import { formatPlanPrice, paymentMethodLabels } from "../Utils/planPresentation";
import type { HomePlansState, HomePlansActions, PaymentMethodApiDTO, PlanApiDTO } from "../Types/types";

export function useHomePlans() {
  const { user } = useAuth();
  const petsQuery = usePets(user?.id);
  const plansQuery = usePlans();
  const paymentsQuery = usePaymentMethods();
  const subscriptionsQuery = useMySubscriptions(user?.id);
  const simulation = useSimulateSubscription();
  const create = useCreateSubscription(user?.id);
  const cancelMutation = useCancelSubscription(user?.id);
  const [petId, setPetId] = useState<number>();
  const [payment, setPayment] = useState<PaymentMethodApiDTO>();
  const [busy, setBusy] = useState(false);
  const locked = useRef(false);
  const mounted = useRef(true);
  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const pets = petsQuery.data ?? [];
  const selectedPet = pets.find((pet) => pet.id === petId) ?? pets[0];
  const paymentMethods = paymentsQuery.data ?? [];
  const paymentMethod = payment && paymentMethods.includes(payment) ? payment : paymentMethods[0];
  const subscription = subscriptionsQuery.data?.find((item) => item.pet.id === selectedPet?.id && item.status === "ACTIVE");
  const queries = [petsQuery, plansQuery, paymentsQuery, subscriptionsQuery];
  const failed = queries.find((query) => query.isError);
  const error = failed ? (failed.error instanceof Error ? failed.error.message : "Não foi possível carregar seus planos.") : null;
  const loading = queries.some((query) => query.isPending);
  const canCancel = user?.roleName === "ADMIN";

  const release = () => {
    locked.current = false;
    if (mounted.current) setBusy(false);
  };
  const retry = () => { queries.forEach((query) => { void query.refetch(); }); };
  const showError = (cause: unknown) => {
    if (mounted.current) Alert.alert("Operação não concluída", cause instanceof Error ? cause.message : "Tente novamente.");
    // Reconcilia também conflitos: outra sessão pode ter contratado/cancelado.
    if (mounted.current) void subscriptionsQuery.refetch();
  };

  const subscribe = async (plan: PlanApiDTO) => {
    if (locked.current || loading || error || subscription || !selectedPet || !paymentMethod) return;
    locked.current = true;
    setBusy(true);
    const request = { petId: selectedPet.id, planId: plan.id, paymentMethod };
    try {
      const price = await simulation.mutateAsync({ planId: plan.id, paymentMethod });
      if (!mounted.current) return release();
      let submitted = false;
      Alert.alert(
        "Confirmar contratação",
        `${selectedPet.name} • ${plan.name}\n${paymentMethodLabels[paymentMethod]}\nValor base: ${formatPlanPrice(price.baseValue)}\nDesconto: ${formatPlanPrice(price.discountAmount)}\nValor contratado: ${formatPlanPrice(price.finalValue)}/mês`,
        [
          { text: "Voltar", style: "cancel", onPress: release },
          { text: "Contratar", onPress: async () => {
            if (!mounted.current) return release();
            if (submitted) return;
            submitted = true;
            try {
              const result = await create.mutateAsync(request);
              if (mounted.current) Alert.alert("Plano contratado", `${result.plan.name} contratado para ${result.pet.name} por ${formatPlanPrice(result.contractedValue)}/mês.`);
            } catch (cause) { showError(cause); }
            finally { release(); }
          } },
        ],
        { cancelable: false },
      );
    } catch (cause) {
      showError(cause);
      release();
    }
  };

  const cancel = () => {
    if (locked.current || loading || error || !subscription || !canCancel) return;
    locked.current = true;
    setBusy(true);
    let submitted = false;
    Alert.alert("Cancelar assinatura", `Deseja cancelar ${subscription.plan.name} de ${subscription.pet.name}?`, [
      { text: "Manter plano", style: "cancel", onPress: release },
      { text: "Cancelar assinatura", style: "destructive", onPress: async () => {
        if (!mounted.current) return release();
        if (submitted) return;
        submitted = true;
        try {
          await cancelMutation.mutateAsync(subscription.id);
          if (mounted.current) Alert.alert("Plano cancelado", "O cancelamento foi confirmado pelo servidor.");
        } catch (cause) { showError(cause); }
        finally { release(); }
      } },
    ], { cancelable: false });
  };

  const state: HomePlansState = {
    pets, selectedPet, paymentMethods, paymentMethod, plans: plansQuery.data ?? [],
    subscription, loading, error, busy, canCancel,
  };
  const actions: HomePlansActions = {
    selectPet: (id) => { if (!locked.current) setPetId(id); },
    selectPayment: (method) => { if (!locked.current) setPayment(method); },
    subscribe, cancel, retry,
  };
  return { state, actions };
}
