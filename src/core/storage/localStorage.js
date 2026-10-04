import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/strings';

export const getToken = () => AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
export const setToken = (token) => AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
export const removeToken = () => AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);

export const getStoredUser = async () => {
  const raw = await AsyncStorage.getItem(STORAGE_KEYS.USER);
  return raw ? JSON.parse(raw) : null;
};
export const setStoredUser = (user) =>
  AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
export const removeStoredUser = () => AsyncStorage.removeItem(STORAGE_KEYS.USER);

export const clearSession = async () => {
  await removeToken();
  await removeStoredUser();
};
