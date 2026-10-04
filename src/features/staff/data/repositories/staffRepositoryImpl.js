import { staffRemoteDataSource } from '../datasources/staffRemoteDataSource';
import { staffModelFromJson } from '../models/staffModel';

export const staffRepositoryImpl = {
  async list() {
    const res = await staffRemoteDataSource.list();
    return (res ?? []).map(staffModelFromJson);
  },
  async create(payload) {
    return staffModelFromJson(await staffRemoteDataSource.create(payload));
  },
  async update(id, payload) {
    return staffModelFromJson(await staffRemoteDataSource.update(id, payload));
  },
  async remove(id) {
    return staffRemoteDataSource.remove(id);
  },
};
