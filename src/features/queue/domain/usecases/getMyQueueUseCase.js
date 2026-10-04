import { queueRepositoryImpl } from '../../data/repositories/queueRepositoryImpl';

export async function getMyQueueUseCase() {
  return queueRepositoryImpl.getMyQueue();
}
