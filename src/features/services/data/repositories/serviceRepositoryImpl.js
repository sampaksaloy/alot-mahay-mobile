import { serviceRemoteDataSource } from '../datasources/serviceRemoteDataSource';
import { serviceModelFromJson } from '../models/serviceModel';

export const serviceRepositoryImpl = {
  async list() {
    const res = await serviceRemoteDataSource.list();
    return (res ?? []).map(serviceModelFromJson);
  },
  async create(payload) {
    const res = await serviceRemoteDataSource.create(payload);
    return serviceModelFromJson(res);
  },
  async update(id, payload) {
    const res = await serviceRemoteDataSource.update(id, payload);
    return serviceModelFromJson(res);
  },
  async remove(id) {
    return serviceRemoteDataSource.remove(id);
  },
};
