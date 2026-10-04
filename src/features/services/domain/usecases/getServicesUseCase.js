import { serviceRepositoryImpl } from '../../data/repositories/serviceRepositoryImpl';

export async function getServicesUseCase() {
  return serviceRepositoryImpl.list();
}
