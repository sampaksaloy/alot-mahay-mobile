import { authRepositoryImpl } from '../../data/repositories/authRepositoryImpl';
import { isValidEmail, isValidPhone, isValidPassword, passwordsMatch } from '../../../../core/utils/validators';

export async function registerUseCase({ name, email, phone, password, confirmPassword, role = 'CUSTOMER', staffType, specialization }) {
  if (!isValidPhone(phone)) throw new Error('Invalid phone number format');
  if (!isValidEmail(email)) throw new Error('Invalid email format');
  if (!isValidPassword(password)) throw new Error('Password must be at least 6 characters');
  if (!passwordsMatch(password, confirmPassword)) throw new Error('Passwords do not match');

  return authRepositoryImpl.register({ name, email, phone, password, role, staffType, specialization });
}
