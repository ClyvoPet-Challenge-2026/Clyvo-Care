import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { ShieldCheck, CheckCircle2, Crown, Check } from "lucide-react-native";
import { useTheme } from "../../Context/ThemeContext";
import type { PlansSectionProps } from "../../Types/types";

export function PlansSection({ activePlanId, activePlanDetails, petName, availablePlans, loadingPlans, onCancelSubscription, onChangePlan, onSelectPlan }: PlansSectionProps) {
  const { isDark } = useTheme();
  return (
    <View>
      {activePlanId && activePlanDetails ? (
        /* CARD DO PLANO ATIVO (MODELO VISUAL) */
        <View className={`rounded-3xl p-5 border shadow-sm ${
          isDark ? "bg-navy border-white/10" : "bg-paper border-rule"
        }`}>
          <View className={`flex-row items-center justify-between pb-3.5 border-b ${
            isDark ? "border-white/10" : "border-rule/70"
          }`}>
            <View className="flex-row items-center gap-2.5">
              <View className="w-10 h-10 rounded-2xl bg-ok/10 items-center justify-center">
                <ShieldCheck size={22} color="#008c4d" />
              </View>
              <View>
                <View className="flex-row items-center gap-2">
                  <Text className={`text-base font-bold ${isDark ? "text-paper" : "text-navy"}`}>
                    {activePlanDetails.name}
                  </Text>
                  <View className="bg-ok/15 px-2.5 py-0.5 rounded-full">
                    <Text className="text-[11px] font-bold text-ok tracking-wider uppercase">
                      Vigente
                    </Text>
                  </View>
                </View>
                <Text className={`text-xs mt-0.5 ${isDark ? "text-soft-line" : "text-mute"}`}>
                  Pet protegido: {petName || "Thor"}
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-3.5">
            <Text className={`text-xs font-medium ${isDark ? "text-soft-line" : "text-mute"}`}>
              {activePlanDetails.tagline}
            </Text>
            <View className="flex-row items-baseline gap-1 mt-1 mb-3">
              <Text className={`text-2xl font-black ${isDark ? "text-paper" : "text-navy"}`}>
                {activePlanDetails.price}
              </Text>
              <Text className={`text-xs ${isDark ? "text-soft-line" : "text-mute"}`}>{activePlanDetails.period}</Text>
            </View>

            <View className={`space-y-2 p-3.5 rounded-2xl border ${
              isDark ? "bg-navy-2/60 border-white/10" : "bg-ground/60 border-rule/50"
            }`}>
              <Text className={`text-xs font-bold mb-1 ${isDark ? "text-paper" : "text-navy"}`}>
                Coberturas inclusas na sua assinatura:
              </Text>
              {activePlanDetails.features.slice(0, 4).map((feat, idx) => (
                <View key={idx} className="flex-row items-center gap-2">
                  <CheckCircle2 size={14} color="#008c4d" />
                  <Text className={`text-xs flex-1 ${isDark ? "text-soft" : "text-soft-ink"}`} numberOfLines={1}>
                    {feat}
                  </Text>
                </View>
              ))}
            </View>

            <View className="flex-row gap-3 mt-4">
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onCancelSubscription}
                className={`flex-1 rounded-xl py-2.5 items-center justify-center border ${
                  isDark ? "bg-danger/20 border-danger/30" : "bg-red-50 border-red-200"
                }`}
              >
                <Text className="text-xs font-semibold text-danger">
                  Cancelar Assinatura
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={onChangePlan}
                className={`rounded-xl px-4 py-2.5 items-center justify-center border ${
                  isDark ? "bg-navy-2 border-white/10" : "bg-soft border-transparent"
                }`}
              >
                <Text className="text-xs font-semibold text-brand">
                  Trocar Plano
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : (
        <View>
          <View className="flex-row items-center justify-between mb-3 px-1">
            <View>
              <View className="flex-row items-center gap-2">
                <Crown size={18} color="#1f6ae1" />
                <Text className={`text-lg font-bold ${isDark ? "text-paper" : "text-navy"}`}>
                  Planos de Saúde Clyvo
                </Text>
              </View>
              <Text className={`text-xs mt-0.5 ${isDark ? "text-soft-line" : "text-mute"}`}>
                Você ainda não possui plano ativo. Conheça as opções:
              </Text>
            </View>
          </View>

          {/* Carrossel Horizontal dos Planos */}
          <View className="-mx-5">
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{
                paddingLeft: 20,
                paddingRight: 20,
                alignItems: "stretch",
              }}
              className="py-1"
            >
              {loadingPlans ? (
                <ActivityIndicator size="small" color="#1f6ae1" className="p-10" />
              ) : (
                availablePlans.map(({ plan, isPopular, tagline, features }) => {
                  return (
                    <View
                      key={plan.id}
                      className={`w-80 rounded-3xl p-5 border mr-4 flex-col justify-between ${
                        isPopular
                          ? "border-brand shadow-md"
                          : (isDark ? "border-white/10" : "border-rule")
                      } ${isDark ? "bg-navy" : "bg-paper"}`}
                    >
                      <View>
                        {/* Header do Card com Badge Popular */}
                        <View className="flex-row items-center justify-between mb-2">
                          <Text className={`text-xl font-bold ${isDark ? "text-paper" : "text-navy"}`}>{plan.name}</Text>
                          {isPopular && (
                            <View className="px-2.5 py-1 rounded-full bg-brand">
                              <Text className="text-paper text-[10px] font-bold uppercase tracking-wider">
                                Mais Popular
                              </Text>
                            </View>
                          )}
                        </View>

                        <Text className={`text-xs mb-3 min-h-[32px] ${isDark ? "text-soft-line" : "text-mute"}`} numberOfLines={2}>
                          {tagline}
                        </Text>

                        {/* Preço Mensal vindo da API */}
                        <View className={`flex-row items-baseline mb-4 pb-3 border-b ${isDark ? "border-white/10" : "border-rule/60"}`}>
                          <Text className={`text-2xl font-black ${isDark ? "text-paper" : "text-navy"}`}>
                            R$ {plan.monthlyValue?.toFixed(2)}
                          </Text>
                          <Text className={`text-xs font-medium ml-1 ${isDark ? "text-soft-line" : "text-mute"}`}>/mês</Text>
                        </View>

                        {/* Lista de Benefícios e Coberturas */}
                        <View className="space-y-2.5 mb-4">
                          {features.map((feat, idx) => (
                            <View key={idx} className="flex-row items-start gap-2.5">
                              <View className="w-4 h-4 rounded-full bg-ok/15 items-center justify-center mt-0.5">
                                <Check size={10} color="#008c4d" />
                              </View>
                              <Text className={`text-xs flex-1 leading-snug ${isDark ? "text-soft" : "text-soft-ink"}`}>
                                {feat}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      {/* Botão de seleção do plano */}
                      <TouchableOpacity
                        activeOpacity={0.85}
                        onPress={() => onSelectPlan(plan)}
                        className={`w-full py-3.5 rounded-xl items-center justify-center mt-2 ${
                          isPopular ? "bg-brand shadow-sm" : (isDark ? "bg-brand" : "bg-navy")
                        }`}
                      >
                        <Text className="text-paper text-xs font-bold uppercase tracking-wider">
                          Assinar Plano
                        </Text>
                      </TouchableOpacity>
                    </View>
                  );
                })
              )}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
}
