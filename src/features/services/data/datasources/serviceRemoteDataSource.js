import { apiClient } from '../../../../core/network/apiClient';
import { ENDPOINTS } from '../../../../core/constants/apiEndpoints';

export const serviceRemoteDataSource = {
  list: () => apiClient.get(ENDPOINTS.SERVICES.LIST),
  detail: (id) => apiClient.get(ENDPOINTS.SERVICES.DETAIL(id)),
  create: (payload) => apiClient.post(ENDPOINTS.SERVICES.LIST, payload),
  update: (id, payload) => apiClient.patch(ENDPOINTS.SERVICES.DETAIL(id), payload),
  remove: (id) => apiClient.delete(ENDPOINTS.SERVICES.DETAIL(id)),
};
