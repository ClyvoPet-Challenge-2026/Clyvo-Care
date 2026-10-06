import type { LoginFormData, LoginFormErrors, RegisterFormData, RegisterFormErrors } from "../Types/types";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateLogin(formData: LoginFormData) {
  const errors: LoginFormErrors = { email: "", senha: "" };
  let isValid = true;

  if (!emailRegex.test(formData.email)) {
    errors.email = "Email inválido";
    isValid = false;
  }

  if (formData.senha.length < 6) {
    errors.senha = "Senha deve ter no mínimo 6 caracteres";
    isValid = false;
  }

  return { errors, isValid };
}

export function validateRegistration(formData: RegisterFormData, canRegister: boolean) {
  const newErrors: RegisterFormErrors = {};
  let isValid = true;

  if (!formData.name.trim()) {
    newErrors.name = "Nome completo é obrigatório";
    isValid = false;
  }

  const rawCpf = formData.cpf.replace(/\D/g, "");
  if (rawCpf.length !== 11) {
    newErrors.cpf = "CPF deve conter 11 dígitos";
    isValid = false;
  }

  if (!emailRegex.test(formData.email)) {
    newErrors.email = "Email inválido";
    isValid = false;
  }

  if (!formData.phone.trim()) {
    newErrors.phone = "Telefone é obrigatório";
    isValid = false;
  }

  if (!canRegister || !formData.cityId) {
    newErrors.city = "Selecione uma cidade";
    isValid = false;
  }

  if (formData.senha.length < 8) {
    newErrors.senha = "Senha deve ter no mínimo 8 caracteres (requisito da API)";
    isValid = false;
  }

  if (formData.senha !== formData.confirmarSenha) {
    newErrors.confirmarSenha = "As senhas não coincidem";
    isValid = false;
  }

  return { errors: newErrors, isValid };
}
