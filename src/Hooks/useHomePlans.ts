import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { usePlans } from "./usePlans";
import { getStoredPlanId, saveStoredPlanId } from "../Services/planStorage";
import { ClyvoPlansData } from "../Data/PlansData";
import type { ClyvoPlan, PlanApiDTO, HomePlanItem } from "../Types/types";

export function useHomePlans() {
  const { data: plans = [], isLoading: loadingPlans } = usePlans();

  // Mock / Local State para o Plano Ativo (desvinculado temporariamente da API)
  const [activePlanId, setActivePlanId] = useState<string | null>("comfort");

  useEffect(() => {
    loadStoredPlan();
  }, []);

  const loadStoredPlan = async () => {
    try {
      const stored = await getStoredPlanId();
      if (stored !== null) {
        setActivePlanId(stored || null);
      }
    } catch (e) {
      console.log("Erro ao carregar plano local:", e);
    }
  };

  const handleSelectPlan = async (plan: ClyvoPlan | PlanApiDTO) => {
    const planIdStr = String(plan.id);
    const planName = plan.name;
    const planPrice = "monthlyValue" in plan ? `R$ ${plan.monthlyValue?.toFixed(2)}/mês` : `${plan.price}${plan.period}`;

    Alert.alert(
      "Confirmar Assinatura",
      `Deseja assinar o plano ${planName} (${planPrice})?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            await saveStoredPlanId(planIdStr);
            setActivePlanId(planIdStr);
            Alert.alert("Parabéns!", `Seu pet agora está protegido pelo ${planName}!`);
          },
        },
      ]
    );
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      "Cancelar Assinatura",
      "Deseja realmente cancelar a assinatura deste plano?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, Cancelar",
          style: "destructive",
          onPress: async () => {
            await saveStoredPlanId("");
            setActivePlanId(null);
            Alert.alert("Plano cancelado", "Sua assinatura foi desativada.");
          },
        },
      ]
    );
  };

  // Encontra os detalhes visuais do plano ativo
  const activePlanDetails =
    ClyvoPlansData.find((p) => p.id === activePlanId || p.name.toLowerCase().includes(String(activePlanId).toLowerCase())) ||
    ClyvoPlansData[1]; // Clyvo Basic como fallback padrão visual

  const availablePlans: HomePlanItem[] = plans.map((plan, index) => {
    const planNameLower = plan.name.toLowerCase();
    const planDetails =
      ClyvoPlansData.find(
        (p) =>
          p.name.toLowerCase().includes(planNameLower) ||
          planNameLower.includes(p.id) ||
          p.id.toLowerCase() === planNameLower
      ) || ClyvoPlansData[index % ClyvoPlansData.length];

    const isPopular = planDetails?.popular;
    const tagline = planDetails?.tagline || plan.description;
    const features = planDetails?.features || [
      "Consultas clínicas em horário comercial",
      "Vacinas anuais obrigatórias",
      "Exames laboratoriais básicos",
      "Atendimento emergencial 24h",
    ];
    return { plan, isPopular, tagline, features };
  });

  return {
    activePlanId, activePlanDetails, availablePlans, loadingPlans,
    onSelectPlan: handleSelectPlan,
    onCancelSubscription: handleCancelSubscription,
    onChangePlan: () => setActivePlanId(null),
  };
}
