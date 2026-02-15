
import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  RotateCw,
  Gamepad2,
  Trophy,
  BarChart3,
  ArrowDownCircle,
  ArrowUpCircle,
  Percent,
  PackagePlus,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, category: 'Main' },
    { id: 'users', label: 'Manage Users', icon: Users, category: 'Administration' },
    { id: 'products', label: 'Store Manager', icon: PackagePlus, category: 'Administration' },
    { id: 'deposits', label: 'Deposit Queue', icon: ArrowDownCircle, category: 'Finance' },
    { id: 'withdrawals', label: 'Withdrawal Queue', icon: ArrowUpCircle, category: 'Finance' },
    { id: 'interest', label: 'ROI Engine', icon: Percent, category: 'Finance' },
    { id: 'chakkri', label: 'Spin Controller', icon: RotateCw, category: 'Gaming' },
    { id: 'game', label: 'Markets', icon: Gamepad2, category: 'Gaming' },
    { id: 'result', label: 'Results', icon: Trophy, category: 'Gaming' },
    { id: 'report', label: 'Analytics', icon: BarChart3, category: 'Reports' },
    { id: 'settings', label: 'Settings', icon: Settings, category: 'System' },
  ];

  const categories = ['Main', 'Administration', 'Finance', 'Gaming', 'Reports', 'System'];

  return (
    <aside className={`fixed left-0 top-0 z-40 h-screen bg-slate-950 text-white transition-all duration-500 ease-in-out border-r border-slate-800/50 ${isOpen ? 'w-72' : 'w-24'}`}>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-6 mb-4">
          <div className={`flex items-center gap-4 overflow-hidden transition-all duration-500 ${!isOpen && 'w-0 opacity-0'}`}>
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white shadow-xl shadow-indigo-600/30 text-xl border border-indigo-500/50">I</div>
            <div>
              <span className="block font-black text-2xl tracking-tighter leading-none">Indra Market</span>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] mt-1">Admin Pro</span>
            </div>
          </div>
          <button onClick={() => setIsOpen(!isOpen)} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all shadow-inner">
            {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-8 overflow-y-auto no-scrollbar py-4">
          {categories.map(category => {
            const items = menuItems.filter(item => item.category === category);
            if (items.length === 0) return null;
            return (
              <div key={category} className="space-y-2">
                {isOpen && <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">{category}</p>}
                <div className="space-y-1">
                  {items.map((item) => (
                    <button key={item.id} onClick={() => setActiveTab(item.id)} className={`group relative flex items-center w-full p-4 rounded-2xl transition-all duration-300 ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30 font-bold' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                      <item.icon size={22} className={`${activeTab === item.id ? 'scale-110' : 'group-hover:scale-110'} transition-transform`} />
                      <span className={`ml-4 text-sm font-semibold transition-all duration-500 whitespace-nowrap ${!isOpen && 'opacity-0 pointer-events-none'}`}>{item.label}</span>
                      {activeTab === item.id && <div className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full" />}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-900 bg-slate-950/50">
          {isOpen ? (
            <div className="p-4 bg-slate-900/50 rounded-3xl border border-slate-800 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-white shadow-lg overflow-hidden border border-indigo-400/30">
                <img src="https://picsum.photos/seed/admin/100/100" className="w-full h-full object-cover" alt="Admin" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-white truncate">Master Admin</p>
                <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5 flex items-center gap-1"><ShieldCheck size={10} /> Verified</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 py-4">
              <button className="p-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl transition-all"><ShieldCheck size={20} /></button>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
