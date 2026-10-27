import { View, Text, TouchableOpacity, Linking, ScrollView, Alert } from "react-native";
import { useClinics } from "../Hooks/useClinics";
import { ChevronRight } from "lucide-react-native";
import { useTheme } from "../Context/ThemeContext";

export function LocationCarrousel() {
  const { isDark } = useTheme();
  const { data: clinics = [], isLoading, error, refetch } = useClinics();
  if (isLoading) return <Text className="text-brand">Carregando clínicas...</Text>;
  if (error) return <TouchableOpacity onPress={() => void refetch()}><Text className="text-brand">Não foi possível carregar as clínicas. Tentar novamente.</Text></TouchableOpacity>;
  if (!clinics.length) return <Text className="text-brand">Nenhuma clínica cadastrada.</Text>;

  return (
    <View className="mt-3 -mx-5">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingLeft: 20,
          paddingRight: 20,
          alignItems: "stretch",
        }}
      >
        {clinics.map((item, index) => {
          const isLast = index === clinics.length - 1;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              onPress={() => {
                const query = encodeURIComponent(`${item.name}, ${item.city.name}, ${item.city.state.name}`);
                void Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${query}`).catch(() => Alert.alert("Mapa indisponível", "Não foi possível abrir o aplicativo de mapas."));
              }}
              className="w-52"
              style={{ marginRight: isLast ? 0 : 14 }}
            >
              <View
                className={`w-full rounded-2xl border overflow-hidden ${
                  isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
                }`}
                style={{
                  shadowColor: "#0c0d10",
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View className="p-3.5 justify-between min-h-[134px]">
                  <View>
                    <Text
                      className={`text-sm font-bold mb-1 ${
                        isDark ? "text-paper" : "text-navy"
                      }`}
                      numberOfLines={1}
                    >
                      {item.name}
                    </Text>
                    <Text
                      className={`text-xs leading-4 ${
                        isDark ? "text-soft-line" : "text-mute"
                      }`}
                      numberOfLines={2}
                    >
                      {item.city.name} — {item.city.state.name}
                    </Text>
                  </View>
                  <View
                    className={`mt-3 items-center justify-center rounded-xl py-2 px-2 flex-row gap-1 border ${
                      isDark
                        ? "bg-navy-2 border-white/10"
                        : "bg-soft border-rule/50"
                    }`}
                  >
                    <Text className="text-brand text-xs font-semibold">
                      Buscar no mapa
                    </Text>
                    <ChevronRight size={14} color="#1f6ae1" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
