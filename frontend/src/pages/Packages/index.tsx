import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { Button } from '../../components/common/Button';
import { Check, Package as PackageIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

interface Feature {
  id: string;
  name: string;
}

interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  credits: number;
  features: Feature[];
}

export const Packages: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [buyingId, setBuyingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchPackages = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/packages');
      // Axios interceptor maps response to response.data. The actual data is in res.data if the BE follows transform.interceptor structure {data, statusCode, message}
      // Wait, interceptor extracts response.data, so res here IS { statusCode, message, data }
      setPackages(res.data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
  }, []);

  const handleBuy = async (pkg: Package) => {
    if (buyingId) return;
    setBuyingId(pkg.id);
    
    try {
      await api.post('/transactions/buy', { packageId: pkg.id });
      toast.success(`Mua gói ${pkg.name} thành công!`);
      navigate('/dashboard');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Mua thất bại. Vui lòng thử lại.');
    } finally {
      setBuyingId(null);
    }
  };

  if (error) return <ErrorState error={error} onRetry={fetchPackages} title="Không tải được danh sách gói" />;
  if (loading && packages.length === 0) return <LoadingState message="Đang tải danh sách gói..." />;
  if (packages.length === 0) return <EmptyState icon={<PackageIcon />} title="Chưa có gói nào" description="Hệ thống đang cập nhật các gói Credit. Vui lòng quay lại sau." />;

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Chọn gói phù hợp với bạn</h2>
        <p className="text-slate-600 max-w-2xl mx-auto">Mua Credits để sử dụng các tính năng cao cấp của hệ thống. Nâng cấp bất cứ lúc nào bạn muốn.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {packages.map((pkg) => (
          <div key={pkg.id} className="card flex flex-col hover:shadow-md transition-shadow relative overflow-hidden">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-slate-800 mb-2">{pkg.name}</h3>
              <p className="text-slate-500 text-sm h-10">{pkg.description}</p>
            </div>
            
            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-extrabold text-slate-900">${pkg.price}</span>
              </div>
              <p className="text-primary font-bold mt-2">+{pkg.credits} Credits</p>
            </div>

            <ul className="space-y-3 mb-8 flex-grow">
              {pkg.features.map(f => (
                <li key={f.id} className="flex items-start gap-2 text-slate-600 text-sm">
                  <Check className="w-5 h-5 text-success shrink-0" />
                  <span>Mở khóa <strong className="text-slate-800">{f.name}</strong></span>
                </li>
              ))}
            </ul>

            <Button 
              className="w-full mt-auto" 
              onClick={() => handleBuy(pkg)}
              isLoading={buyingId === pkg.id}
              disabled={buyingId !== null} // Disable all buttons if one is processing
            >
              Mua ngay
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
