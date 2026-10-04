import { predictionRemoteDataSource } from '../../data/datasources/predictionRemoteDataSource';

// Phase 1 (basic): backend mo-sum sa estimated_duration sa mga customer ahead.
// Phase 2 (later): backend mo-gamit og ML model, pareho ra ni nga interface
// sa frontend side, dili na kinahanglan mausab ang mobile app.
export async function getWaitingTimeUseCase(queueId) {
  const res = await predictionRemoteDataSource.getWaitingTime(queueId);
  return res.estimated_wait_time;
}
