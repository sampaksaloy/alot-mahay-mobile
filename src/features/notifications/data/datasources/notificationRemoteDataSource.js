import { apiClient } from '../../../../core/network/apiClient';
import { ENDPOINTS } from '../../../../core/constants/apiEndpoints';

export const notificationRemoteDataSource = {
  list: () => apiClient.get(ENDPOINTS.NOTIFICATIONS.LIST),
  markRead: (id) => apiClient.patch(ENDPOINTS.NOTIFICATIONS.MARK_READ(id)),
};
