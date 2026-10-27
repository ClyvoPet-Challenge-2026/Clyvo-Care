export interface AppointmentNotificationData {
  kind: "appointment-created";
  ownerId: number;
  appointmentId: number;
  petId: number;
}

export type NotificationDelivery = "sent" | "denied" | "unavailable";

export type PermissaoNotificacoes = 'concedida' | 'negada' | 'indisponivel';

export type StatusNotificacoes = 'verificando' | 'concedida' | 'negada' | 'indisponivel';
export interface NotificacoesContextValor {
  status: StatusNotificacoes;
  motivo: string | null;
  tentarNovamente: () => Promise<PermissaoNotificacoes>;
  notificarAgendamento: (appointment: import('./clinical').AppointmentApiDTO, ownerId: number) => Promise<NotificationDelivery>;
  consumirNavegacaoPendente: () => void;
}
