import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from '../Types/types';

// Referência compartilhada pelo container e pelo listener de notificações.
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
