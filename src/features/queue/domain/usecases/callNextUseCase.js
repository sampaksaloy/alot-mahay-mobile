import { queueRepositoryImpl } from '../../data/repositories/queueRepositoryImpl';
import { QUEUE_STATUS } from '../../../../core/constants/strings';

// Gamiton sa STAFF: "Call Next" button
export async function callNextUseCase(queueId) {
  return queueRepositoryImpl.updateStatus(queueId, QUEUE_STATUS.CALLED);
}
