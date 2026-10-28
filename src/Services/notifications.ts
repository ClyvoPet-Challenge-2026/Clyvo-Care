import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { DEFAULT_NOTIFICATION_CHANNEL, prepareAndroidNotificationChannel } from '../Lib/notifications';
import type { AppointmentApiDTO } from '../Types/clinical';
import type { NotificationDelivery, NotificationPermissionStatus } from '../Types/notifications';

export async function prepareNotificationPermission(): Promise<NotificationPermissionStatus> {
  try {
    await prepareAndroidNotificationChannel();
    let permission = await Notifications.getPermissionsAsync();
    const isGranted = () => permission.granted || permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL;
    if (!isGranted() && permission.canAskAgain) {
      permission = await Notifications.requestPermissionsAsync();
    }
    return isGranted() ? 'granted' : 'denied';
  } catch {
    return 'unavailable';
  }
}

export async function sendAppointmentNotification(appointment: AppointmentApiDTO, ownerId: number): Promise<NotificationDelivery> {
  try {
    await Notifications.scheduleNotificationAsync({
      identifier: `appointment-${ownerId}-${appointment.id}`,
      content: {
        title: 'Consulta confirmada!',
        body: `Agendamento #${appointment.id} para ${new Date(appointment.scheduledAt).toLocaleString('pt-BR')}. Toque para ver seus pets.`,
        sound: 'default',
        data: { kind: 'appointment-created', ownerId, appointmentId: appointment.id, petId: appointment.petId },
      },
      trigger: Platform.OS === 'android' ? { channelId: DEFAULT_NOTIFICATION_CHANNEL } : null,
    });
    return 'sent';
  } catch {
    return 'unavailable';
  }
}
