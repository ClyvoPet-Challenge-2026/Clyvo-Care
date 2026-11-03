import { ChatbotRequest, ChatbotResponse } from "../Types/chatbot";
import { chatbotApi } from "./http";

export async function sendMessageChatbot(
  payload: ChatbotRequest,
): Promise<ChatbotResponse> {
  const { data } = await chatbotApi.post<ChatbotResponse>("/chat", payload);
  if (!data?.resposta || !data?.interaction_id) {
    throw new Error("A API retornou uma resposta inválida.");
  }
  return data;
}
