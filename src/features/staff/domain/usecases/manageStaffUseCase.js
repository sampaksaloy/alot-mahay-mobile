import { staffRepositoryImpl } from '../../data/repositories/staffRepositoryImpl';

// Gamiton sa ADMIN: create/update/remove staff
export const manageStaffUseCase = {
  list: () => staffRepositoryImpl.list(),
  create: (payload) => staffRepositoryImpl.create(payload),
  update: (id, payload) => staffRepositoryImpl.update(id, payload),
  remove: (id) => staffRepositoryImpl.remove(id),
};
