import { View, Text, TextInput } from "react-native";
import { FileText } from "lucide-react-native";
import { useTheme } from "../../Context/ThemeContext";
import type { AppointmentNotesProps } from "../../Types/types";

export function AppointmentNotes({ notes, setNotes }: AppointmentNotesProps) {
  const { isDark } = useTheme();
  return (
    <View className={`rounded-3xl p-5 mb-6 border ${
      isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
    }`}>
      <View className="flex-row items-center gap-2 mb-1">
        <FileText size={18} color="#1f6ae1" />
        <Text className={`text-base font-bold ${isDark ? "text-paper" : "text-navy"}`}>
          Observações (Opcional)
        </Text>
      </View>
      <Text className={`text-xs mb-3 ${isDark ? "text-soft-line" : "text-mute"}`}>
        Algum sintoma, histórico alérgico ou aviso prévio para o veterinário?
      </Text>

      <View className={`rounded-2xl border p-3 ${
        isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50"
      }`}>
        <TextInput
          placeholder="Ex: O pet está tossindo desde ontem à noite, ou necessita de focinheira para exames..."
          placeholderTextColor="#6c778c"
          multiline
          numberOfLines={3}
          textAlignVertical="top"
          className={`text-sm min-h-[70px] p-0 ${isDark ? "text-paper" : "text-ink"}`}
          value={notes}
          onChangeText={setNotes}
        />
      </View>
    </View>
  );
}
