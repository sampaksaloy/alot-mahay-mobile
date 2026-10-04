import { reportRemoteDataSource } from '../datasources/reportRemoteDataSource';

export const reportRepositoryImpl = {
  daily: () => reportRemoteDataSource.daily(),
  byService: () => reportRemoteDataSource.byService(),
  byStaff: () => reportRemoteDataSource.byStaff(),
  queue: () => reportRemoteDataSource.queue(),
};
