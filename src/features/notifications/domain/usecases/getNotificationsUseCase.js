import { notificationRepositoryImpl } from '../../data/repositories/notificationRepositoryImpl';

export async function getNotificationsUseCase() {
  return notificationRepositoryImpl.list();
}
