import { mockDataStore } from '../../../../core/data/mockDataStore';

const MOCK_DELAY = 300;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export const predictionRemoteDataSource = {
  async getWaitingTime(queueId) {
    await delay(MOCK_DELAY);
    const waitTime = mockDataStore.calculateWaitingTime(queueId);
    const position = mockDataStore.calculatePosition(queueId);
    return {
      estimated_wait_time: waitTime,
      position,
      method: 'deterministic',
      note: 'Estimated based on service durations of customers ahead in queue.',
    };
  },
};
