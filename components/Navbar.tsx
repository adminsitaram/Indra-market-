
import React from 'react';
import { Search, Bell, LogOut, User } from 'lucide-react';

interface NavbarProps {
  sidebarOpen: boolean;
  onLogout?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ sidebarOpen, onLogout }) => {
  return (
    <header 
      className={`fixed top-0 right-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 transition-all duration-300 ${
        sidebarOpen ? 'left-64' : 'left-20'
      }`}
    >
      <div className="h-full flex items-center justify-between px-6">
        {/* Search */}
        <div className="relative w-96 hidden md:block">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </span>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
            placeholder="Search analytics, users, reports..."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
          </button>
          
          <div className="h-8 w-px bg-slate-200"></div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 group p-1 pr-3 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
              <div className="w-9 h-9 bg-indigo-600 text-white rounded-full flex items-center justify-center font-semibold overflow-hidden">
                <img src="https://picsum.photos/seed/admin/100/100" alt="Avatar" className="w-full h-full object-cover" />
              </div>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-slate-700 leading-tight">Admin User</p>
                <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Master Admin</p>
              </div>
            </div>
            {onLogout && (
              <button 
                onClick={onLogout}
                className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-100 transition-all border border-rose-100"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
