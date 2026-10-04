import { authRemoteDataSource } from '../datasources/authRemoteDataSource';
import { userModelFromJson } from '../models/userModel';
import { setToken, setStoredUser, clearSession } from '../../../../core/storage/localStorage';

// Implementation sa domain/repositories/authRepository.js
// Diri gi-combine ang remote datasource + local storage (token persistence).
export const authRepositoryImpl = {
  async login(email, password) {
    const res = await authRemoteDataSource.login(email, password);
    const user = userModelFromJson(res.user);
    await setToken(res.access_token);
    await setStoredUser(user);
    return user;
  },

  async register(payload) {
    const res = await authRemoteDataSource.register(payload);
    return userModelFromJson(res.user ?? res);
  },

  async logout() {
    try {
      await authRemoteDataSource.logout();
    } finally {
      await clearSession();
    }
  },

  async getCurrentUser() {
    const res = await authRemoteDataSource.me();
    return userModelFromJson(res);
  },
};
