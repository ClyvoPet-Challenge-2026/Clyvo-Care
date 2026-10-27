import type { AppointmentNotificationData } from "../Types/notifications";

export function parseAppointmentNotification(
  data: unknown,
): AppointmentNotificationData | null {
  if (!data || typeof data !== "object") return null;
  const value = data as Record<string, unknown>;
  if (value.kind !== "appointment-created") return null;
  for (const key of ["ownerId", "appointmentId", "petId"]) {
    if (
      typeof value[key] !== "number" ||
      !Number.isSafeInteger(value[key]) ||
      (value[key] as number) <= 0
    )
      return null;
  }
  return value as unknown as AppointmentNotificationData;
}
