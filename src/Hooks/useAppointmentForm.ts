import { useState, useEffect } from "react";
import { Alert, AlertButton } from "react-native";
import { useAuth } from "../Context/AuthContext";
import { usePets } from "./usePets";
import { locations } from "../Data/LocationData";
import type { UseAppointmentFormOptions } from "../Types/types";

// Fluxo legado: a confirmação ainda é demonstrativa, sem persistência na API.
export function useAppointmentForm({ onViewPets, onGoHome }: UseAppointmentFormOptions) {
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
  const [selectedDate, setSelectedDate] = useState<string>("Hoje");
  const [selectedTime, setSelectedTime] = useState<string>("09:15");
  const [notes, setNotes] = useState<string>("");

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

  return {
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
  };
}
