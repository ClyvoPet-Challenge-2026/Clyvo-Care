import axios from "axios";
import { env } from "../Config/env";

export type ChatbotPetContext = {
  id: number;
  nome: string;
  especie?: string;
  raca?: string;
  data_nascimento?: string;
};

export type ChatbotPlanContext = {
  id: number;
  nome: string;
  valor_mensal: number;
};

export type ChatbotSubscriptionContext = {
  id: number;
  pet_id: number;
  plano_id: number;
  plano_nome: string;
  status: string;
  valor_mensal: number;
};

export type ChatbotRequest = {
  mensagem: string;
  previous_interaction_id?: string;
  latitude?: number;
  longitude?: number;
  pets?: ChatbotPetContext[];
  planos?: ChatbotPlanContext[];
  contratacoes?: ChatbotSubscriptionContext[];
};

export type ChatbotResponse = {
  resposta: string;
  interaction_id: string;
  contratacao_id?: string | null;
  contratacao?: {
    nome_tutor: string;
    nome_pet: string;
    especie: "cao" | "gato";
    idade_pet: number;
    tem_doenca_cronica: boolean;
    plano_escolhido: string;
    valor_mensal: number;
  } | null;
};

const chatbotApi = axios.create({
  baseURL: env.chatbotApiUrl,
  timeout: 120000,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function enviarMensagemChatbot(
  payload: ChatbotRequest,
): Promise<ChatbotResponse> {
  const { data } = await chatbotApi.post<ChatbotResponse>("/chat", payload);
  if (!data?.resposta || !data?.interaction_id) {
    throw new Error("A API retornou uma resposta inválida.");
  }
  return data;
}
