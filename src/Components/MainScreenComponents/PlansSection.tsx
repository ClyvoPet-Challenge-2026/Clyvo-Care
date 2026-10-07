import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator, useWindowDimensions } from "react-native";
import { ShieldCheck, Crown, PawPrint, CreditCard, Wallet, Barcode, QrCode, Check, ArrowRight, Info } from "lucide-react-native";
import { useTheme } from "../../Context/ThemeContext";
import { formatPlanPrice, paymentMethodLabels } from "../../Utils/planPresentation";
import { getPetSpeciesImage } from "../../Utils/petPresentation";
import type { PlansSectionProps } from "../../Types/types";

const paymentIcons = { CREDIT_CARD: CreditCard, DEBIT_CARD: Wallet, BOLETO: Barcode, PIX: QrCode };

export function PlansSection({ state, actions, onRegisterPet }: PlansSectionProps) {
  const { isDark } = useTheme();
  const { width } = useWindowDimensions();
  const planCardWidth = Math.min(320, width - 64);
  const accentColor = isDark ? "#99b6e6" : "#1f6ae1";
  const dividerClass = isDark ? "border-white/10" : "border-rule/60";
  const textClass = isDark ? "text-paper" : "text-navy";
  const mutedClass = isDark ? "text-soft-line" : "text-mute";
  const cardClass = `rounded-3xl p-5 border ${isDark ? "bg-navy border-white/10" : "bg-paper border-rule"}`;
  const { subscription, selectedPet } = state;

  return (
    <View>
      <View className="flex-row items-center gap-3 mb-5">
        <View className={`w-11 h-11 rounded-2xl items-center justify-center ${isDark ? "bg-navy" : "bg-soft"}`}>
          <Crown size={22} color={accentColor} />
        </View>
        <View className="flex-1">
          <Text accessibilityRole="header" className={`text-lg font-bold ${textClass}`}>Planos de Saúde Clyvo</Text>
          <Text className={`text-xs mt-1 ${mutedClass}`}>Cuidado que acompanha o seu pet</Text>
        </View>
      </View>
      {state.error ? (
        <View className={cardClass}>
          <Text className={`text-sm ${textClass}`}>Não foi possível carregar seus planos.</Text>
          <Text className={`text-xs mt-2 ${mutedClass}`}>{state.error}</Text>
          <TouchableOpacity accessibilityRole="button" onPress={actions.retry} className="bg-brand rounded-xl p-3 mt-4 items-center">
            <Text className="text-paper font-semibold">Tentar novamente</Text>
          </TouchableOpacity>
        </View>
      ) : state.loading ? (
        <ActivityIndicator accessibilityLabel="Carregando planos" size="large" color="#1f6ae1" className="py-8" />
      ) : !state.pets.length ? (
        <View className={cardClass}>
          <Text className={`text-sm ${textClass}`}>Cadastre um pet para contratar um plano.</Text>
          <TouchableOpacity accessibilityRole="button" onPress={onRegisterPet} className="bg-brand rounded-xl p-3 mt-4 items-center">
            <Text className="text-paper font-semibold">Cadastrar pet</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <View className="flex-row items-center gap-2 mb-3">
            <PawPrint size={15} color={accentColor} />
            <Text className={`text-xs font-semibold uppercase tracking-wider ${mutedClass}`}>Para quem vamos cuidar?</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 4 }} className="mb-5">
            {state.pets.map((pet) => (
              <TouchableOpacity
                key={pet.id}
                accessibilityRole="button"
                accessibilityState={{ selected: pet.id === selectedPet?.id, disabled: state.busy }}
                disabled={state.busy}
                onPress={() => actions.selectPet(pet.id)}
                className={`flex-row items-center gap-3 rounded-2xl pl-2 pr-4 py-2 mr-3 border ${pet.id === selectedPet?.id ? "bg-brand border-brand" : isDark ? "bg-navy border-white/10" : "bg-paper border-rule"} ${state.busy ? "opacity-60" : ""}`}
              >
                <Image source={getPetSpeciesImage(pet.species?.name)} className="w-10 h-10 rounded-full bg-soft" resizeMode="cover" accessible={false} />
                <Text className={`text-sm font-semibold ${pet.id === selectedPet?.id ? "text-paper" : textClass}`}>{pet.name}</Text>
                {pet.id === selectedPet?.id && <Check size={16} color="#ffffff" />}
              </TouchableOpacity>
            ))}
          </ScrollView>

          {subscription ? (
            <View className={`rounded-3xl border overflow-hidden ${isDark ? "bg-navy border-white/10" : "bg-paper border-rule"}`}>
              <View className={`p-5 ${isDark ? "bg-navy-2" : "bg-brand"}`}>
                <View className="flex-row items-center justify-between mb-4">
                  <View className="w-11 h-11 rounded-2xl bg-paper/15 items-center justify-center">
                    <ShieldCheck size={24} color="#ffffff" />
                  </View>
                  <View className={`rounded-full px-3 py-1.5 ${isDark ? "bg-ok/20" : "bg-paper"}`}>
                    <Text className={`text-xs font-bold ${isDark ? "text-mint" : "text-ok"}`}>Plano vigente</Text>
                  </View>
                </View>
                <Text className="text-paper text-xl font-bold">{subscription.plan.name}</Text>
                <Text className="text-soft text-sm mt-1">Cuidado para {subscription.pet.name}</Text>
              </View>
              <View className="p-5">
                <Text className={`text-xs font-medium ${mutedClass}`}>Valor contratado</Text>
                <View className="flex-row flex-wrap items-baseline gap-1 mt-1 mb-4">
                  <Text className={`text-3xl font-black ${textClass}`}>{formatPlanPrice(subscription.contractedValue)}</Text>
                  <Text className={`text-sm ${mutedClass}`}>/mês</Text>
                </View>
                <View className={`flex-row items-center gap-3 p-3.5 rounded-2xl border ${isDark ? "bg-navy-2/60 border-white/10" : "bg-ground/60 border-rule/50"}`}>
                  <CreditCard size={20} color={accentColor} />
                  <View className="flex-1">
                    <Text className={`text-xs ${mutedClass}`}>Forma de pagamento</Text>
                    <Text className={`text-sm font-semibold mt-0.5 ${textClass}`}>{paymentMethodLabels[subscription.paymentMethod]}</Text>
                  </View>
                </View>
              {state.canCancel ? (
                <TouchableOpacity
                  accessibilityRole="button"
                  disabled={state.busy}
                  onPress={actions.cancel}
                  className={`rounded-xl py-3 mt-4 items-center border ${isDark ? "bg-danger/20 border-danger/30" : "bg-red-50 border-red-200"} ${state.busy ? "opacity-50" : ""}`}
                >
                  <Text className="text-danger font-semibold">{state.busy ? "Aguarde…" : "Cancelar assinatura"}</Text>
                </TouchableOpacity>
              ) : (
                <View className="flex-row items-start gap-2 mt-4">
                  <Info size={15} color={accentColor} />
                  <Text className={`flex-1 text-xs leading-5 ${mutedClass}`}>O cancelamento pelo aplicativo ainda não está disponível para sua conta.</Text>
                </View>
              )}
              </View>
            </View>
          ) : (
            <>
              <Text className={`text-sm mb-3 ${mutedClass}`}>{selectedPet?.name} ainda não possui plano ativo.</Text>
              <View className={`${cardClass} mb-4`}>
                <View className="flex-row items-center gap-3 mb-4">
                  <View className={`w-10 h-10 rounded-2xl items-center justify-center ${isDark ? "bg-navy-2" : "bg-soft"}`}>
                    <Wallet size={20} color={accentColor} />
                  </View>
                  <View className="flex-1">
                    <Text className={`text-base font-bold ${textClass}`}>Como prefere pagar?</Text>
                    <Text className={`text-xs mt-1 ${mutedClass}`}>Escolha para consultar o valor final</Text>
                  </View>
                </View>
                <View className="flex-row flex-wrap gap-2">
                  {state.paymentMethods.map((method) => {
                    const PaymentIcon = paymentIcons[method];
                    const selected = method === state.paymentMethod;
                    return (
                    <TouchableOpacity
                      key={method}
                      accessibilityRole="button"
                      accessibilityState={{ selected: method === state.paymentMethod, disabled: state.busy }}
                      disabled={state.busy}
                      onPress={() => actions.selectPayment(method)}
                      style={{ flexBasis: "46%", flexGrow: 1 }}
                      className={`rounded-2xl px-3 py-3 border ${selected ? "border-brand bg-brand/10" : isDark ? "border-white/10 bg-navy-2" : "border-rule bg-ground/50"} ${state.busy ? "opacity-60" : ""}`}
                    >
                      <View className="flex-row items-center justify-between mb-2">
                        <PaymentIcon size={20} color={accentColor} />
                        <View className={`w-4 h-4 rounded-full border items-center justify-center ${selected ? "bg-brand border-brand" : "border-mute"}`}>
                          {selected && <Check size={10} color="#ffffff" />}
                        </View>
                      </View>
                      <Text className={`text-xs font-semibold ${textClass}`}>{paymentMethodLabels[method]}</Text>
                    </TouchableOpacity>
                    );
                  })}
                </View>
                {!state.paymentMethods.length && <Text className={`text-xs ${mutedClass}`}>Nenhuma forma de pagamento disponível.</Text>}
              </View>
              <View className="flex-row items-center justify-between mb-3">
                <Text className={`text-base font-bold ${textClass}`}>Escolha o plano</Text>
                <Text className={`text-xs ${mutedClass}`}>{state.plans.length} disponíveis</Text>
              </View>
              <View className="-mx-5">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} decelerationRate="fast" snapToInterval={planCardWidth + 12} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 8, alignItems: "stretch" }}>
                  {state.plans.map((plan) => (
                    <View key={plan.id} style={{ width: planCardWidth }} className={`rounded-3xl border mr-3 overflow-hidden ${isDark ? "bg-navy border-white/10" : "bg-paper border-rule"}`}>
                      <View className={`px-5 pt-5 pb-4 border-b ${dividerClass} ${isDark ? "bg-navy-2" : "bg-soft/60"}`}>
                        <View className="flex-row items-center justify-between mb-4">
                          <View className="w-11 h-11 bg-brand rounded-2xl items-center justify-center">
                            <ShieldCheck size={23} color="#ffffff" />
                          </View>
                          <Text className={`text-[10px] font-bold uppercase tracking-wider ${mutedClass}`}>Clyvo Care</Text>
                        </View>
                        <Text className={`text-xl font-bold ${textClass}`}>{plan.name}</Text>
                      </View>
                      <View className="p-5 flex-1">
                        <Text className={`text-xs font-medium ${mutedClass}`}>Mensalidade base</Text>
                        <View className="flex-row flex-wrap items-baseline gap-1 mt-1 mb-4">
                          <Text className={`text-3xl font-black ${textClass}`}>{formatPlanPrice(plan.monthlyValue)}</Text>
                          <Text className={`text-xs ${mutedClass}`}>/mês</Text>
                        </View>
                        <View className={`rounded-2xl p-3.5 mb-4 ${isDark ? "bg-navy-2/60" : "bg-ground/70"}`}>
                          <View className="flex-row items-center gap-2 mb-2">
                            <PawPrint size={15} color={accentColor} />
                            <Text className={`flex-1 text-xs font-semibold ${textClass}`}>Para {selectedPet?.name}</Text>
                          </View>
                          <Text className={`text-xs leading-5 ${mutedClass}`}>O valor final e o desconto para {state.paymentMethod ? paymentMethodLabels[state.paymentMethod] : "a forma escolhida"} aparecem antes da confirmação.</Text>
                        </View>
                        <View className="flex-1" />
                        <TouchableOpacity
                          accessibilityRole="button"
                          disabled={state.busy || !state.paymentMethod}
                          onPress={() => { void actions.subscribe(plan); }}
                          className={`bg-brand rounded-xl py-3.5 px-3 flex-row gap-2 items-center justify-center ${state.busy || !state.paymentMethod ? "opacity-50" : ""}`}
                        >
                          {state.busy && <ActivityIndicator size="small" color="#ffffff" />}
                          <Text className="text-paper text-xs font-bold uppercase tracking-wider">{state.busy ? "Aguarde…" : "Contratar plano"}</Text>
                          {!state.busy && <ArrowRight size={16} color="#ffffff" />}
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </View>
              {!state.plans.length && <Text className={`text-sm ${mutedClass}`}>Nenhum plano disponível no momento.</Text>}
            </>
          )}
        </>
      )}
    </View>
  );
}
