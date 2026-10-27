import type { ReactNode } from 'react';
import type { NotificacoesContextValor } from '../Types/notifications';

export function NotificacoesProvider({ children }: { children: ReactNode }) { return <>{children}</>; }
export function useNotificacoes(): NotificacoesContextValor {
  return {
    status: 'indisponivel', motivo: 'Notificações locais disponíveis no aplicativo Android/iOS.',
    tentarNovamente: async () => 'indisponivel', notificarAgendamento: async () => 'unavailable',
    consumirNavegacaoPendente: () => {},
  };
}
