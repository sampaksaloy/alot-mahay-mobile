import { queueRepositoryImpl } from '../../data/repositories/queueRepositoryImpl';

// Generic: START_SERVICE, COMPLETE, SKIP, CANCEL
export async function updateQueueStatusUseCase(queueId, status) {
  return queueRepositoryImpl.updateStatus(queueId, status);
}
