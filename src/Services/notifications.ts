import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { CANAL_PADRAO, prepararCanalAndroid } from '../Lib/notificacoes';
import type { AppointmentApiDTO } from '../Types/clinical';
import type { NotificationDelivery, PermissaoNotificacoes } from '../Types/notifications';

export async function prepararPermissao(): Promise<PermissaoNotificacoes> {
  try {
    await prepararCanalAndroid();
    let permissao = await Notifications.getPermissionsAsync();
    const concedida = () => permissao.granted || permissao.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
    if (!concedida() && permissao.canAskAgain) permissao = await Notifications.requestPermissionsAsync();
    return concedida() ? 'concedida' : 'negada';
  } catch {
    return 'indisponivel';
  }
}

export async function enviarNotificacaoAgendamento(appointment: AppointmentApiDTO, ownerId: number): Promise<NotificationDelivery> {
  try {
    await Notifications.scheduleNotificationAsync({
      identifier: `appointment-${ownerId}-${appointment.id}`,
      content: {
        title: 'Consulta confirmada!',
        body: `Agendamento #${appointment.id} para ${new Date(appointment.scheduledAt).toLocaleString('pt-BR')}. Toque para ver seus pets.`,
        sound: 'default',
        data: { kind: 'appointment-created', ownerId, appointmentId: appointment.id, petId: appointment.petId },
      },
      trigger: Platform.OS === 'android' ? { channelId: CANAL_PADRAO } : null,
    });
    return 'sent';
  } catch {
    return 'unavailable';
  }
}
