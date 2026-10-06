import { View, Text, TouchableOpacity } from "react-native";
import { Moon, Sun, ChevronRight, LogOut, Trash2 } from "lucide-react-native";
import type { ConfigSectionProps } from "../../Types/types";


export function ConfigSection({
  isDark,
  toggleTheme,
  logout,
  onDeleteAccount,
}: ConfigSectionProps) {
  return (
    <>
      <View className="mb-2">
        <Text className={`text-xs font-semibold uppercase tracking-wider mb-2 ml-1 ${
          isDark ? "text-soft-line" : "text-mute"
        }`}>
          Configurações do Aplicativo
        </Text>
      </View>

      <View
        className={`rounded-3xl border overflow-hidden mb-6 ${
          isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
        }`}
        style={{
          shadowColor: "#0c0d10",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        {/* Opção Tema Dark / Light com Switch Estilo Paw-Portal */}
        <TouchableOpacity
          onPress={toggleTheme}
          activeOpacity={0.7}
          className={`flex-row items-center justify-between px-5 py-4 border-b ${
            isDark ? "border-white/10" : "border-rule/60"
          }`}
        >
          <View className="flex-row items-center gap-3.5 flex-1">
            <View className={`w-9 h-9 rounded-xl items-center justify-center ${
              isDark ? "bg-navy-2" : "bg-soft"
            }`}>
              {isDark ? (
                <Sun size={18} color="#f6b60b" />
              ) : (
                <Moon size={18} color="#1f6ae1" />
              )}
            </View>
            <View>
              <Text className={`text-sm font-semibold ${isDark ? "text-paper" : "text-ink"}`}>Tema da Aplicação</Text>
              <Text className={`text-xs mt-0.5 ${isDark ? "text-soft-line" : "text-mute"}`}>
                Alternar entre modo claro e escuro
              </Text>
            </View>
          </View>

          {/* Pill Switch */}
          <View className="flex-row items-center gap-2">
            <Text className={`text-xs font-medium ${isDark ? "text-soft-line" : "text-mute"}`}>
              {isDark ? "Escuro" : "Claro"}
            </Text>
            <View
              className={`w-12 h-6 rounded-full p-0.5 flex-row items-center ${
                isDark ? "bg-brand justify-end" : "bg-rule justify-start"
              }`}
            >
              <View className="w-5 h-5 rounded-full bg-paper shadow-sm" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Opção Encerrar Sessão */}
        <TouchableOpacity
          onPress={logout}
          activeOpacity={0.7}
          className={`flex-row items-center justify-between px-5 py-4 border-b ${
            isDark ? "border-white/10" : "border-rule/60"
          }`}
        >
          <View className="flex-row items-center gap-3.5">
            <View className={`w-9 h-9 rounded-xl items-center justify-center ${
              isDark ? "bg-navy-2" : "bg-soft"
            }`}>
              <LogOut size={18} color="#1f6ae1" />
            </View>
            <View>
              <Text className={`text-sm font-semibold ${isDark ? "text-paper" : "text-ink"}`}>Desconectar</Text>
              <Text className={`text-xs mt-0.5 ${isDark ? "text-soft-line" : "text-mute"}`}>Sair da sua conta atual</Text>
            </View>
          </View>
          <ChevronRight size={18} color={isDark ? "#99b6e6" : "#6c778c"} />
        </TouchableOpacity>

        {/* Opção Excluir Conta (CRUD - Delete via TanStack Query) */}
        <TouchableOpacity
          onPress={onDeleteAccount}
          activeOpacity={0.7}
          className="flex-row items-center justify-between px-5 py-4"
        >
          <View className="flex-row items-center gap-3.5">
            <View className="w-9 h-9 rounded-xl bg-danger/10 items-center justify-center">
              <Trash2 size={18} color="#d32f2f" />
            </View>
            <View>
              <Text className="text-sm font-semibold text-danger">Excluir Conta</Text>
              <Text className={`text-xs mt-0.5 ${isDark ? "text-soft-line" : "text-mute"}`}>
                Remover permanentemente seus dados
              </Text>
            </View>
          </View>
          <ChevronRight size={18} color="#d32f2f" />
        </TouchableOpacity>
      </View>
    </>
  );
}
