import { getStoredUser } from '../../../../core/storage/localStorage';
import { mockDataStore } from '../../../../core/data/mockDataStore';

export async function getMyProfileUseCase() {
  const stored = await getStoredUser();
  if (!stored) return null;
  // Get fresh data from mock store
  const user = mockDataStore.getUserById(stored.id);
  if (!user) return stored;
  const { password, ...safe } = user;
  return safe;
}
