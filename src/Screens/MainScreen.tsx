import { useState, useEffect } from "react";
import { View, ScrollView, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Plus, ShieldCheck, CheckCircle2, Calendar, Sparkles, MapPin, ChevronRight, Heart, Crown, Check } from "lucide-react-native";
import { LocationCarrousel } from "../Components/LocationCarrousel";
import { MyPetData } from "../Data/MyPetData";
import { PetSpecieBreedListData } from "../Data/PetSpecieBreedListData";
import { ClyvoPlansData, ClyvoPlan } from "../Data/PlansData";
import { MainScreenProps, PlanApiDTO } from "../Types/types";
import { useAuth } from "../Context/AuthContext";
import { usePets } from "../Hooks/usePets";
import { usePlans } from "../Hooks/usePlans";

const SUBSCRIPTION_STORAGE_KEY = "@clyvo_active_plan";

export function MainScreen({ navigation }: MainScreenProps) {
  const { user } = useAuth();

  // Queries TanStack Query
  const { data: pets = [] } = usePets(user?.id);
  const { data: plans = [], isLoading: loadingPlans } = usePlans();

  // Mock / Local State para o Plano Ativo (desvinculado temporariamente da API)
  const [activePlanId, setActivePlanId] = useState<string | null>("comfort");

  useEffect(() => {
    loadStoredPlan();
  }, []);

  const loadStoredPlan = async () => {
    try {
      const stored = await AsyncStorage.getItem(SUBSCRIPTION_STORAGE_KEY);
      if (stored !== null) {
        setActivePlanId(stored || null);
      }
    } catch (e) {
      console.log("Erro ao carregar plano local:", e);
    }
  };

  const handleSelectPlan = async (plan: ClyvoPlan | PlanApiDTO) => {
    const planIdStr = String(plan.id);
    const planName = plan.name;
    const planPrice = "monthlyValue" in plan ? `R$ ${plan.monthlyValue?.toFixed(2)}/mês` : `${plan.price}${plan.period}`;

    Alert.alert(
      "Confirmar Assinatura",
      `Deseja assinar o plano ${planName} (${planPrice})?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: async () => {
            await AsyncStorage.setItem(SUBSCRIPTION_STORAGE_KEY, planIdStr);
            setActivePlanId(planIdStr);
            Alert.alert("Parabéns!", `Seu pet agora está protegido pelo ${planName}!`);
          },
        },
      ]
    );
  };

  const handleCancelSubscription = () => {
    Alert.alert(
      "Cancelar Assinatura",
      "Deseja realmente cancelar a assinatura deste plano?",
      [
        { text: "Não", style: "cancel" },
        {
          text: "Sim, Cancelar",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.setItem(SUBSCRIPTION_STORAGE_KEY, "");
            setActivePlanId(null);
            Alert.alert("Plano cancelado", "Sua assinatura foi desativada.");
          },
        },
      ]
    );
  };

  // Encontra os detalhes visuais do plano ativo
  const activePlanDetails =
    ClyvoPlansData.find((p) => p.id === activePlanId || p.name.toLowerCase().includes(String(activePlanId).toLowerCase())) ||
    ClyvoPlansData[1]; // Clyvo Conforto como fallback padrão visual

  return (
    <View className="flex-1 bg-ground">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
      >
        {/* HERO BANNER */}
        <View className="bg-brand px-6 pt-7 pb-8 rounded-b-[36px] shadow-lg">
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center gap-2">
              <View className="bg-paper/20 rounded-full px-3 py-1 flex-row items-center gap-1.5">
                <Sparkles size={14} color="#ffffff" />
                <Text className="text-paper text-xs font-semibold uppercase tracking-wider">
                  Portal Clyvo Care
                </Text>
              </View>
            </View>
          </View>

          <Text className="text-paper text-2xl font-bold tracking-tight">
            Olá, {user?.name ? user.name.split(" ")[0] : "Tutor"}!
          </Text>
          <Text className="text-soft text-sm mt-1.5 leading-5 opacity-95">
            Gerencie a saúde dos seus pets, acompanhe sua assinatura e agende consultas com rapidez.
          </Text>

          {/* Atalhos Rápidos */}
          <View className="flex-row gap-3 mt-6">
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate("MakeAppointment")}
              className="flex-1 bg-paper rounded-2xl py-3.5 px-4 flex-row items-center justify-center gap-2 shadow-sm active:scale-98"
            >
              <Calendar size={18} color="#1f6ae1" />
              <Text className="text-brand font-semibold text-sm">
                Agendar Consulta
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => navigation.navigate("RegisterPet")}
              className="bg-navy rounded-2xl py-3.5 px-4 flex-row items-center justify-center gap-2 border border-paper/10 active:scale-98"
            >
              <Plus size={18} color="#ffffff" />
              <Text className="text-paper font-semibold text-sm">
                Novo Pet
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-5 pt-8 space-y-9">
          {/* STATUS DO PLANO / PLANOS DISPONÍVEIS */}
          <View>
            {activePlanId && activePlanDetails ? (
              /* CARD DO PLANO ATIVO (MODELO VISUAL) */
              <View className="bg-paper rounded-3xl p-5 border border-rule shadow-sm">
                <View className="flex-row items-center justify-between pb-3.5 border-b border-rule/70">
                  <View className="flex-row items-center gap-2.5">
                    <View className="w-10 h-10 rounded-2xl bg-ok/10 items-center justify-center">
                      <ShieldCheck size={22} color="#008c4d" />
                    </View>
                    <View>
                      <View className="flex-row items-center gap-2">
                        <Text className="text-base font-bold text-navy">
                          {activePlanDetails.name}
                        </Text>
                        <View className="bg-ok/15 px-2.5 py-0.5 rounded-full">
                          <Text className="text-[11px] font-bold text-ok tracking-wider uppercase">
                            Vigente
                          </Text>
                        </View>
                      </View>
                      <Text className="text-xs text-mute mt-0.5">
                        Pet protegido: {pets[0]?.name || "Thor"}
                      </Text>
                    </View>
                  </View>
                </View>

                <View className="mt-3.5">
                  <Text className="text-xs text-mute font-medium">
                    {activePlanDetails.tagline}
                  </Text>
                  <View className="flex-row items-baseline gap-1 mt-1 mb-3">
                    <Text className="text-2xl font-black text-navy">
                      {activePlanDetails.price}
                    </Text>
                    <Text className="text-xs text-mute">{activePlanDetails.period}</Text>
                  </View>

                  <View className="space-y-2 bg-ground/60 p-3.5 rounded-2xl border border-rule/50">
                    <Text className="text-xs font-bold text-navy mb-1">
                      Coberturas inclusas na sua assinatura:
                    </Text>
                    {activePlanDetails.features.slice(0, 4).map((feat, idx) => (
                      <View key={idx} className="flex-row items-center gap-2">
                        <CheckCircle2 size={14} color="#008c4d" />
                        <Text className="text-xs text-soft-ink flex-1" numberOfLines={1}>
                          {feat}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <View className="flex-row gap-3 mt-4">
                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={handleCancelSubscription}
                      className="flex-1 bg-red-50 border border-red-200 rounded-xl py-2.5 items-center justify-center"
                    >
                      <Text className="text-xs font-semibold text-danger">
                        Cancelar Assinatura
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={0.8}
                      onPress={() => setActivePlanId(null)}
                      className="bg-soft rounded-xl px-4 py-2.5 items-center justify-center"
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
                      <Text className="text-lg font-bold text-navy">
                        Planos de Saúde Clyvo
                      </Text>
                    </View>
                    <Text className="text-xs text-mute mt-0.5">
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
                      plans.map((plan, index) => {
                        const planNameLower = plan.name.toLowerCase();
                        const planDetails =
                          ClyvoPlansData.find(
                            (p) =>
                              p.name.toLowerCase().includes(planNameLower) ||
                              planNameLower.includes(p.id) ||
                              p.id.toLowerCase() === planNameLower
                          ) || ClyvoPlansData[index % ClyvoPlansData.length];

                        const isPopular = planDetails?.popular;
                        const tagline = planDetails?.tagline || plan.description;
                        const features = planDetails?.features || [
                          "Consultas clínicas em horário comercial",
                          "Vacinas anuais obrigatórias",
                          "Exames laboratoriais básicos",
                          "Atendimento emergencial 24h",
                        ];

                        return (
                          <View
                            key={plan.id}
                            className={`w-80 bg-paper rounded-3xl p-5 border mr-4 flex-col justify-between ${
                              isPopular ? "border-brand shadow-md" : "border-rule" }`}
                          >
                            <View>
                              {/* Header do Card com Badge Popular */}
                              <View className="flex-row items-center justify-between mb-2">
                                <Text className="text-xl font-bold text-navy">{plan.name}</Text>
                                {isPopular && (
                                  <View className="px-2.5 py-1 rounded-full bg-brand">
                                    <Text className="text-paper text-[10px] font-bold uppercase tracking-wider">
                                      Mais Popular
                                    </Text>
                                  </View>
                                )}
                              </View>

                              <Text className="text-xs text-mute mb-3 min-h-[32px]" numberOfLines={2}>
                                {tagline}
                              </Text>

                              {/* Preço Mensal vindo da API */}
                              <View className="flex-row items-baseline mb-4 pb-3 border-b border-rule/60">
                                <Text className="text-2xl font-black text-navy">
                                  R$ {plan.monthlyValue?.toFixed(2)}
                                </Text>
                                <Text className="text-xs font-medium text-mute ml-1">/mês</Text>
                              </View>

                              {/* Lista de Benefícios e Coberturas */}
                              <View className="space-y-2.5 mb-4">
                                {features.map((feat, idx) => (
                                  <View key={idx} className="flex-row items-start gap-2.5">
                                    <View className="w-4 h-4 rounded-full bg-ok/15 items-center justify-center mt-0.5">
                                      <Check size={10} color="#008c4d" />
                                    </View>
                                    <Text className="text-xs text-soft-ink flex-1 leading-snug">
                                      {feat}
                                    </Text>
                                  </View>
                                ))}
                              </View>
                            </View>

                            {/* Botão de Contratação Real */}
                            <TouchableOpacity
                              activeOpacity={0.85}
                              onPress={() => handleSelectPlan(plan)}
                              className={`w-full py-3.5 rounded-xl items-center justify-center mt-2 ${
                                isPopular ? "bg-brand shadow-sm" : "bg-navy"
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

          {/* MEUS PETS CADASTRADOS */}
          <View className="mt-8 mb-10">
            <View className="flex-row items-center justify-between mb-3 px-1">
              <View className="flex-row items-center gap-2">
                <Heart size={18} color="#1f6ae1" />
                <Text className="text-lg font-bold text-navy">
                  Pets Cadastrados ({pets.length})
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("MyPet")}
                className="flex-row items-center gap-1"
              >
                <Text className="text-xs font-semibold text-brand">Ver todos</Text>
                <ChevronRight size={14} color="#1f6ae1" />
              </TouchableOpacity>
            </View>

            {pets.length > 0 ? (
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
                  {pets.map((pet) => {
                    const currentSpeciesName = pet.species?.name?.toLowerCase() || "";
                    const matchedConfig = PetSpecieBreedListData.find(
                      (item) =>
                        item.species.toLowerCase() === currentSpeciesName ||
                        item.apiName?.toLowerCase() === currentSpeciesName
                    );
                    const targetSpecies = matchedConfig?.species.toLowerCase() || currentSpeciesName;
                    const petImg =
                      MyPetData.find((item) => item.species.toLowerCase() === targetSpecies)?.img ||
                      MyPetData[0]?.img;

                    return (
                      <TouchableOpacity
                        key={pet.id}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate("MyPet")}
                        className="w-44 bg-paper rounded-3xl p-4 border border-rule mr-3 flex-col justify-between"
                      >
                        <View className="w-full h-24 rounded-2xl overflow-hidden bg-soft mb-2.5 items-center justify-center">
                          <Image
                            source={petImg}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        </View>
                        <View>
                          <Text className="text-sm font-bold text-navy truncate" numberOfLines={1}>
                            {pet.name}
                          </Text>
                          <Text className="text-xs text-mute truncate mt-0.5" numberOfLines={1}>
                            {pet.breed?.name || pet.species?.name || "Pet"}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}

                  <TouchableOpacity
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate("RegisterPet")}
                    className="w-36 bg-ground/80 border-2 border-dashed border-rule rounded-3xl items-center justify-center p-4 min-h-[160px]"
                  >
                    <View className="w-12 h-12 rounded-full bg-soft items-center justify-center mb-2">
                      <Plus size={22} color="#1f6ae1" />
                    </View>
                    <Text className="text-xs font-bold text-navy text-center">Novo Pet</Text>
                  </TouchableOpacity>
                </ScrollView>
              </View>
            ) : (
              <View className="bg-paper rounded-3xl p-6 border border-rule items-center">
                <View className="w-12 h-12 rounded-2xl bg-soft items-center justify-center mb-3">
                  <Heart size={24} color="#1f6ae1" />
                </View>
                <Text className="text-sm font-bold text-navy">Nenhum pet registrado</Text>
                <Text className="text-xs text-mute text-center mt-1 mb-4">
                  Cadastre seu animalzinho para gerenciar prontuário e vacinas.
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("RegisterPet")}
                  className="bg-brand px-4 py-2.5 rounded-xl flex-row items-center gap-2"
                >
                  <Plus size={16} color="#ffffff" />
                  <Text className="text-paper text-xs font-bold">Cadastrar Pet</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* UNIDADES / CLÍNICAS */}
          <View className="bg-paper rounded-3xl p-5 border border-rule shadow-sm">
            <View className="flex-row items-center justify-between mb-2">
              <View className="flex-row items-center gap-2.5">
                <View className="w-9 h-9 rounded-2xl bg-soft items-center justify-center">
                  <MapPin size={18} color="#1f6ae1" />
                </View>
                <View>
                  <Text className="text-base font-bold text-navy">Nossas Clínicas e Unidades</Text>
                  <Text className="text-xs text-mute">Encontre a Clyvo Care mais próxima de você</Text>
                </View>
              </View>
            </View>
            <LocationCarrousel />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
