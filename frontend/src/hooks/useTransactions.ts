import { useState } from 'react';
import api from '../api/axios';

interface UseBuyPackageOptions {
  onCompleted?: () => void;
  onError?: (error: any) => void;
}

export const useBuyPackageMutation = (options?: UseBuyPackageOptions) => {
  const [loading, setLoading] = useState(false);

  const buyPackage = async (packageId: string) => {
    setLoading(true);
    try {
      const res = await api.post('/transactions/buy', { packageId });
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
