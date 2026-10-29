import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, LogOut, UserCircle } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-[#FBF7EE] border-b border-[#DDD0B8] sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#581C87] flex items-center justify-center text-[#FAF5EB] shadow-md shadow-[#581C87]/20">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <span className="text-2xl font-bold text-[#260E36] tracking-tight">
                Biptya <span className="text-[#7E22CE]">Finances</span>
              </span>
              <span className="hidden sm:inline-block ml-2 px-2.5 py-0.5 text-xs font-semibold rounded-full bg-[#EED9F7] text-[#581C87] border border-[#DFBFEE]">
                Dashboard
              </span>
            </div>
          </div>

          {/* User profile & Logout */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EFE7D6] text-[#3B194E] border border-[#DDD0B8] text-xs font-semibold">
              <UserCircle className="w-4 h-4 text-[#7E22CE]" />
              <span className="max-w-[180px] truncate">{user?.email || 'User'}</span>
            </div>

            <button
              onClick={logout}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-[#3B194E] bg-[#EFE7D6] hover:bg-[#581C87] hover:text-[#FAF5EB] transition border border-[#DDD0B8]"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
