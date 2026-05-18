import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export interface Feature {
  id: string;
  name: string;
}

export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  credits: number;
  features: Feature[];
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export const useGetPackagesQuery = () => {
  const [data, setData] = useState<Package[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get<any, ApiResponse<Package[]>>('/packages');
      setData(res.data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch };
};
