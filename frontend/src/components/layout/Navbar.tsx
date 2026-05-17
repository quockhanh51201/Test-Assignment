import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogOut, LayoutDashboard, PackageSearch } from 'lucide-react';
import { Button } from '../common/Button';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  return (
    <nav className="bg-surface border-b border-slate-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-primary">SaaS<span className="text-slate-800">Credits</span></h1>
            
            <div className="hidden md:flex gap-4">
              <Link to="/dashboard" className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${location.pathname === '/dashboard' ? 'bg-blue-50 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
                <LayoutDashboard className="w-4 h-4" /> Tổng quan
              </Link>
              <Link to="/packages" className={`flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${location.pathname === '/packages' ? 'bg-blue-50 text-primary' : 'text-slate-600 hover:bg-slate-50'}`}>
                <PackageSearch className="w-4 h-4" /> Mua Credits
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-sm text-slate-600">
              Xin chào, <span className="font-semibold text-slate-800">{user.username}</span>
            </div>
            <Button variant="outline" onClick={logout} className="gap-2 text-sm px-3 py-1.5 h-auto">
              <LogOut className="w-4 h-4" /> Thoát
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
