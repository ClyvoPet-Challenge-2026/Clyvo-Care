import { View, Text, TouchableOpacity } from "react-native";
import { AlertCircle, RotateCcw } from "lucide-react-native";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Falha ao carregar dados",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <View className="bg-paper rounded-3xl p-6 border border-rule items-center justify-center my-4 mx-5">
      <View className="w-14 h-14 rounded-full bg-red-50 items-center justify-center mb-3">
        <AlertCircle size={26} color="#ef4444" />
      </View>
      <Text className="text-base font-bold text-navy text-center">{title}</Text>
      <Text className="text-xs text-mute text-center mt-1.5 leading-5 px-3">
        {message}
      </Text>

      {onRetry && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onRetry}
          className="mt-4 bg-brand rounded-2xl py-2.5 px-5 flex-row items-center gap-2"
          style={{
            shadowColor: "#1f6ae1",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <RotateCcw size={15} color="#ffffff" />
          <Text className="text-paper text-xs font-bold uppercase tracking-wider">
            Tentar novamente
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
