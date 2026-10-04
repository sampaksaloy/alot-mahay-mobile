import { apiClient } from '../../../../core/network/apiClient';
import { ENDPOINTS } from '../../../../core/constants/apiEndpoints';

// Admin: list/manage customer accounts (gamit sa GET /users endpoint)
export const manageCustomerUseCase = {
  list: () => apiClient.get(ENDPOINTS.USERS.LIST),
};
