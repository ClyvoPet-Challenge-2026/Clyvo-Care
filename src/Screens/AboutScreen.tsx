import { useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Heart, PawPrint, Users, Info, GitCommitHorizontal, Tag } from "lucide-react-native";
import { Footer } from "../Components/Footer";
import { appInfo } from "../Data/AppInfo";
import { useTheme } from "../Context/ThemeContext";
import type { AboutScreenProps } from "../Types/types";

export function AboutScreen({ navigation }: AboutScreenProps) {
  const { isDark } = useTheme();
  const [avatarStates, setAvatarStates] = useState<Record<string, "loaded" | "error">>({});
  const titleClass = isDark ? "text-paper" : "text-navy";
  const bodyClass = isDark ? "text-soft-line" : "text-body";
  const accentClass = isDark ? "text-soft-line" : "text-brand";
  const accentColor = isDark ? "#99b6e6" : "#1f6ae1";
  const dividerClass = isDark ? "border-white/10" : "border-rule/70";
  const iconBoxClass = `w-10 h-10 rounded-2xl items-center justify-center ${
    isDark ? "bg-navy-2" : "bg-soft"
  }`;
  const cardClass = `rounded-3xl border p-5 mb-5 ${
    isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
  }`;

  return (
    <SafeAreaView edges={["bottom", "left", "right"]} className={`flex-1 ${isDark ? "bg-navy-2" : "bg-ground"}`}>
      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        <View className={`px-6 pt-3 pb-8 rounded-b-[36px] ${
          isDark ? "bg-navy border-b border-white/10" : "bg-brand"
        }`}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Voltar à tela anterior"
            onPress={() => navigation.canGoBack() ? navigation.goBack() : navigation.navigate("MainScreen")}
            className="self-start flex-row items-center gap-2 min-h-12 mb-4"
          >
            <ArrowLeft size={20} color="#ffffff" />
            <Text className="text-paper text-sm font-medium">Voltar</Text>
          </TouchableOpacity>

          <View className="self-start rounded-full bg-paper/15 px-3 py-1.5 mb-4">
            <Text accessibilityRole="header" className="text-paper text-xs font-semibold uppercase tracking-wider">
              Sobre o App
            </Text>
          </View>
          <View className="flex-row items-center gap-4">
            <View className="w-16 h-16 rounded-2xl bg-paper/15 border border-paper/20 items-center justify-center">
              <PawPrint size={32} color="#ffffff" />
            </View>
            <View className="flex-1">
              <Text className="text-paper text-3xl font-bold tracking-tight">{appInfo.name}</Text>
              <Text className="text-soft text-sm leading-5 mt-2">Cuidado e bem-estar para o seu pet</Text>
            </View>
          </View>
        </View>

        <View className="px-5 pt-6">
          <View className={cardClass}>
            <View className="flex-row items-center gap-3 mb-4">
              <View className={iconBoxClass}>
                <Heart size={20} color={accentColor} />
              </View>
              <Text accessibilityRole="header" className={`flex-1 text-lg font-bold ${titleClass}`}>Nossa proposta</Text>
            </View>
            <Text className={`text-sm leading-6 ${bodyClass}`}>{appInfo.purpose}</Text>
          </View>

          <View className={cardClass}>
            <View className="flex-row items-center gap-3 mb-2">
              <View className={iconBoxClass}>
                <Users size={20} color={accentColor} />
              </View>
              <View className="flex-1">
                <Text accessibilityRole="header" className={`text-lg font-bold ${titleClass}`}>Nossa equipe</Text>
                <Text className={`text-xs mt-1 ${bodyClass}`}>Challenge 2026</Text>
              </View>
            </View>
            {appInfo.team.map((member, index) => {
              const nameParts = member.name.trim().split(/\s+/);
              const initials = `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;

              const avatarUrl = member.avatarUrl.trim();
              const avatarState = avatarStates[avatarUrl];

              return (
                <View key={member.rm} className={`flex-row items-center gap-3 py-4 ${
                  index < appInfo.team.length - 1 ? `border-b ${dividerClass}` : ""
                }`}>
                  <View accessible={false} className={`w-11 h-11 rounded-full overflow-hidden items-center justify-center ${
                    isDark ? "bg-navy-2 border border-white/10" : "bg-soft"
                  }`}>
                    <Text className={`text-sm font-bold ${accentClass}`}>{initials}</Text>
                    {avatarUrl && avatarState !== "error" ? (
                      <Image
                        key={avatarUrl}
                        accessible={false}
                        source={{ uri: avatarUrl }}
                        resizeMode="cover"
                        style={{ position: "absolute", width: "100%", height: "100%", opacity: avatarState === "loaded" ? 1 : 0 }}
                        onLoad={() => setAvatarStates((current) => ({ ...current, [avatarUrl]: "loaded" }))}
                        onError={() => setAvatarStates((current) => ({ ...current, [avatarUrl]: "error" }))}
                      />
                    ) : null}
                  </View>
                  <View className="flex-1">
                    <Text className={`text-sm font-semibold ${titleClass}`}>{member.name}</Text>
                    <Text className={`text-xs mt-1 ${bodyClass}`}>RM {member.rm}</Text>
                  </View>
                </View>
              );
            })}
          </View>

          <View className={cardClass}>
            <View className="flex-row items-center gap-3 mb-4">
              <View className={iconBoxClass}>
                <Info size={20} color={accentColor} />
              </View>
              <Text accessibilityRole="header" className={`flex-1 text-lg font-bold ${titleClass}`}>Versão do aplicativo</Text>
            </View>
            <View className={`flex-row flex-wrap items-center justify-between gap-3 py-3 border-b ${dividerClass}`}>
              <View className="flex-row items-center gap-2">
                <Tag size={16} color={accentColor} />
                <Text className={`text-sm ${bodyClass}`}>Versão</Text>
              </View>
              <Text selectable className={`text-sm font-semibold ${titleClass}`}>{appInfo.version}</Text>
            </View>
            <View className="flex-row flex-wrap items-center justify-between gap-3 pt-3">
              <View className="flex-row items-center gap-2">
                <GitCommitHorizontal size={16} color={accentColor} />
                <Text className={`text-sm ${bodyClass}`}>Commit</Text>
              </View>
              <View className={`rounded-lg px-3 py-1.5 ${isDark ? "bg-navy-2" : "bg-soft"}`}>
                <Text selectable className={`text-xs font-semibold ${accentClass}`}>
                  {appInfo.commitHash?.slice(0, 7) ?? "Não disponível nesta versão"}
                </Text>
              </View>
            </View>
            {appInfo.hasLocalChanges === true && (
              <Text className={`text-xs leading-5 mt-4 ${bodyClass}`}>Versão de desenvolvimento com alterações locais.</Text>
            )}
          </View>
          <Footer />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
