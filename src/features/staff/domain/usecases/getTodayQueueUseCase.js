import { queueRepositoryImpl } from '../../../queue/data/repositories/queueRepositoryImpl';


export async function getTodayQueueUseCase() {
  return queueRepositoryImpl.getTodayQueue();
}
