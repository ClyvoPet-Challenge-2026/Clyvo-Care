import { useState, useEffect, useRef } from "react";
import { Alert } from "react-native";
import { useAuth } from "../Context/AuthContext";
import { usePets } from "./usePets";
import { useClinics } from "./useClinics";
import { useNotificacoes } from "../Context/NotificacoesContext";
import { useCreateAppointment } from "./useAppointment";
import { buildAppointmentRequest, getAppointmentDates } from "../Utils/appointment";
import type { AppointmentFormValues, UseAppointmentFormOptions } from "../Types/types";

export function useAppointmentForm({ onViewPets, onGoHome }: UseAppointmentFormOptions) {
  const { user } = useAuth();
  const { notificarAgendamento } = useNotificacoes();
  const petsQuery = usePets(user?.id);
  const clinicsQuery = useClinics();
  const mutation = useCreateAppointment();
  const submitting = useRef(false);
  const [confirmed, setConfirmed] = useState(false);
  const pets = petsQuery.data ?? [];
  const clinics = clinicsQuery.data ?? [];
  const [values, setValues] = useState<AppointmentFormValues>({
    petId: "", reason: "checkup", clinicId: "", date: getAppointmentDates()[1].value, time: "09:15", notes: "",
  });
  useEffect(() => {
    if (petsQuery.data?.length) setValues(current => current.petId ? current : { ...current, petId: petsQuery.data[0].id });
  }, [petsQuery.data]);

  const updateField = <K extends keyof AppointmentFormValues>(field: K, value: AppointmentFormValues[K]) => {
    if (!submitting.current && !confirmed) setValues(current => ({ ...current, [field]: value }));
  };
  const confirm = async () => {
    if (submitting.current || confirmed) return;
    submitting.current = true;
    try {
      if (!user?.id) throw new Error("Entre na sua conta para agendar.");
      if (!pets.some(pet => Number(pet.id) === Number(values.petId))) throw new Error("Selecione um pet cadastrado na sua conta.");
      if (!clinics.some(clinic => clinic.id === Number(values.clinicId))) throw new Error("Selecione uma clínica disponível.");
      const appointment = await mutation.mutateAsync(buildAppointmentRequest(values));
      setConfirmed(true);
      const delivery = await notificarAgendamento(appointment, user.id);
      const notificationMessage = delivery === "denied"
        ? "\nNotificações desativadas. Você pode habilitá-las nas configurações do dispositivo."
        : delivery === "unavailable" ? "\nA consulta foi salva, mas não foi possível enviar a notificação neste dispositivo." : "";
      Alert.alert("Consulta confirmada!", `Agendamento #${appointment.id} para ${new Date(appointment.scheduledAt).toLocaleString("pt-BR")}.${notificationMessage}`, [
        { text: "Ver meus Pets", onPress: onViewPets },
        { text: "Ir para Início", onPress: onGoHome },
      ]);
    } catch (error) {
      Alert.alert("Não foi possível agendar", error instanceof Error ? error.message : "Tente novamente.");
    } finally { submitting.current = false; }
  };
  return { pets, loadingPets: petsQuery.isLoading, petsError: petsQuery.error, retryPets: petsQuery.refetch,
    clinics, loadingClinics: clinicsQuery.isLoading, clinicsError: clinicsQuery.error?.message ?? null, retryClinics: clinicsQuery.refetch,
    values, updateField, confirm, submitting: mutation.isPending, confirmed };
}
