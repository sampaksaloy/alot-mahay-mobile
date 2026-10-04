import { authRepositoryImpl } from '../../data/repositories/authRepositoryImpl';
import { isValidEmail } from '../../../../core/utils/validators';

export async function loginUseCase({ email, password }) {
  if (!email || !isValidEmail(email)) {
    throw new Error('Invalid email format');
  }
  if (!password) {
    throw new Error('Palihug sulat og password');
  }
  return authRepositoryImpl.login(email, password);
}
