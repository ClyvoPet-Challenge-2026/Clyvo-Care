import { api } from "./http";
import { PlanApiDTO, PaymentMethodApiDTO, SubscriptionApiDTO, CreateSubscriptionDTO } from "../Types/types";

export async function listPlans(): Promise<PlanApiDTO[]> {
  const response = await api.get<PlanApiDTO[]>("/planos");
  return response.data;
}

export async function listPaymentMethods(): Promise<PaymentMethodApiDTO[]> {
  const response = await api.get<PaymentMethodApiDTO[]>("/formas-pagamento");
  return response.data;
}

export async function listSubscriptionsByPet(petId: number): Promise<SubscriptionApiDTO[]> {
  const response = await api.get<{ content: SubscriptionApiDTO[] } | SubscriptionApiDTO[]>("/contratacoes", {
    params: { petId },
  });
  if ("content" in response.data) {
    return response.data.content;
  }
  return response.data;
}

export async function createSubscription(data: CreateSubscriptionDTO): Promise<SubscriptionApiDTO> {
  const response = await api.post<SubscriptionApiDTO>("/contratacoes", data);
  return response.data;
}

export async function cancelSubscription(subscriptionId: number): Promise<void> {
  await api.delete(`/contratacoes/${subscriptionId}`);
}