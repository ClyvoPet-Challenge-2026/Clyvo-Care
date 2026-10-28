import type { AppointmentApiDTO } from "./clinical";

export interface AppointmentNotificationData {
  kind: "appointment-created";
  ownerId: number;
  appointmentId: number;
  petId: number;
}

export type NotificationDelivery = "sent" | "denied" | "unavailable";

export type NotificationPermissionStatus = "granted" | "denied" | "unavailable";

export type NotificationContextStatus = "checking" | "granted" | "denied" | "unavailable";

export interface NotificationContextValue {
  status: NotificationContextStatus;
  reason: string | null;
  requestPermission: () => Promise<NotificationPermissionStatus>;
  notifyAppointment: (appointment: AppointmentApiDTO, ownerId: number) => Promise<NotificationDelivery>;
  consumePendingNavigation: () => void;
}
