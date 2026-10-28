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
  const { pets, loadingPets, petsError, retryPets, clinics, loadingClinics, clinicsError, retryClinics, values, updateField, confirm, submitting, confirmed } = useAppointmentForm({
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
        {petsError && <TouchableOpacity onPress={() => void retryPets()}><Text className="text-brand">Não foi possível carregar os pets. Tentar novamente.</Text></TouchableOpacity>}
        <PetSelector
          pets={pets}
          loadingPets={loadingPets}
          selectedPet={values.petId}
          setSelectedPet={(value) => updateField("petId", value)}
          onRegisterPet={() => navigation.navigate("RegisterPet")}
        />
        <AppointmentReasonSelector
          selectedReason={values.reason}
          setSelectedReason={(value) => updateField("reason", value)}
        />
        <ClinicSelector
          clinics={clinics}
          loading={loadingClinics}
          error={clinicsError}
          onRetry={() => void retryClinics()}
          selectedLocation={values.clinicId}
          setSelectedLocation={(value) => updateField("clinicId", value)}
        />
        <AppointmentDateTimeSelector
          selectedDate={values.date}
          setSelectedDate={(value) => updateField("date", value)}
          selectedTime={values.time}
          setSelectedTime={(value) => updateField("time", value)}
        />
        <AppointmentNotes notes={values.notes} setNotes={(value) => updateField("notes", value)} />

        {/* BOTÃO PRINCIPAL DE AGENDAR */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={confirm}
          disabled={submitting || confirmed || loadingPets || loadingClinics || !pets.length || !clinics.length}
          accessibilityState={{ disabled: submitting || confirmed || loadingPets || loadingClinics || !pets.length || !clinics.length }}
          className="w-full items-center justify-center bg-brand rounded-2xl py-4 mb-6 shadow-md"
        >
          <Text className="text-paper text-base font-bold">
            {submitting ? "Agendando..." : confirmed ? "Agendamento confirmado" : "Confirmar Agendamento"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
