import { apiClient } from '../../../../core/network/apiClient';
import { ENDPOINTS } from '../../../../core/constants/apiEndpoints';

export const predictionRemoteDataSource = {
  getWaitingTime: (queueId) => apiClient.get(ENDPOINTS.PREDICTION.WAITING_TIME(queueId)),
};
