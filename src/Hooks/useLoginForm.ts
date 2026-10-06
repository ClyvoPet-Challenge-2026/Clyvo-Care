import { useState } from "react";
import { useAuth } from "../Context/AuthContext";
import { validateLogin } from "../Utils/validators";
import type { LoginFormData, LoginFormErrors } from "../Types/types";

export function useLoginForm() {
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({ email: "", senha: "" });
  const [errors, setErrors] = useState<LoginFormErrors>({ email: "", senha: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState("");

  const updateField = (field: keyof LoginFormData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const handleLogin = async () => {
    setApiError("");
    const validation = validateLogin(formData);
    setErrors(validation.errors);
    if (!validation.isValid) return;

    try {
      setIsSubmitting(true);
      await login(formData);
    } catch (err: any) {
      setApiError(err.message || "Email ou senha incorretos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return { formData, errors, isSubmitting, apiError, updateField, handleLogin };
}
