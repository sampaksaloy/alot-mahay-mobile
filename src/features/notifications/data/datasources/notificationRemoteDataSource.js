import { mockDataStore } from '../../../../core/data/mockDataStore';
import { getStoredUser } from '../../../../core/storage/localStorage';

const MOCK_DELAY = 300;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const notificationRemoteDataSource = {
  async list() {
    await delay(MOCK_DELAY);
    const user = await getStoredUser();
    if (!user) return [];
    return mockDataStore.getNotificationsByUserId(user.id);
  },
  async markRead(id) {
    await delay(200);
    return mockDataStore.markNotificationRead(id);
  },
};
