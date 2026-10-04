// Base URL sa FastAPI backend. Ilisi kung deployed na.
export const BASE_URL = 'http://10.0.2.2:8000'; // 10.0.2.2 = localhost sa Android emulator

export const ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USERS: {
    ME: '/users/me',
    LIST: '/users',
  },
  SERVICES: {
    LIST: '/services',
    DETAIL: (id) => `/services/${id}`,
  },
  STAFF: {
    LIST: '/staff',
    DETAIL: (id) => `/staff/${id}`,
  },
  QUEUE: {
    CREATE: '/queues',
    MY: '/queues/my',
    TODAY: '/queues/today',
    DETAIL: (id) => `/queues/${id}`,
    UPDATE_STATUS: (id) => `/queues/${id}/status`,
  },
  RATINGS: {
    CREATE: '/ratings',
    LIST: '/ratings',
  },
  NOTIFICATIONS: {
    LIST: '/notifications',
    MARK_READ: (id) => `/notifications/${id}/read`,
  },
  REPORTS: {
    DAILY: '/reports/daily',
    SERVICES: '/reports/services',
    STAFF: '/reports/staff',
    QUEUE: '/reports/queue',
  },
  PREDICTION: {
    WAITING_TIME: (queueId) => `/prediction/waiting-time/${queueId}`,
  },
};
