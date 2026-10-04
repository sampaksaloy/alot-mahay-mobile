import { useState, useCallback, useEffect } from 'react';
import { getServicesUseCase } from '../../domain/usecases/getServicesUseCase';

export function useServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchServices = useCallback(async () => {
    setLoading(true);
    try {
      const list = await getServicesUseCase();
      setServices(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return { services, loading, refresh: fetchServices };
}
