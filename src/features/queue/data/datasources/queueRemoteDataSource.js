import { mockDataStore } from '../../../../core/data/mockDataStore';
import { getStoredUser } from '../../../../core/storage/localStorage';

const MOCK_DELAY = 400;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const queueRemoteDataSource = {
  async join({ serviceId, staffId }) {
    await delay(MOCK_DELAY);
    const user = await getStoredUser();
    if (!user) throw new Error('Please log in first');
    return mockDataStore.joinQueue({
      customerId: user.id,
      customerName: user.name,
      serviceId,
      staffId,
    });
  },

  async myQueue() {
    await delay(MOCK_DELAY);
    const user = await getStoredUser();
    if (!user) return [];
    const tickets = mockDataStore.getQueueByCustomerId(user.id);
    // Recalculate wait times
    mockDataStore.recalculateAllWaitTimes();
    return tickets.map((t) => ({
      ...t,
      estimated_wait_time: mockDataStore.calculateWaitingTime(t.id),
      position: mockDataStore.calculatePosition(t.id),
    }));
  },

  async todayQueue() {
    await delay(MOCK_DELAY);
    mockDataStore.recalculateAllWaitTimes();
    return mockDataStore.getTodayQueue().map((t) => ({
      ...t,
      estimated_wait_time: mockDataStore.calculateWaitingTime(t.id),
      position: mockDataStore.calculatePosition(t.id),
    }));
  },

  async getById(id) {
    await delay(MOCK_DELAY);
    const t = mockDataStore.getQueueById(id);
    if (!t) throw new Error('Ticket not found');
    return {
      ...t,
      estimated_wait_time: mockDataStore.calculateWaitingTime(id),
      position: mockDataStore.calculatePosition(id),
    };
  },

  async updateStatus(id, status) {
    await delay(MOCK_DELAY);
    const ticket = mockDataStore.updateQueueStatus(id, status);
    mockDataStore.recalculateAllWaitTimes();
    return {
      ...ticket,
      estimated_wait_time: mockDataStore.calculateWaitingTime(id),
      position: mockDataStore.calculatePosition(id),
    };
  },

  async cancel(id) {
    await delay(MOCK_DELAY);
    return mockDataStore.cancelQueue(id);
  },
};
