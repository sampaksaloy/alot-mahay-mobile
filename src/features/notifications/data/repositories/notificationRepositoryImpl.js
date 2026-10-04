import { notificationRemoteDataSource } from '../datasources/notificationRemoteDataSource';

export const notificationRepositoryImpl = {
  list: () => notificationRemoteDataSource.list(),
  markRead: (id) => notificationRemoteDataSource.markRead(id),
};
