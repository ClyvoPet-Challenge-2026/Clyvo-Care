import type { PaymentMethodApiDTO } from "../Types/types";

export const paymentMethodLabels: Record<PaymentMethodApiDTO, string> = {
  CREDIT_CARD: "Cartão de crédito",
  DEBIT_CARD: "Cartão de débito",
  BOLETO: "Boleto",
  PIX: "Pix",
};

export function formatPlanPrice(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}
