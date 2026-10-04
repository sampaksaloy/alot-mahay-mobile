import { useState, useCallback } from 'react';
import { loginUseCase } from '../../domain/usecases/loginUseCase';
import { registerUseCase } from '../../domain/usecases/registerUseCase';
import { logoutUseCase } from '../../domain/usecases/logoutUseCase';

// Presentation-level hook. Ang Screens mag-gamit ni, dili direkta sa usecases.
export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError('');
    try {
      const user = await loginUseCase({ email, password });
      return user;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (form) => {
    setLoading(true);
    setError('');
    try {
      const user = await registerUseCase(form);
      return user;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutUseCase();
    } finally {
      setLoading(false);
    }
  }, []);

  return { login, register, logout, loading, error };
}
