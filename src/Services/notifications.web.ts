import type { AppointmentApiDTO } from '../Types/clinical';
import type { NotificationDelivery, PermissaoNotificacoes } from '../Types/notifications';

export async function prepararPermissao(): Promise<PermissaoNotificacoes> { return 'indisponivel'; }
export async function enviarNotificacaoAgendamento(_appointment: AppointmentApiDTO, _ownerId: number): Promise<NotificationDelivery> { return 'unavailable'; }
