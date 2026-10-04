import { apiClient } from '../../../../core/network/apiClient';
import { ENDPOINTS } from '../../../../core/constants/apiEndpoints';

export const reportRemoteDataSource = {
  daily: () => apiClient.get(ENDPOINTS.REPORTS.DAILY),
  byService: () => apiClient.get(ENDPOINTS.REPORTS.SERVICES),
  byStaff: () => apiClient.get(ENDPOINTS.REPORTS.STAFF),
  queue: () => apiClient.get(ENDPOINTS.REPORTS.QUEUE),
};
