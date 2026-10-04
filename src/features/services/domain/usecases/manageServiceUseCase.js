import { serviceRepositoryImpl } from '../../data/repositories/serviceRepositoryImpl';

// Gamiton sa ADMIN: create/update/delete service
export const manageServiceUseCase = {
  create: (payload) => serviceRepositoryImpl.create(payload),
  update: (id, payload) => serviceRepositoryImpl.update(id, payload),
  remove: (id) => serviceRepositoryImpl.remove(id),
};
