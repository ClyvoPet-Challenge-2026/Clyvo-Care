import { useRef, useState } from "react";
import axios from "axios";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Bot, Send, X } from "lucide-react-native";
import { useTheme } from "../Context/ThemeContext";
import { useAuth } from "../Context/AuthContext";
import { usePets } from "../Hooks/usePets";
import { useMySubscriptions, usePlans } from "../Hooks/usePlans";
import {
  enviarMensagemChatbot,
  type ChatbotResponse,
} from "../Services/chatbot";
import {
  obterLocalizacaoObrigatoria,
  type UserCoordinates,
} from "../Services/location";

type Message = {
  id: string;
  text: string;
  author: "user" | "assistant";
};

const initialMessage: Message = {
  id: "welcome",
  author: "assistant",
  text: "Olá! Sou a assistente da Clyvo. Posso ajudar a simular um plano ou encontrar uma clínica parceira.",
};

export function ChatbotWidget() {
  const { isDark, colors } = useTheme();
  const { user } = useAuth();
  const petsQuery = usePets(user?.id);
  const plansQuery = usePlans();
  const subscriptionsQuery = useMySubscriptions(user?.id);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [interactionId, setInteractionId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [coordinates, setCoordinates] = useState<UserCoordinates>();
  const [locationLoading, setLocationLoading] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  const addMessage = (nextMessage: Message) => {
    setMessages((current) => [...current, nextMessage]);
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
  };

  const requestLocation = async () => {
    setLocationLoading(true);
    setError(undefined);
    try {
      const currentCoordinates = await obterLocalizacaoObrigatoria();
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

      const response: ChatbotResponse = await enviarMensagemChatbot({
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

  const close = () => setVisible(false);

  return (
    <>
      <Pressable
        accessibilityLabel="Abrir assistente Clyvo"
        accessibilityRole="button"
        onPress={open}
        style={[styles.floatingButton, { backgroundColor: colors.brand }]}
      >
        <Bot color="#ffffff" size={24} />
      </Pressable>

      <Modal
        animationType="slide"
        onRequestClose={close}
        transparent
        visible={visible}
      >
        <SafeAreaView
          style={[
            styles.modalBackdrop,
            { backgroundColor: isDark ? "rgba(0,0,0,0.65)" : "rgba(12,13,16,0.35)" },
          ]}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardView}
          >
            <View
              style={[
                styles.chat,
                { backgroundColor: colors.card, borderColor: colors.border },
              ]}
            >
              <View style={[styles.header, { borderBottomColor: colors.border }]}>
                <View style={styles.titleContainer}>
                  <View style={[styles.botIcon, { backgroundColor: colors.brand }]}>
                    <Bot color="#ffffff" size={18} />
                  </View>
                  <View>
                    <Text style={[styles.title, { color: colors.text }]}>
                      Assistente Clyvo
                    </Text>
                    <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                      Planos e clínicas parceiras
                    </Text>
                  </View>
                </View>
                <Pressable accessibilityLabel="Fechar assistente" onPress={close}>
                  <X color={colors.text} size={22} />
                </Pressable>
              </View>

              {!coordinates && (
                <Pressable
                  accessibilityRole="button"
                  disabled={locationLoading}
                  onPress={() => void requestLocation()}
                  style={[styles.locationNotice, { borderColor: colors.border }]}
                >
                  <Text style={[styles.locationNoticeText, { color: colors.text }]}>
                    {locationLoading
                      ? "Solicitando acesso à localização..."
                      : "Permita sua localização para usar o assistente."}
                  </Text>
                </Pressable>
              )}

              <FlatList
                contentContainerStyle={styles.messages}
                data={messages}
                keyExtractor={(item) => item.id}
                ref={listRef}
                renderItem={({ item }) => (
                  <View
                    style={[
                      styles.bubble,
                      item.author === "user"
                        ? [styles.userBubble, { backgroundColor: colors.brand }]
                        : [
                            styles.assistantBubble,
                            {
                              backgroundColor: isDark ? colors.background : "#f1f5fb",
                              borderColor: colors.border,
                            },
                          ],
                    ]}
                  >
                    <Text
                      style={[
                        styles.bubbleText,
                        {
                          color:
                            item.author === "user" ? "#ffffff" : colors.text,
                        },
                      ]}
                    >
                      {item.text}
                    </Text>
                  </View>
                )}
              />

              {loading && (
                <View style={styles.loading}>
                  <ActivityIndicator color={colors.brand} size="small" />
                  <Text style={[styles.loadingText, { color: colors.textMuted }]}>
                    Consultando a assistente...
                  </Text>
                </View>
              )}
              {error && <Text style={styles.error}>{error}</Text>}

              <View style={[styles.composer, { borderTopColor: colors.border }]}>
                <TextInput
                  editable={!loading}
                  onChangeText={setMessage}
                  onSubmitEditing={sendMessage}
                  placeholder="Digite sua mensagem..."
                  placeholderTextColor={colors.textMuted}
                  style={[
                    styles.input,
                    {
                      backgroundColor: isDark ? colors.background : "#f7f9fc",
                      color: colors.text,
                      borderColor: colors.border,
                    },
                  ]}
                  value={message}
                />
                <Pressable
                  accessibilityLabel="Enviar mensagem"
                  accessibilityRole="button"
                  disabled={!message.trim() || loading || locationLoading || !coordinates}
                  onPress={sendMessage}
                  style={[
                    styles.sendButton,
                    {
                      backgroundColor:
                        message.trim() && !loading ? colors.brand : colors.border,
                    },
                  ]}
                >
                  <Send color="#ffffff" size={18} />
                </Pressable>
              </View>
            </View>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  floatingButton: {
    alignItems: "center",
    borderRadius: 30,
    bottom: 24,
    elevation: 8,
    height: 58,
    justifyContent: "center",
    position: "absolute",
    right: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    width: 58,
    zIndex: 100,
  },
  modalBackdrop: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
    justifyContent: "flex-end",
  },
  chat: {
    borderRadius: 24,
    borderWidth: 1,
    bottom: 12,
    height: "78%",
    marginHorizontal: 12,
    overflow: "hidden",
  },
  header: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  titleContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
  },
  botIcon: {
    alignItems: "center",
    borderRadius: 18,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  locationNotice: {
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
  },
  locationNoticeText: {
    fontSize: 12,
    textAlign: "center",
  },
  messages: {
    gap: 10,
    padding: 16,
  },
  bubble: {
    borderRadius: 16,
    borderWidth: 1,
    maxWidth: "86%",
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  userBubble: {
    alignSelf: "flex-end",
    borderWidth: 0,
  },
  assistantBubble: {
    alignSelf: "flex-start",
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  loading: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  loadingText: {
    fontSize: 12,
  },
  error: {
    color: "#c62828",
    fontSize: 12,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  composer: {
    alignItems: "center",
    borderTopWidth: 1,
    flexDirection: "row",
    gap: 8,
    padding: 12,
  },
  input: {
    borderRadius: 20,
    borderWidth: 1,
    flex: 1,
    fontSize: 14,
    minHeight: 42,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  sendButton: {
    alignItems: "center",
    borderRadius: 21,
    height: 42,
    justifyContent: "center",
    width: 42,
  },
});
