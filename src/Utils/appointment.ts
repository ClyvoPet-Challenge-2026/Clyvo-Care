import { APPOINTMENT_REASONS } from "../Data/AppointmentData";
import type { AppointmentFormValues } from "../Types/types";
import type { CreateAppointmentDTO } from "../Types/clinical";

export function getAppointmentDates(now = new Date()) {
  return Array.from({ length: 4 }, (_, offset) => {
    const date = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate() + offset,
    );
    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return {
      value,
      label:
        offset === 0
          ? "Hoje"
          : offset === 1
            ? "Amanhã"
            : date.toLocaleDateString("pt-BR", { weekday: "short" }),
      sublabel: date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      }),
    };
  });
}

export function buildAppointmentRequest(
  values: AppointmentFormValues,
  now = new Date(),
): CreateAppointmentDTO {
  const petId = Number(values.petId);
  const clinicId = Number(values.clinicId);
  if (!Number.isSafeInteger(petId) || petId <= 0)
    throw new Error("Selecione um pet.");
  if (!Number.isSafeInteger(clinicId) || clinicId <= 0)
    throw new Error("Selecione uma clínica.");
  const reason = APPOINTMENT_REASONS.find((item) => item.id === values.reason);
  if (!reason) throw new Error("Selecione o motivo da consulta.");
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(values.date) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(values.time)
  )
    throw new Error("Selecione uma data e horário válidos.");
  const scheduledAt = new Date(`${values.date}T${values.time}:00`);
  const [year, month, day] = values.date.split("-").map(Number);
  if (
    scheduledAt.getFullYear() !== year ||
    scheduledAt.getMonth() + 1 !== month ||
    scheduledAt.getDate() !== day ||
    scheduledAt.getHours() !== Number(values.time.slice(0, 2))
  )
    throw new Error("Selecione uma data e horário válidos.");
  if (!Number.isFinite(scheduledAt.getTime()) || scheduledAt <= now)
    throw new Error("Selecione uma data e horário futuros.");
  if (values.notes.trim().length > 1000)
    throw new Error("As observações devem ter até 1000 caracteres.");
  return {
    petId,
    clinicId,
    eventType:
      values.reason === "vaccine"
        ? "VACCINATION"
        : values.reason === "return"
          ? "FOLLOW_UP"
          : "CONSULTATION",
    scheduledAt: scheduledAt.toISOString(),
    reason: reason.title,
    notes: values.notes.trim() || undefined,
  };
}
