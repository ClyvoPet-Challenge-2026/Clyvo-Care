import { formatPhone } from "./formatters";
import type { OwnerApiDTO, ProfileFormValues, RegisterFormData } from "../Types/types";

export function profileToForm(owner?: OwnerApiDTO | null): ProfileFormValues {
  return {
    name: owner?.name ?? "",
    email: owner?.email ?? "",
    phone: formatPhone(owner?.phone ?? ""),
    cpf: owner?.cpf ?? "",
    password: "",
    cityId: owner?.city?.id ?? 0,
    stateId: owner?.city?.state?.id ?? null,
  };
}

export function validateProfileUpdate(values: ProfileFormValues): string | null {
  if (values.password.length < 8 || values.password.length > 100 || !values.password.trim()) {
    return "Informe uma senha entre 8 e 100 caracteres. A atualização de perfil exige uma senha; ela será a senha de acesso após salvar.";
  }
  if (!values.cpf.replace(/\D/g, "")) return "Não foi possível obter o CPF do seu perfil. Entre novamente antes de editar.";
  if (!values.name.trim()) return "O nome não pode estar em branco.";
  if (!values.phone.trim()) return "O telefone não pode estar em branco.";
  if (!values.cityId) return "Por favor selecione uma cidade.";
  return null;
}

export function profileToPayload(values: ProfileFormValues): RegisterFormData {
  return {
    name: values.name.trim(),
    email: values.email.trim(),
    cpf: values.cpf.replace(/\D/g, ""),
    phone: values.phone.trim(),
    cityId: values.cityId,
    senha: values.password,
  };
}
