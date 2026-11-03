import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Bot, Send, X } from "lucide-react-native";
import { useTheme } from "../Context/ThemeContext";
import { useChatbot } from "../Hooks/useChatbot";

export function ChatbotWidget() {
  const { isDark, colors } = useTheme();
  const {
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
  } = useChatbot();

  return (
    <>
      <Pressable
        accessibilityLabel="Abrir assistente Clyvo"
        accessibilityRole="button"
        onPress={open}
        className="absolute right-5 bottom-6 w-[58px] h-[58px] rounded-full bg-brand items-center justify-center z-50 shadow-lg"
        style={{
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
        }}
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
          edges={["top", "bottom", "left", "right"]}
          className={`flex-1 ${isDark ? "bg-black/65" : "bg-ink/35"}`}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            className="flex-1 justify-end"
          >
            <View
              className={`h-[78%] mx-3 bottom-3 rounded-3xl border overflow-hidden ${
                isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
              }`}
            >
              {/* Header */}
              <View
                className={`flex-row items-center justify-between px-4 py-3.5 border-b ${
                  isDark ? "border-white/10" : "border-rule"
                }`}
              >
                <View className="flex-row items-center gap-2.5">
                  <View className="w-9 h-9 rounded-2xl bg-brand items-center justify-center">
                    <Bot color="#ffffff" size={18} />
                  </View>
                  <View>
                    <Text className={`text-base font-bold ${isDark ? "text-paper" : "text-navy"}`}>
                      Assistente Clyvo
                    </Text>
                    <Text className={`text-[11px] mt-0.5 ${isDark ? "text-soft-line" : "text-mute"}`}>
                      Planos e clínicas parceiras
                    </Text>
                  </View>
                </View>
                <Pressable accessibilityLabel="Fechar assistente" onPress={close}>
                  <X color={isDark ? "#ffffff" : "#0c0d10"} size={22} />
                </Pressable>
              </View>

              {/* Aviso de Localização */}
              {!coordinates && (
                <Pressable
                  accessibilityRole="button"
                  disabled={locationLoading}
                  onPress={() => void requestLocation()}
                  className={`mx-4 mt-3 p-3 rounded-xl border ${
                    isDark ? "border-white/10" : "border-rule"
                  }`}
                >
                  <Text
                    className={`text-xs text-center ${
                      isDark ? "text-paper" : "text-navy"
                    }`}
                  >
                    {locationLoading
                      ? "Solicitando acesso à localização..."
                      : "Permita sua localização para usar o assistente."}
                  </Text>
                </Pressable>
              )}

              {/* Lista de Mensagens */}
              <FlatList
                contentContainerStyle={{ gap: 10, padding: 16 }}
                data={messages}
                keyExtractor={(item) => item.id}
                ref={listRef}
                renderItem={({ item }) => {
                  const isUser = item.author === "user";
                  return (
                    <View
                      className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 ${
                        isUser
                          ? "self-end bg-brand border-0"
                          : `self-start border ${
                              isDark
                                ? "bg-navy-2 border-white/10"
                                : "bg-[#f1f5fb] border-rule"
                            }`
                      }`}
                    >
                      <Text
                        className={`text-sm leading-5 ${
                          isUser ? "text-paper" : isDark ? "text-paper" : "text-navy"
                        }`}
                      >
                        {item.text}
                      </Text>
                    </View>
                  );
                }}
              />

              {/* Loading */}
              {loading && (
                <View className="flex-row items-center gap-2 px-4 pb-2">
                  <ActivityIndicator color={colors.brand} size="small" />
                  <Text className={`text-xs ${isDark ? "text-soft-line" : "text-mute"}`}>
                    Consultando a assistente...
                  </Text>
                </View>
              )}

              {/* Erro */}
              {error && (
                <Text className="text-danger text-xs px-4 pb-2">
                  {error}
                </Text>
              )}

              {/* Composer */}
              <View
                className={`flex-row items-center gap-2 p-3 border-t ${
                  isDark ? "border-white/10" : "border-rule"
                }`}
              >
                <TextInput
                  editable={!loading}
                  onChangeText={setMessage}
                  onSubmitEditing={sendMessage}
                  placeholder="Digite sua mensagem..."
                  placeholderTextColor={colors.textMuted}
                  className={`flex-1 text-sm min-h-[42px] px-3.5 py-2 rounded-full border ${
                    isDark
                      ? "bg-navy-2 text-paper border-white/10"
                      : "bg-[#f7f9fc] text-navy border-rule"
                  }`}
                  value={message}
                />
                <Pressable
                  accessibilityLabel="Enviar mensagem"
                  accessibilityRole="button"
                  disabled={!message.trim() || loading || locationLoading || !coordinates}
                  onPress={sendMessage}
                  className={`w-[42px] h-[42px] rounded-full items-center justify-center ${
                    message.trim() && !loading && !locationLoading && coordinates
                      ? "bg-brand"
                      : isDark
                      ? "bg-white/10"
                      : "bg-rule"
                  }`}
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
