import { authRepositoryImpl } from '../../data/repositories/authRepositoryImpl';
import { isValidEmail, isValidPhone, isValidPassword, passwordsMatch } from '../../../../core/utils/validators';

export async function registerUseCase({ name, email, phone, password, confirmPassword }) {
  if (!isValidPhone(phone)) throw new Error('Invalid phone number format');
  if (!isValidEmail(email)) throw new Error('Invalid email format');
  if (!isValidPassword(password)) throw new Error('Minimum 6 characters ang password');
  if (!passwordsMatch(password, confirmPassword)) throw new Error('Dili parehas ang password');

  return authRepositoryImpl.register({ name, email, phone, password });
}
