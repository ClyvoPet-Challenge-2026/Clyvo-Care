import { View, Text, TouchableOpacity, Modal, ActivityIndicator } from "react-native";
import { X } from "lucide-react-native";
import type { DeleteModalProps } from "../../Types/types";


export function DeleteModal({
  isDark,
  visible,
  onClose,
  onConfirm,
  isDeleting,
}: DeleteModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/60 items-center justify-center p-5">
        <View
          className={`w-full max-w-sm rounded-3xl p-6 border ${
            isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
          }`}
          style={{
            shadowColor: "#0c0d10",
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.15,
            shadowRadius: 16,
            elevation: 8,
          }}
        >
          <View className="flex-row items-center justify-between mb-3">
            <Text className={`text-lg font-bold ${isDark ? "text-paper" : "text-navy"}`}>Tem certeza?</Text>
            <TouchableOpacity
              onPress={onClose}
              className={`w-8 h-8 rounded-full items-center justify-center ${
                isDark ? "bg-navy-2" : "bg-ground"
              }`}
            >
              <X size={16} color={isDark ? "#ffffff" : "#0c0d10"} />
            </TouchableOpacity>
          </View>

          <Text className={`text-xs mb-5 leading-relaxed ${isDark ? "text-soft-line" : "text-mute"}`}>
            Esta ação é permanente. Todos os seus dados de tutor, histórico de agendamentos e pets cadastrados serão removidos.
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={onClose}
              className={`flex-1 rounded-xl border py-3 items-center justify-center ${
                isDark ? "border-white/10 bg-navy-2" : "border-rule bg-paper"
              }`}
            >
              <Text className={`text-sm font-semibold ${isDark ? "text-paper" : "text-ink"}`}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onConfirm}
              disabled={isDeleting}
              className="flex-1 rounded-xl bg-danger py-3 items-center justify-center"
            >
              {isDeleting ? (
                <ActivityIndicator size="small" color="#ffffff" />
              ) : (
                <Text className="text-sm font-semibold text-paper">Deletar</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
