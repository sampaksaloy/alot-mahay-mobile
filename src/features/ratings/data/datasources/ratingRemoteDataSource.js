import { apiClient } from '../../../../core/network/apiClient';
import { ENDPOINTS } from '../../../../core/constants/apiEndpoints';

export const ratingRemoteDataSource = {
  create: (payload) => apiClient.post(ENDPOINTS.RATINGS.CREATE, payload),
  list: () => apiClient.get(ENDPOINTS.RATINGS.LIST),
};
