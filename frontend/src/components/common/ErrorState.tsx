import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  error: Error | string;
  onRetry?: () => void;
  title?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ 
  error, 
  onRetry, 
  title = 'Đã xảy ra lỗi' 
}) => {
  const errorMessage = typeof error === 'string' ? error : error.message;

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-red-50 rounded-xl border border-red-100 max-w-md mx-auto my-8">
      <AlertCircle className="w-12 h-12 text-error mb-4" />
      <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-600 mb-6">{errorMessage}</p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Thử lại
        </Button>
      )}
    </div>
  );
};
