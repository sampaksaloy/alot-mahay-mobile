import { apiClient } from '../../../../core/network/apiClient';
import { ENDPOINTS } from '../../../../core/constants/apiEndpoints';

export const queueRemoteDataSource = {
  join: ({ serviceId, staffId }) =>
    apiClient.post(ENDPOINTS.QUEUE.CREATE, { service_id: serviceId, staff_id: staffId }),

  myQueue: () => apiClient.get(ENDPOINTS.QUEUE.MY),

  todayQueue: () => apiClient.get(ENDPOINTS.QUEUE.TODAY),

  getById: (id) => apiClient.get(ENDPOINTS.QUEUE.DETAIL(id)),

  updateStatus: (id, status) =>
    apiClient.patch(ENDPOINTS.QUEUE.UPDATE_STATUS(id), { status }),

  cancel: (id) => apiClient.delete(ENDPOINTS.QUEUE.DETAIL(id)),
};
