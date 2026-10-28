import type { ReactNode } from 'react';
import type { NotificationContextValue } from '../Types/notifications';

export function NotificationProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function useNotifications(): NotificationContextValue {
  return {
    status: 'unavailable',
    reason: 'Notificações locais disponíveis no aplicativo Android/iOS.',
    requestPermission: async () => 'unavailable',
    notifyAppointment: async () => 'unavailable',
    consumePendingNavigation: () => {},
  };
}
