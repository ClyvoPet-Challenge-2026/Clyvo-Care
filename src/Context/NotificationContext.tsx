import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { useAuth } from './AuthContext';
import { navigationRef } from '../Navigation/navigationRef';
import { prepareNotificationPermission, sendAppointmentNotification } from '../Services/notifications';
import { parseAppointmentNotification } from '../Utils/notifications';
import type { NotificationContextValue, NotificationContextStatus } from '../Types/notifications';

const NotificationContext = createContext<NotificationContextValue | null>(null);

// Uma instância controla permissão e listeners, seguindo o mockmerce-app.
export function NotificationProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [status, setStatus] = useState<NotificationContextStatus>('checking');
  const [reason, setReason] = useState<string | null>(null);
  const session = useRef({ user, loading });
  session.current = { user, loading };
  const pendingNotification = useRef<Notifications.NotificationResponse | null>(null);
  const lastHandledIdentifier = useRef<string | null>(null);

  const requestPermission = useCallback(async () => {
    setStatus('checking');
    const result = await prepareNotificationPermission();
    setStatus(result);
    setReason(
      result === 'denied'
        ? 'Ative as notificações nas configurações do dispositivo.'
        : result === 'unavailable'
          ? 'Notificações indisponíveis neste dispositivo.'
          : null
    );
    return result;
  }, []);

  const notifyAppointment = useCallback<NotificationContextValue['notifyAppointment']>(async (appointment, ownerId) => {
    const permissionResult = await requestPermission();
    if (permissionResult !== 'granted') {
      return permissionResult === 'denied' ? 'denied' : 'unavailable';
    }
    const delivery = await sendAppointmentNotification(appointment, ownerId);
    if (delivery === 'unavailable') {
      setStatus('unavailable');
      setReason('A consulta foi salva, mas não foi possível enviar a notificação.');
    }
    return delivery;
  }, [requestPermission]);

  const consumePendingNavigation = useCallback(() => {
    const response = pendingNotification.current;
    if (!response || session.current.loading || !session.current.user) return;
    const data = parseAppointmentNotification(response.notification.request.content.data);
    if (
      data?.ownerId === session.current.user.id &&
      (!navigationRef.isReady() || !navigationRef.getRootState()?.routeNames.includes('MyPet'))
    ) {
      return;
    }
    pendingNotification.current = null;
    lastHandledIdentifier.current = response.notification.request.identifier;
    if (data?.ownerId === session.current.user.id) {
      navigationRef.navigate('MyPet');
    }
    void Notifications.clearLastNotificationResponseAsync().catch(() => {});
  }, []);

  // Apenas consulta na abertura. A solicitação acontece após salvar a consulta.
  useEffect(() => {
    let active = true;
    Notifications.getPermissionsAsync().then(permission => {
      if (active) {
        setStatus(permission.granted || permission.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ? 'granted' : 'denied');
      }
    }).catch(() => {
      if (active) setStatus('unavailable');
    });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;
    let receivedTap = false;
    function handleTap(response: Notifications.NotificationResponse) {
      if (!active || response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;
      if (lastHandledIdentifier.current === response.notification.request.identifier) return;
      pendingNotification.current = response;
      consumePendingNavigation();
    }
    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      receivedTap = true;
      handleTap(response);
    });
    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response && !receivedTap) handleTap(response);
    }).catch(() => {});
    return () => {
      active = false;
      subscription.remove();
    };
  }, [consumePendingNavigation]);

  useEffect(() => {
    consumePendingNavigation();
  }, [user?.id, loading, consumePendingNavigation]);

  return (
    <NotificationContext.Provider
      value={{
        status,
        reason,
        requestPermission,
        notifyAppointment,
        consumePendingNavigation,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications precisa estar dentro de um NotificationProvider');
  }
  return context;
}
