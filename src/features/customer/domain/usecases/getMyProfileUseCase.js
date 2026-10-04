import { authRepositoryImpl } from '../../../auth/data/repositories/authRepositoryImpl';

export async function getMyProfileUseCase() {
  return authRepositoryImpl.getCurrentUser();
}
