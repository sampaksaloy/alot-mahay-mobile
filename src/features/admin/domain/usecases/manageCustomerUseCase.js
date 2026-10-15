import { mockDataStore } from '../../../../core/data/mockDataStore';

const MOCK_DELAY = 400;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

// Admin: list/manage customer accounts
export const manageCustomerUseCase = {
  async list() {
    await delay(MOCK_DELAY);
    return mockDataStore.getCustomers().map(({ password, ...u }) => u);
  },
  async update(id, data) {
    await delay(MOCK_DELAY);
    const u = mockDataStore.updateUser(id, data);
    if (!u) throw new Error('Customer not found');
    const { password, ...safe } = u;
    return safe;
  },
  async toggleStatus(id) {
    await delay(MOCK_DELAY);
    const user = mockDataStore.getUserById(id);
    if (!user) throw new Error('Customer not found');
    const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const u = mockDataStore.updateUser(id, { status: newStatus });
    const { password, ...safe } = u;
    return safe;
  },
};
