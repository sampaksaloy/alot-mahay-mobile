import { mockDataStore } from '../../../../core/data/mockDataStore';

const MOCK_DELAY = 400;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const serviceRemoteDataSource = {
  async list() {
    await delay(MOCK_DELAY);
    return mockDataStore.getServices();
  },
  async detail(id) {
    await delay(MOCK_DELAY);
    const s = mockDataStore.getServiceById(id);
    if (!s) throw new Error('Service not found');
    return s;
  },
  async create(payload) {
    await delay(MOCK_DELAY);
    return mockDataStore.addService(payload);
  },
  async update(id, payload) {
    await delay(MOCK_DELAY);
    const s = mockDataStore.updateService(id, payload);
    if (!s) throw new Error('Service not found');
    return s;
  },
  async remove(id) {
    await delay(MOCK_DELAY);
    mockDataStore.removeService(id);
    return { success: true };
  },
};
