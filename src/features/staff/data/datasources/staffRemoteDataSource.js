import { apiClient } from '../../../../core/network/apiClient';
import { ENDPOINTS } from '../../../../core/constants/apiEndpoints';

export const staffRemoteDataSource = {
  list: () => apiClient.get(ENDPOINTS.STAFF.LIST),
  detail: (id) => apiClient.get(ENDPOINTS.STAFF.DETAIL(id)),
  create: (payload) => apiClient.post(ENDPOINTS.STAFF.LIST, payload),
  update: (id, payload) => apiClient.patch(ENDPOINTS.STAFF.DETAIL(id), payload),
  remove: (id) => apiClient.delete(ENDPOINTS.STAFF.DETAIL(id)),
};
