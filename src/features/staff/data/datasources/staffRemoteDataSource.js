import { mockDataStore } from '../../../../core/data/mockDataStore';

const MOCK_DELAY = 400;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const staffRemoteDataSource = {
  async list() {
    await delay(MOCK_DELAY);
    return mockDataStore.getStaff();
  },
  async detail(id) {
    await delay(MOCK_DELAY);
    const s = mockDataStore.getStaffById(id);
    if (!s) throw new Error('Staff not found');
    return s;
  },
  async create(payload) {
    await delay(MOCK_DELAY);
    return mockDataStore.addStaff(payload);
  },
  async update(id, payload) {
    await delay(MOCK_DELAY);
    const s = mockDataStore.updateStaff(id, payload);
    if (!s) throw new Error('Staff not found');
    return s;
  },
  async remove(id) {
    await delay(MOCK_DELAY);
    mockDataStore.removeStaff(id);
    return { success: true };
  },
};
