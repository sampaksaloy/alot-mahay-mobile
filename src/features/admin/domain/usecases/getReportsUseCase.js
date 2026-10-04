import { reportRepositoryImpl } from '../../data/repositories/reportRepositoryImpl';

export const getReportsUseCase = {
  daily: () => reportRepositoryImpl.daily(),
  byService: () => reportRepositoryImpl.byService(),
  byStaff: () => reportRepositoryImpl.byStaff(),
  queue: () => reportRepositoryImpl.queue(),
};
