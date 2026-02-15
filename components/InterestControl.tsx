
import React, { useState, useEffect } from 'react';
import { Percent, TrendingUp, Save, ShieldCheck, Zap, AlertCircle, RefreshCw, BarChart } from 'lucide-react';

const InterestControl: React.FC = () => {
  const [roi, setRoi] = useState<number>(0.5);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const savedRoi = localStorage.getItem('app_daily_roi');
    if (savedRoi) setRoi(Number(savedRoi));
    
    const savedStatus = localStorage.getItem('app_roi_status');
    if (savedStatus) setIsEnabled(savedStatus === 'enabled');
  }, []);

  const handleSave = () => {
    setIsUpdating(true);
    localStorage.setItem('app_daily_roi', roi.toString());
    localStorage.setItem('app_roi_status', isEnabled ? 'enabled' : 'disabled');
    
    setTimeout(() => {
      setIsUpdating(false);
      alert("Interest parameters updated globally for all members!");
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
            <div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                <TrendingUp className="text-indigo-600" size={32} />
                Daily ROI Engine
              </h3>
              <p className="text-slate-500 text-sm font-medium mt-1">Configure global point growth rewards for members holding balance.</p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={isEnabled}
                onChange={() => setIsEnabled(!isEnabled)}
              />
              <div className="w-14 h-8 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600"></div>
              <span className="ml-3 text-xs font-black uppercase tracking-widest text-slate-500">
                {isEnabled ? 'ACTIVE' : 'DISABLED'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
             <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block ml-1">Daily Interest Percentage (%)</label>
                <div className="relative group">
                   <Percent className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600" size={24} />
                   <input 
                      type="number" 
                      step="0.01"
                      className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] text-3xl font-black outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all"
                      value={roi}
                      onChange={(e) => setRoi(Number(e.target.value))}
                   />
                </div>
                <p className="text-xs text-slate-400 font-medium px-2">Recommended: 0.1% to 2.0% for sustainable growth.</p>
             </div>

             <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
                <div className="relative z-10">
                   <div className="flex items-center gap-3 mb-4">
                      <BarChart className="text-emerald-400" size={24} />
                      <h4 className="font-bold">Projected Payout</h4>
                   </div>
                   <div className="space-y-3">
                      <div className="flex justify-between text-xs opacity-70"><span>On Rs 1,00,000 Holding</span><span>Daily Profit</span></div>
                      <p className="text-3xl font-black">Rs {(1000 * roi).toLocaleString()}</p>
                      <div className="pt-2 border-t border-white/10 flex justify-between text-xs">
                        <span className="opacity-70">Monthly compounding</span>
                        <span className="text-emerald-400 font-bold">+{(roi * 30).toFixed(1)}%</span>
                      </div>
                   </div>
                </div>
                <Zap className="absolute -right-10 -bottom-10 w-40 h-40 text-white/5 rotate-12 group-hover:scale-110 transition-transform" />
             </div>
          </div>

          <div className={`p-6 rounded-3xl border flex items-start gap-4 transition-all mb-10 ${isEnabled ? 'bg-indigo-50 border-indigo-100' : 'bg-rose-50 border-rose-100'}`}>
             <AlertCircle className={isEnabled ? 'text-indigo-600' : 'text-rose-600'} size={24} />
             <div>
                <h4 className={`text-sm font-black uppercase tracking-tight ${isEnabled ? 'text-indigo-900' : 'text-rose-900'}`}>
                   {isEnabled ? 'System Logic Active' : 'System Logic Halted'}
                </h4>
                <p className={`text-xs font-medium mt-1 ${isEnabled ? 'text-indigo-700' : 'text-rose-700'}`}>
                   {isEnabled 
                      ? `All members with any balance will receive ${roi}% interest daily credited to their Interest Wallet.`
                      : 'No interest will be calculated or paid out to members until re-enabled.'}
                </p>
             </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={isUpdating}
            className="w-full py-6 bg-slate-900 text-white font-black text-lg rounded-[2.5rem] shadow-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3"
          >
             {isUpdating ? <RefreshCw className="animate-spin" size={24} /> : <ShieldCheck size={24} />}
             {isUpdating ? 'CALIBRATING SYSTEM...' : 'APPLY GLOBAL SETTINGS'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InterestControl;
