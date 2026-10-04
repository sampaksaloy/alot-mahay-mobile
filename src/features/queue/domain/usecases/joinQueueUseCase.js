import { queueRepositoryImpl } from '../../data/repositories/queueRepositoryImpl';

export async function joinQueueUseCase({ serviceId, staffId }) {
  if (!serviceId) throw new Error('Palihug pilia una ang service');
  return queueRepositoryImpl.join(serviceId, staffId);
}
