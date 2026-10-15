import { mockDataStore } from '../../../../core/data/mockDataStore';

const MOCK_DELAY = 400;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const reportRemoteDataSource = {
  async daily() {
    await delay(MOCK_DELAY);
    return mockDataStore.getDashboardStats();
  },
  async byService() {
    await delay(MOCK_DELAY);
    const tickets = mockDataStore.getTodayQueue();
    const serviceMap = {};
    tickets.forEach((t) => {
      if (!serviceMap[t.service_name]) {
        serviceMap[t.service_name] = { name: t.service_name, total: 0, completed: 0, revenue: 0 };
      }
      serviceMap[t.service_name].total++;
      if (t.status === 'COMPLETED') {
        serviceMap[t.service_name].completed++;
        const svc = mockDataStore.getServiceById(t.service_id);
        serviceMap[t.service_name].revenue += svc?.price || 0;
      }
    });
    return Object.values(serviceMap).sort((a, b) => b.total - a.total);
  },
  async byStaff() {
    await delay(MOCK_DELAY);
    const tickets = mockDataStore.getTodayQueue();
    const staffMap = {};
    tickets.forEach((t) => {
      if (!staffMap[t.staff_name]) {
        staffMap[t.staff_name] = { name: t.staff_name, total: 0, completed: 0, avgDuration: 0, durations: [] };
      }
      staffMap[t.staff_name].total++;
      if (t.status === 'COMPLETED') {
        staffMap[t.staff_name].completed++;
        if (t.started_at && t.completed_at) {
          staffMap[t.staff_name].durations.push(
            (new Date(t.completed_at) - new Date(t.started_at)) / 60000
          );
        }
      }
    });
    return Object.values(staffMap).map((s) => ({
      ...s,
      avgDuration: s.durations.length > 0
        ? Math.round(s.durations.reduce((a, b) => a + b, 0) / s.durations.length)
        : 0,
      durations: undefined,
    }));
  },
  async queue() {
    await delay(MOCK_DELAY);
    const stats = mockDataStore.getDashboardStats();
    return {
      statusDistribution: stats.statusDistribution,
      totalToday: mockDataStore.getTodayQueue().length,
      avgWaitTime: Math.round(
        mockDataStore.getTodayQueue()
          .filter((t) => t.status === 'COMPLETED' && t.joined_at && t.started_at)
          .reduce((sum, t) => sum + (new Date(t.started_at) - new Date(t.joined_at)) / 60000, 0) /
          Math.max(1, mockDataStore.getTodayQueue().filter((t) => t.status === 'COMPLETED').length)
      ),
    };
  },
};
