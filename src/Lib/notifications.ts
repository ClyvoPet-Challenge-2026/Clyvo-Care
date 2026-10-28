import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export const DEFAULT_NOTIFICATION_CHANNEL = 'appointments';

// Instalado no import, antes dos componentes, como no mockmerce-app.
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function prepareAndroidNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(DEFAULT_NOTIFICATION_CHANNEL, {
    name: 'Agendamentos',
    description: 'Confirmações das consultas agendadas no ClyvoCare.',
    importance: Notifications.AndroidImportance.DEFAULT,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#1f6ae1',
  });
}
