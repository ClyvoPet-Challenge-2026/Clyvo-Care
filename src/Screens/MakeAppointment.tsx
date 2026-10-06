import { Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import type { MakeAppointmentProps } from "../Types/types";
import { useTheme } from "../Context/ThemeContext";
import { useAppointmentForm } from "../Hooks/useAppointmentForm";
import { PetSelector } from "../Components/MakeAppointmentComponents/PetSelector";
import { AppointmentReasonSelector } from "../Components/MakeAppointmentComponents/AppointmentReasonSelector";
import { ClinicSelector } from "../Components/MakeAppointmentComponents/ClinicSelector";
import { AppointmentDateTimeSelector } from "../Components/MakeAppointmentComponents/AppointmentDateTimeSelector";
import { AppointmentNotes } from "../Components/MakeAppointmentComponents/AppointmentNotes";

export function MakeAppointment({ navigation }: MakeAppointmentProps) {
  const { isDark } = useTheme();
  const {
    pets,
    loadingPets,
    selectedPet,
    setSelectedPet,
    selectedReason,
    setSelectedReason,
    selectedLocation,
    setSelectedLocation,
    selectedDate,
    setSelectedDate,
    selectedTime,
    setSelectedTime,
    notes,
    setNotes,
    handleConfirmAppointment,
  } = useAppointmentForm({
    onViewPets: () => navigation.navigate("MyPet"),
    onGoHome: () => navigation.navigate("MainScreen"),
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className={`flex-1 ${isDark ? "bg-navy-2" : "bg-ground"}`}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingVertical: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <PetSelector
          pets={pets}
          loadingPets={loadingPets}
          selectedPet={selectedPet}
          setSelectedPet={setSelectedPet}
          onRegisterPet={() => navigation.navigate("RegisterPet")}
        />
        <AppointmentReasonSelector
          selectedReason={selectedReason}
          setSelectedReason={setSelectedReason}
        />
        <ClinicSelector
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
        />
        <AppointmentDateTimeSelector
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedTime={selectedTime}
          setSelectedTime={setSelectedTime}
        />
        <AppointmentNotes notes={notes} setNotes={setNotes} />

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
