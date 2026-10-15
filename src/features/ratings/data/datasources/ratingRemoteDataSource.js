import { mockDataStore } from '../../../../core/data/mockDataStore';
import { getStoredUser } from '../../../../core/storage/localStorage';

const MOCK_DELAY = 400;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const ratingRemoteDataSource = {
  async create(payload) {
    await delay(MOCK_DELAY);
    const user = await getStoredUser();
    // Check if already rated
    const existing = mockDataStore.getRatingByQueueId(payload.queue_id);
    if (existing) throw new Error('You already rated this service');
    return mockDataStore.addRating({
      queueId: payload.queue_id,
      customerId: user?.id || '1',
      customerName: user?.name || 'Unknown',
      rating: payload.rating,
      feedback: payload.feedback || '',
    });
  },
  async list() {
    await delay(MOCK_DELAY);
    return mockDataStore.getRatings();
  },
};
