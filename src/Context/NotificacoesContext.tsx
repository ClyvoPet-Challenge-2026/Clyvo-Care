import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { useAuth } from './AuthContext';
import { navigationRef } from '../Navigation/navigationRef';
import { prepararPermissao, enviarNotificacaoAgendamento } from '../Services/notifications';
import { parseAppointmentNotification } from '../Utils/notifications';
import type { NotificacoesContextValor, StatusNotificacoes } from '../Types/notifications';

const NotificacoesContext = createContext<NotificacoesContextValor | null>(null);

// Uma instância controla permissão e listeners, seguindo o mockmerce-app.
export function NotificacoesProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const [status, setStatus] = useState<StatusNotificacoes>('verificando');
  const [motivo, setMotivo] = useState<string | null>(null);
  const sessao = useRef({ user, loading });
  sessao.current = { user, loading };
  const pendente = useRef<Notifications.NotificationResponse | null>(null);
  const ultimaTratada = useRef<string | null>(null);

  const tentarNovamente = useCallback(async () => {
    setStatus('verificando');
    const resultado = await prepararPermissao();
    setStatus(resultado);
    setMotivo(resultado === 'negada' ? 'Ative as notificações nas configurações do dispositivo.' : resultado === 'indisponivel' ? 'Notificações indisponíveis neste dispositivo.' : null);
    return resultado;
  }, []);

  const notificarAgendamento = useCallback<NotificacoesContextValor['notificarAgendamento']>(async (agendamento, ownerId) => {
    const resultado = await tentarNovamente();
    if (resultado !== 'concedida') return resultado === 'negada' ? 'denied' : 'unavailable';
    const entrega = await enviarNotificacaoAgendamento(agendamento, ownerId);
    if (entrega === 'unavailable') {
      setStatus('indisponivel');
      setMotivo('A consulta foi salva, mas não foi possível enviar a notificação.');
    }
    return entrega;
  }, [tentarNovamente]);

  const consumirNavegacaoPendente = useCallback(() => {
    const resposta = pendente.current;
    if (!resposta || sessao.current.loading || !sessao.current.user) return;
    const dados = parseAppointmentNotification(resposta.notification.request.content.data);
    if (dados?.ownerId === sessao.current.user.id &&
      (!navigationRef.isReady() || !navigationRef.getRootState()?.routeNames.includes('MyPet'))) return;
    pendente.current = null;
    ultimaTratada.current = resposta.notification.request.identifier;
    if (dados?.ownerId === sessao.current.user.id) navigationRef.navigate('MyPet');
    void Notifications.clearLastNotificationResponseAsync().catch(() => {});
  }, []);

  // Apenas consulta na abertura. A solicitação acontece após salvar a consulta.
  useEffect(() => {
    let ativo = true;
    Notifications.getPermissionsAsync().then(permissao => {
      if (ativo) setStatus(permissao.granted || permissao.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL ? 'concedida' : 'negada');
    }).catch(() => { if (ativo) setStatus('indisponivel'); });
    return () => { ativo = false; };
  }, []);

  useEffect(() => {
    let ativo = true;
    let recebeuToque = false;
    function tratarToque(resposta: Notifications.NotificationResponse) {
      if (!ativo || resposta.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;
      if (ultimaTratada.current === resposta.notification.request.identifier) return;
      pendente.current = resposta;
      consumirNavegacaoPendente();
    }
    const aoTocar = Notifications.addNotificationResponseReceivedListener(resposta => {
      recebeuToque = true;
      tratarToque(resposta);
    });
    Notifications.getLastNotificationResponseAsync().then(resposta => {
      if (resposta && !recebeuToque) tratarToque(resposta);
    }).catch(() => {});
    return () => { ativo = false; aoTocar.remove(); };
  }, [consumirNavegacaoPendente]);

  useEffect(() => { consumirNavegacaoPendente(); }, [user?.id, loading, consumirNavegacaoPendente]);

  return <NotificacoesContext.Provider value={{ status, motivo, tentarNovamente, notificarAgendamento, consumirNavegacaoPendente }}>{children}</NotificacoesContext.Provider>;
}

export function useNotificacoes(): NotificacoesContextValor {
  const contexto = useContext(NotificacoesContext);
  if (!contexto) throw new Error('useNotificacoes precisa estar dentro de um NotificacoesProvider');
  return contexto;
}
