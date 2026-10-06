import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { useRegistrationLocations } from "./useRegistrationLocations";
import { formatCpf, formatPhone } from "../Utils/formatters";
import { validateRegistration } from "../Utils/validators";
import type { RegisterFormData, RegisterFormErrors } from "../Types/types";

export function useRegisterForm() {
  const { register } = useAuth();
  const locations = useRegistrationLocations();
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    cpf: "",
    email: "",
    senha: "",
    confirmarSenha: "",
    phone: "",
    cityId: 0,
  });

  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [apiError, setApiError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: Exclude<keyof RegisterFormData, "cityId">, value: string) => {
    const formattedValue = field === "cpf" ? formatCpf(value)
      : field === "phone" ? formatPhone(value) : value;
    setFormData((current) => ({ ...current, [field]: formattedValue }));
  };

  const handleRegister = async () => {
    if (isSubmitting || !locations.canRegister) return;
    setApiError("");
    const validation = validateRegistration({ ...formData, cityId: locations.selectedCityId }, locations.canRegister);
    setErrors(validation.errors);
    if (!validation.isValid) return;

    try {
      setIsSubmitting(true);
      await register({
        ...formData,
        cityId: locations.selectedCityId,
        cpf: formData.cpf.replace(/\D/g, ""),
      });
    } catch (err: any) {
      setApiError(err.message || "Não foi possível realizar o cadastro.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, errors, apiError, isSubmitting, updateField, handleRegister, locations };
}
