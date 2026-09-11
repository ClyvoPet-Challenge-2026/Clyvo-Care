import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Alert, AlertButton, KeyboardAvoidingView, Platform, ActivityIndicator } from "react-native";
import { Clock, Heart, MapPin, Stethoscope, ChevronDown, Check, FileText, Plus } from "lucide-react-native";
import { MyPetData } from "../Data/MyPetData";
import { PetSpecieBreedListData } from "../Data/PetSpecieBreedListData";
import { locations } from "../Data/LocationData";
import { APPOINTMENT_REASONS, AVAILABLE_TIMES, QUICK_DATES } from "../Data/AppointmentData";
import { MakeAppointmentProps } from "../Types/types";
import { useAuth } from "../Context/AuthContext";
import { usePets } from "../Hooks/usePets";

export function MakeAppointment({ navigation }: MakeAppointmentProps) {
  const { user } = useAuth();
  const { data: pets = [], isLoading: loadingPets } = usePets(user?.id);

  // Seleções
  const [selectedPet, setSelectedPet] = useState<number | string>("");
  const [selectedReason, setSelectedReason] = useState<string>("checkup");

  useEffect(() => {
    if (pets.length > 0 && !selectedPet) {
      setSelectedPet(pets[0].id);
    }
  }, [pets]);
  const [selectedLocation, setSelectedLocation] = useState<string>(locations[0]?.name ?? "São José dos Campos");
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("Hoje");
  const [selectedTime, setSelectedTime] = useState<string>("09:15");
  const [notes, setNotes] = useState<string>("");

  const handleConfirmAppointment = () => {
    const alertButtons: AlertButton[] = [
      {
        text: "Ver meus Pets",
        onPress: () => navigation.navigate("MyPet"),
      },
      {
        text: "Ir para Início",
        style: "default",
        onPress: () => navigation.navigate("MainScreen"),
      },
    ];

    Alert.alert(
      "Consulta Confirmada! 🐾",
      "Sua consulta foi agendada com sucesso.",
      alertButtons
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-mainBackground"
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* 1. SELEÇÃO DE PET */}
        <View className="bg-paper rounded-3xl p-5 mb-5 border border-rule">
          <View className="flex-row items-center justify-between mb-3.5">
            <View className="flex-row items-center gap-2">
              <Heart size={18} color="#1f6ae1" />
              <Text className="text-base font-bold text-navy">
                Qual pet passará na consulta?
              </Text>
            </View>
          </View>

          {/* Carrossel Horizontal de Seleção de Pets da API */}
          {loadingPets ? (
            <ActivityIndicator size="small" color="#1f6ae1" className="py-4" />
          ) : pets.length > 0 ? (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="-mx-1 py-1"
            >
              {pets.map((pet) => {
                const isSelected = selectedPet === pet.id;
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
                    activeOpacity={0.8}
                    onPress={() => setSelectedPet(pet.id)}
                    style={
                      isSelected
                        ? {
                            shadowColor: "#000",
                            shadowOffset: { width: 0, height: 1 },
                            shadowOpacity: 0.08,
                            shadowRadius: 2,
                            elevation: 1,
                          }
                        : undefined
                    }
                    className={`mr-3 p-3 rounded-2xl border items-center w-28 ${
                      isSelected
                        ? "border-brand bg-soft"
                        : "border-rule bg-ground"
                    }`}
                  >
                    <View className="relative mb-2">
                      <View
                        className={`w-14 h-14 rounded-full overflow-hidden border-2 ${
                          isSelected ? "border-brand" : "border-rule"
                        }`}
                      >
                        <Image
                          source={petImg}
                          className="w-full h-full"
                          resizeMode="cover"
                        />
                      </View>
                      {isSelected && (
                        <View className="absolute -bottom-1 -right-1 bg-brand rounded-full w-5 h-5 items-center justify-center border-2 border-paper">
                          <Check size={11} color="#ffffff" />
                        </View>
                      )}
                    </View>
                    <Text
                      className={`text-xs font-bold text-center ${
                        isSelected ? "text-brand" : "text-navy"
                      }`}
                      numberOfLines={1}
                    >
                      {pet.name}
                    </Text>
                    <Text className="text-[10px] text-mute text-center" numberOfLines={1}>
                      {pet.breed?.name || pet.species?.name || "Pet"}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          ) : (
            <View className="items-center py-4">
              <Text className="text-xs text-mute mb-2">Nenhum pet cadastrado para agendamento.</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("RegisterPet")}
                className="flex-row items-center gap-1.5 bg-brand px-3.5 py-2 rounded-xl"
              >
                <Plus size={14} color="#ffffff" />
                <Text className="text-xs text-paper font-semibold">Cadastrar Pet</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* 2. SELEÇÃO DO MOTIVO DA CONSULTA */}
        <View className="bg-paper rounded-3xl p-5 mb-5 border border-rule">
          <View className="flex-row items-center gap-2 mb-1">
            <Stethoscope size={18} color="#1f6ae1" />
            <Text className="text-base font-bold text-navy">
              Qual o motivo da consulta?
            </Text>
          </View>
          <Text className="text-xs text-mute mb-3.5">
            Selecione a opção que melhor descreve a necessidade do seu pet:
          </Text>

          <View className="gap-2.5">
            {APPOINTMENT_REASONS.map((reason) => {
              const isSelected = selectedReason === reason.id;
              return (
                <TouchableOpacity
                  key={reason.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedReason(reason.id)}
                  className={`p-3.5 rounded-2xl border flex-row items-center justify-between ${
                    isSelected
                      ? "border-brand bg-soft "
                      : "border-rule bg-ground/30"
                  }`}
                >
                  <View className="flex-1 mr-3">
                    <View className="flex-row items-center gap-2 mb-0.5">
                      <Text
                        className={`text-sm font-bold ${
                          isSelected ? "text-brand" : "text-navy"
                        }`}
                      >
                        {reason.title}
                      </Text>
                      {reason.badge && (
                        <View
                          className={`px-2 py-0.5 rounded-full ${
                            isSelected ? "bg-brand/15" : "bg-rule/60"
                          }`}
                        >
                          <Text
                            className={`text-[10px] font-semibold ${
                              isSelected ? "text-brand" : "text-soft-ink"
                            }`}
                          >
                            {reason.badge}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text className="text-xs text-soft-ink">
                      {reason.description}
                    </Text>
                  </View>

                  {/* Radio Indicator */}
                  <View
                    className={`w-5 h-5 rounded-full border items-center justify-center ${
                      isSelected
                        ? "border-brand bg-brand"
                        : "border-mute bg-paper"
                    }`}
                  >
                    {isSelected && (
                      <View className="w-2 h-2 rounded-full bg-paper" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 3. UNIDADE / CLÍNICA CLYVO */}
        <View className="bg-paper rounded-3xl p-5 mb-5 border border-rule">
          <View className="flex-row items-center gap-2 mb-1">
            <MapPin size={18} color="#1f6ae1" />
            <Text className="text-base font-bold text-navy">
              Unidade de Atendimento
            </Text>
          </View>
          <Text className="text-xs text-mute mb-3.5">
            Selecione onde deseja ser atendido:
          </Text>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setLocationDropdownOpen(!locationDropdownOpen)}
            className={`w-full min-h-[50px] rounded-xl border px-3.5 py-3 flex-row items-center justify-between ${
              locationDropdownOpen ? "border-brand bg-paper" : "border-rule bg-ground/50"
            }`}
          >
            <View className="flex-row items-center flex-1 mr-2">
              <View className="mr-2.5">
                <MapPin size={18} color="#1f6ae1" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-navy">
                  {selectedLocation}
                </Text>
              </View>
            </View>
            <ChevronDown
              size={18}
              color="#6c778c"
              style={{
                transform: [{ rotate: locationDropdownOpen ? "180deg" : "0deg" }],
              }}
            />
          </TouchableOpacity>

          {locationDropdownOpen && (
            <View className="mt-2 bg-paper border border-rule-2 rounded-2xl overflow-hidden">
              {locations.map((loc, index) => {
                const isSelected = loc.name === selectedLocation;
                return (
                  <TouchableOpacity
                    key={loc.id}
                    activeOpacity={0.7}
                    onPress={() => {
                      setSelectedLocation(loc.name);
                      setLocationDropdownOpen(false);
                    }}
                    className={`p-3.5 flex-row items-center justify-between ${
                      isSelected ? "bg-soft/50" : "bg-paper"
                    } ${index < locations.length - 1 ? "border-b border-rule-2/70" : ""}`}
                  >
                    <View className="flex-1 mr-3">
                      <Text
                        className={`text-sm font-bold ${
                          isSelected ? "text-brand" : "text-navy"
                        }`}
                      >
                        {loc.name}
                      </Text>
                      <Text className="text-xs text-soft-ink mt-0.5" numberOfLines={2}>
                        {loc.location}
                      </Text>
                    </View>
                    {isSelected && <Check size={18} color="#1f6ae1" />}
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* 4. DATA E HORÁRIO */}
        <View className="bg-paper rounded-3xl p-5 mb-5 border border-rule">
          <View className="flex-row items-center gap-2 mb-1">
            <Clock size={18} color="#1f6ae1" />
            <Text className="text-base font-bold text-navy">
              Data e Horário
            </Text>
          </View>
          <Text className="text-xs text-mute mb-3.5">
            Selecione uma data para a consulta:
          </Text>

          {/* Atalhos de Datas Rápidas */}
          <View className="flex-row flex-wrap gap-2 mb-4">
            {QUICK_DATES.map((qDate) => {
              const isSelected = selectedDate === qDate.label;
              return (
                <TouchableOpacity
                  key={qDate.label}
                  activeOpacity={0.8}
                  onPress={() => setSelectedDate(qDate.label)}
                  style={
                    isSelected
                      ? {
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 1 },
                          shadowOpacity: 0.1,
                          shadowRadius: 2,
                          elevation: 1,
                        }
                      : undefined
                  }
                  className={`flex-1 min-w-[70px] py-2.5 px-3 rounded-2xl border items-center justify-center ${
                    isSelected
                      ? "border-brand bg-brand"
                      : "border-rule bg-ground/50"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      isSelected ? "text-paper" : "text-navy"
                    }`}
                  >
                    {qDate.label}
                  </Text>
                  <Text
                    className={`text-[10px] mt-0.5 ${
                      isSelected ? "text-paper" : "text-mute"
                    }`}
                  >
                    {qDate.sublabel}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Grade de Horários */}
          <Text className="text-xs font-medium text-mute mb-2">
            Horários disponíveis:
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {AVAILABLE_TIMES.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <TouchableOpacity
                  key={time}
                  activeOpacity={0.8}
                  onPress={() => setSelectedTime(time)}
                  className={`py-2 px-3.5 rounded-xl border items-center justify-center ${
                    isSelected
                      ? "border-brand bg-brand"
                      : "border-rule bg-ground/50"
                  }`}
                >
                  <Text
                    className={`text-xs font-semibold ${
                      isSelected ? "text-paper" : "text-body"
                    }`}
                  >
                    {time}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 5. OBSERVAÇÕES OU SINTOMAS */}
        <View className="bg-paper rounded-3xl p-5 mb-6 border border-rule">
          <View className="flex-row items-center gap-2 mb-1">
            <FileText size={18} color="#1f6ae1" />
            <Text className="text-base font-bold text-navy">
              Observações (Opcional)
            </Text>
          </View>
          <Text className="text-xs text-mute mb-3">
            Algum sintoma, histórico alérgico ou aviso prévio para o veterinário?
          </Text>

          <View className="rounded-2xl border border-rule bg-ground/50 p-3">
            <TextInput
              placeholder="Ex: O pet está tossindo desde ontem à noite, ou necessita de focinheira para exames..."
              placeholderTextColor="#6c778c"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="text-sm text-ink min-h-[70px] p-0"
              value={notes}
              onChangeText={setNotes}
            />
          </View>
        </View>

        {/* BOTÃO PRINCIPAL DE AGENDAR */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleConfirmAppointment}
          className="w-full items-center justify-center bg-brand rounded-2xl py-4 mb-6 shadow-md"
        >
          <Text className="text-paper text-base font-bold">
            Confirmar Agendamento
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}