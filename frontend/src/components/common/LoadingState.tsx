import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
}

export const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = "Loading...", 
  fullScreen = false 
}) => {
  const containerClass = fullScreen 
    ? "fixed inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm z-50"
    : "flex flex-col items-center justify-center p-8 w-full";

  return (
    <div className={containerClass}>
      <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
      <p className="text-secondary font-medium">{message}</p>
    </div>
  );
};
