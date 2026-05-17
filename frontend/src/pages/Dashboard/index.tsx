import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { LoadingState } from '../../components/common/LoadingState';
import { ErrorState } from '../../components/common/ErrorState';
import { EmptyState } from '../../components/common/EmptyState';
import { Coins, Zap, Receipt } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/common/Button';

export const Dashboard: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchDashboard = async () => {
    setLoading(true);
    setError(null);
    try {
      // Assuming GET /users/me returns { credits, unlockedFeatures, transactions } via transform interceptor
      const res = await api.get('/users/me');
      setData(res.data);
    } catch (err: any) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (error) return <ErrorState error={error} onRetry={fetchDashboard} title="Không tải được dữ liệu" />;
  if (loading && !data) return <LoadingState message="Đang đồng bộ dữ liệu tài khoản..." />;

  const credits = data?.userCredits?.[0]?.current_credits || 0;
  const features = data?.userFeatures || [];
  
  // Note: Transactions might be fetched via a separate API like /transactions/me depending on BE implementation
  // We'll display empty state for transactions if none

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Credits Card */}
        <div className="card bg-gradient-to-br from-blue-50 to-white border-blue-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 text-primary rounded-xl flex items-center justify-center">
              <Coins className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-slate-500 font-medium">Số dư hiện tại</h3>
              <div className="text-3xl font-extrabold text-slate-800">{credits} <span className="text-lg text-slate-500 font-medium">Credits</span></div>
            </div>
          </div>
          <Link to="/packages">
            <Button variant="outline" className="w-full mt-4 bg-white">Nạp thêm Credits</Button>
          </Link>
        </div>

        {/* Features Card */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-5 h-5 text-accent" />
            <h3 className="font-bold text-slate-800 text-lg">Tính năng đã mở khóa</h3>
          </div>
          {features.length === 0 ? (
            <p className="text-slate-500 text-sm">Bạn chưa mở khóa tính năng nào.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {features.map((f: any) => (
                <span key={f.id} className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full text-sm font-medium">
                  {f.feature?.name || `Tính năng ID: ${f.feature_id}`}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Transactions History */}
      <div className="card">
        <div className="flex items-center gap-3 mb-6">
          <Receipt className="w-5 h-5 text-slate-400" />
          <h3 className="font-bold text-slate-800 text-lg">Lịch sử giao dịch</h3>
        </div>
        
        {/* Empty state for transactions */}
        <EmptyState 
          icon={<Receipt />} 
          title="Chưa có giao dịch" 
          description="Lịch sử nạp credits của bạn sẽ hiển thị tại đây." 
          action={{ label: 'Xem các gói Credits', onClick: () => window.location.href = '/packages' }}
        />
      </div>
    </div>
  );
};
