import { useState, useEffect } from "react";
import { Alert, AlertButton } from "react-native";
import { useAuth } from "../Context/AuthContext";
import { usePets } from "./usePets";
import { locations } from "../Data/LocationData";
import type { AppointmentFormValues, UseAppointmentFormOptions } from "../Types/types";

// Fluxo legado: a confirmação ainda é demonstrativa, sem persistência na API.
export function useAppointmentForm({ onViewPets, onGoHome }: UseAppointmentFormOptions) {
  const { user } = useAuth();
  const { data: pets = [], isLoading: loadingPets } = usePets(user?.id);

  const [values, setValues] = useState<AppointmentFormValues>({
    petId: "",
    reason: "checkup",
    location: locations[0]?.name ?? "São José dos Campos",
    date: "Hoje",
    time: "09:15",
    notes: "",
  });

  useEffect(() => {
    if (!pets.length) return;
    setValues((current) => current.petId ? current : { ...current, petId: pets[0].id });
  }, [pets]);

  const updateField = <K extends keyof AppointmentFormValues>(field: K, value: AppointmentFormValues[K]) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleConfirmAppointment = () => {
    const alertButtons: AlertButton[] = [
      {
        text: "Ver meus Pets",
        onPress: onViewPets,
      },
      {
        text: "Ir para Início",
        style: "default",
        onPress: onGoHome,
      },
    ];

    Alert.alert(
      "Consulta Confirmada! 🐾",
      "Sua consulta foi agendada com sucesso.",
      alertButtons
    );
  };

  return { pets, loadingPets, values, updateField, confirm: handleConfirmAppointment };
}
