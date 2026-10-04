import { authRepositoryImpl } from '../../data/repositories/authRepositoryImpl';

export async function logoutUseCase() {
  return authRepositoryImpl.logout();
}
