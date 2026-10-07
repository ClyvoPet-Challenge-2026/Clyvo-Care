import { api } from "./http";
import type { PlanApiDTO, PaymentMethodApiDTO, SubscriptionApiDTO, CreateSubscriptionDTO, SubscriptionSimulationDTO, SpringPage } from "../Types/types";

export async function listPlans(): Promise<PlanApiDTO[]> {
  const { data } = await api.get<PlanApiDTO[]>("/planos");
  return data;
}

export async function listPaymentMethods(): Promise<PaymentMethodApiDTO[]> {
  const { data } = await api.get<PaymentMethodApiDTO[]>("/formas-pagamento");
  return data;
}

// A API filtra pelo subject do JWT. Percorre as páginas para não omitir pets.
export async function listMySubscriptions(): Promise<SubscriptionApiDTO[]> {
  const subscriptions: SubscriptionApiDTO[] = [];
  let page = 0;
  while (true) {
    const { data } = await api.get<SpringPage<SubscriptionApiDTO>>("/contratacoes/minhas", {
      params: { page, size: 100, sort: "id,asc" },
    });
    subscriptions.push(...data.content);
    if (data.last || page + 1 >= data.totalPages) return subscriptions;
    page += 1;
  }
}

export async function simulateSubscription(data: Pick<CreateSubscriptionDTO, "planId" | "paymentMethod">): Promise<SubscriptionSimulationDTO> {
  const response = await api.post<SubscriptionSimulationDTO>("/contratacoes/simulacao", data);
  return response.data;
}

export async function createSubscription(data: CreateSubscriptionDTO): Promise<SubscriptionApiDTO> {
  const response = await api.post<SubscriptionApiDTO>("/contratacoes", data);
  return response.data;
}

export async function cancelSubscription(subscriptionId: number): Promise<SubscriptionApiDTO> {
  const { data } = await api.patch<SubscriptionApiDTO>(`/contratacoes/${subscriptionId}/status`, { status: "INACTIVE" });
  return data;
}
