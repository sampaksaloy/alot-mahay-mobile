import { queueRemoteDataSource } from '../datasources/queueRemoteDataSource';
import { queueModelFromJson } from '../models/queueModel';

export const queueRepositoryImpl = {
  async join(serviceId, staffId) {
    const res = await queueRemoteDataSource.join({ serviceId, staffId });
    return queueModelFromJson(res);
  },
  async getMyQueue() {
    const res = await queueRemoteDataSource.myQueue();
    return (res ?? []).map(queueModelFromJson);
  },
  async getTodayQueue() {
    const res = await queueRemoteDataSource.todayQueue();
    return (res ?? []).map(queueModelFromJson);
  },
  async updateStatus(id, status) {
    const res = await queueRemoteDataSource.updateStatus(id, status);
    return queueModelFromJson(res);
  },
  async cancel(id) {
    return queueRemoteDataSource.cancel(id);
  },
};
