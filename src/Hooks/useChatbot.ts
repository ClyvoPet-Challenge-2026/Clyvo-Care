import { useRef, useState } from "react";
import { FlatList } from "react-native";
import axios from "axios";
import { useAuth } from "../Context/AuthContext";
import { usePets } from "./usePets";
import { useMySubscriptions, usePlans } from "./usePlans";
import { sendMessageChatbot } from "../Services/chatbot";
import { obtainMandatoryLocation } from "../Services/location";
import type { ChatbotResponse, UserCoordinates } from "../Types/chatbot";

export type ChatMessage = {
  id: string;
  text: string;
  author: "user" | "assistant";
};

const initialMessage: ChatMessage = {
  id: "welcome",
  author: "assistant",
  text: "Olá! Sou a assistente da Clyvo. Posso ajudar a simular um plano ou encontrar uma clínica parceira.",
};

export function useChatbot() {
  const { user } = useAuth();
  const petsQuery = usePets(user?.id);
  const plansQuery = usePlans();
  const subscriptionsQuery = useMySubscriptions(user?.id);

  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [interactionId, setInteractionId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [coordinates, setCoordinates] = useState<UserCoordinates>();
  const [locationLoading, setLocationLoading] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const addMessage = (nextMessage: ChatMessage) => {
    setMessages((current) => [...current, nextMessage]);
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  const requestLocation = async () => {
    setLocationLoading(true);
    setError(undefined);
    try {
      const currentCoordinates = await obtainMandatoryLocation();
      setCoordinates(currentCoordinates);
      return currentCoordinates;
    } catch (locationError) {
      console.error("Erro ao obter localização do tutor:", locationError);
      setError(
        "Permita o acesso à localização para usar o assistente e buscar clínicas próximas.",
      );
      return undefined;
    } finally {
      setLocationLoading(false);
    }
  };

  const open = () => {
    setVisible(true);
    if (!coordinates) void requestLocation();
  };

  const close = () => setVisible(false);

  const sendMessage = async () => {
    const text = message.trim();
    if (!text || loading || locationLoading) return;

    setMessage("");
    setError(undefined);
    addMessage({
      id: `user-${Date.now()}`,
      author: "user",
      text,
    });
    setLoading(true);

    try {
      const currentCoordinates =
        coordinates ?? (await requestLocation());
      if (!currentCoordinates) return;

      const response: ChatbotResponse = await sendMessageChatbot({
        mensagem: text,
        ...(interactionId ? { previous_interaction_id: interactionId } : {}),
        latitude: currentCoordinates.latitude,
        longitude: currentCoordinates.longitude,
        pets: (petsQuery.data ?? []).map((pet) => ({
          id: pet.id,
          nome: pet.name,
          especie: pet.species?.name,
          raca: pet.breed?.name,
          data_nascimento: pet.birthDate,
        })),
        planos: (plansQuery.data ?? []).map((plan) => ({
          id: plan.id,
          nome: plan.name,
          valor_mensal: plan.monthlyValue,
        })),
        contratacoes: (subscriptionsQuery.data ?? []).map((subscription) => ({
          id: subscription.id,
          pet_id: subscription.pet.id,
          plano_id: subscription.plan.id,
          plano_nome: subscription.plan.name,
          status: subscription.status,
          valor_mensal: subscription.contractedValue,
        })),
      });

      setInteractionId(response.interaction_id);
      addMessage({
        id: `assistant-${Date.now()}`,
        author: "assistant",
        text: response.resposta,
      });
    } catch (requestError) {
      console.error("Erro ao enviar mensagem para o chatbot:", requestError);
      const requestDetails = axios.isAxiosError(requestError)
        ? ` [${requestError.code ?? "sem código"}: ${requestError.config?.baseURL ?? "URL desconhecida"}]`
        : "";
      setError(
        axios.isAxiosError(requestError) && requestError.code === "ECONNABORTED"
          ? "A assistente demorou para responder. Aguarde e tente novamente."
          : `Não foi possível conectar à assistente.${requestDetails}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    visible,
    open,
    close,
    message,
    setMessage,
    messages,
    loading,
    error,
    coordinates,
    locationLoading,
    requestLocation,
    sendMessage,
    listRef,
  };
}
