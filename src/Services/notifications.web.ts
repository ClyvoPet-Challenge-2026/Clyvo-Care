import type { AppointmentApiDTO } from '../Types/clinical';
import type { NotificationDelivery, NotificationPermissionStatus } from '../Types/notifications';

export async function prepareNotificationPermission(): Promise<NotificationPermissionStatus> { return 'unavailable'; }
export async function sendAppointmentNotification(_appointment: AppointmentApiDTO, _ownerId: number): Promise<NotificationDelivery> { return 'unavailable'; }
