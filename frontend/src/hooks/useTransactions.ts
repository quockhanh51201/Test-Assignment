import { useState } from 'react';
import api from '../api/axios';

interface UseBuyPackageOptions {
  onCompleted?: any;
  onError?: (error: any) => void;
}

export const useBuyPackageMutation = (options?: UseBuyPackageOptions) => {
  const [loading, setLoading] = useState(false);

  const buyPackage = async (package_id: string) => {
    setLoading(true);
    try {
      const res = await api.post('/transactions/buy', { package_id });
      options?.onCompleted?.();
      return res;
    } catch (err: any) {
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return [buyPackage, { loading }] as const;
};

export const useTransactionsQuery = (
  options?: UseBuyPackageOptions,
) => {
  const [loading, setLoading] = useState(false);

  const getTransactions = async () => {
    setLoading(true);

    try {
      const res = await api.get('/transactions');

      const transactions = res.data ?? [];

      options?.onCompleted?.(transactions);

      return transactions;
    } catch (err: any) {
      options?.onError?.(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return [getTransactions, { loading }] as const;
};