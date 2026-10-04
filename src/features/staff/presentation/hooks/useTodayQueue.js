import { useState, useCallback, useEffect } from 'react';
import { getTodayQueueUseCase } from '../../domain/usecases/getTodayQueueUseCase';
import { updateQueueStatusUseCase } from '../../../queue/domain/usecases/updateQueueStatusUseCase';
import { QUEUE_STATUS } from '../../../../core/constants/strings';

export function useTodayQueue() {
  const [queueList, setQueueList] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getTodayQueueUseCase();
      setQueueList(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const callNext = useCallback(async (id) => {
    await updateQueueStatusUseCase(id, QUEUE_STATUS.CALLED);
    refresh();
  }, [refresh]);

  const startService = useCallback(async (id) => {
    await updateQueueStatusUseCase(id, QUEUE_STATUS.IN_SERVICE);
    refresh();
  }, [refresh]);

  const completeService = useCallback(async (id) => {
    await updateQueueStatusUseCase(id, QUEUE_STATUS.COMPLETED);
    refresh();
  }, [refresh]);

  const skipCustomer = useCallback(async (id) => {
    await updateQueueStatusUseCase(id, QUEUE_STATUS.SKIPPED);
    refresh();
  }, [refresh]);

  return { queueList, loading, refresh, callNext, startService, completeService, skipCustomer };
}
