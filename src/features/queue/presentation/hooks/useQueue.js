import { useState, useCallback } from 'react';
import { joinQueueUseCase } from '../../domain/usecases/joinQueueUseCase';
import { getMyQueueUseCase } from '../../domain/usecases/getMyQueueUseCase';

export function useQueue() {
  const [queue, setQueue] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const joinQueue = useCallback(async (serviceId, staffId) => {
    setLoading(true);
    setError('');
    try {
      const ticket = await joinQueueUseCase({ serviceId, staffId });
      setQueue(ticket);
      return ticket;
    } catch (e) {
      setError(e.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshMyQueue = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getMyQueueUseCase();
      setQueue(list?.[0] ?? null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { queue, loading, error, joinQueue, refreshMyQueue };
}
