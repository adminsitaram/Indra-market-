
import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, 
  User, 
  Shield, 
  Bell, 
  Globe, 
  Smartphone, 
  MessageCircle, 
  Send,
  Save,
  Lock,
  Eye,
  EyeOff,
  QrCode,
  Upload,
  X,
  Image as ImageIcon,
  Users as UsersIcon,
  Gift,
  Zap,
  Percent,
  RefreshCcw as RefreshIcon,
  TrendingUp,
  Coins
} from 'lucide-react';
import { GameRates } from '../types';

interface SettingsPageProps {
  rates: GameRates;
  onUpdateRates: (r: GameRates) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ rates, onUpdateRates }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [barcodePreview, setBarcodePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [localRates, setLocalRates] = useState<GameRates>(rates);

  useEffect(() => {
    const saved = localStorage.getItem('admin_payment_barcode');
    if (saved) setBarcodePreview(saved);
  }, []);

  const handleSave = () => {
    setIsSaving(true);
    if (barcodePreview) {
      localStorage.setItem('admin_payment_barcode', barcodePreview);
    } else {
      localStorage.removeItem('admin_payment_barcode');
    }

    onUpdateRates(localRates);
    
    setTimeout(() => {
      setIsSaving(false);
      alert("Settings updated successfully! Global commission rates and bonuses are now active.");
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBarcodePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeBarcode = () => {
    setBarcodePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        <div className="xl:col-span-2 space-y-8">
          
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <User size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Admin Profile</h3>
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="Super Admin"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="admin@nexuspro.com"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div className="md:col-span-2 relative">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Change Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Enter new password"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <button 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-900 text-white flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-lg">
                <Percent size={20} />
              </div>
              <h3 className="font-bold">Market Payouts & Commissions</h3>
            </div>
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200 space-y-4">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Jodi Multiplier</h4>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">1:</span>
                    <input 
                      type="number" 
                      className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-2xl font-black text-indigo-600 outline-none"
                      value={localRates.jodi}
                      onChange={e => setLocalRates({...localRates, jodi: Number(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-200 space-y-4">
                  <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">Harup Multiplier</h4>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">1:</span>
                    <input 
                      type="number" 
                      className="w-full pl-10 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-2xl font-black text-indigo-600 outline-none"
                      value={localRates.harup}
                      onChange={e => setLocalRates({...localRates, harup: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              {/* Referral Logic Section */}
              <div className="p-8 bg-indigo-50/50 rounded-[2.5rem] border border-indigo-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-indigo-600 text-white rounded-xl shadow-lg">
                    <UsersIcon size={20} />
                  </div>
                  <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">Referral Commission Engine</h4>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Deposit Commission (%)</label>
                    <div className="relative">
                      <Percent className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="number" 
                        step="0.1"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500"
                        value={localRates.referralDepositPercentage}
                        onChange={e => setLocalRates({...localRates, referralDepositPercentage: Number(e.target.value)})}
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 font-medium">Referrer earns this % of downline's deposit.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Betting Commission (%)</label>
                    <div className="relative">
                      <Percent className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="number" 
                        step="0.1"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-indigo-600 outline-none focus:ring-2 focus:ring-indigo-500"
                        value={localRates.referralBetPercentage}
                        onChange={e => setLocalRates({...localRates, referralBetPercentage: Number(e.target.value)})}
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 font-medium">Referrer earns this % of downline's total bets.</p>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Join Bonus Increase (%)</label>
                    <div className="relative">
                      <Percent className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="number" 
                        step="1"
                        className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl font-bold text-emerald-600 outline-none focus:ring-2 focus:ring-indigo-500"
                        value={localRates.downlineJoinBonusPercentage}
                        onChange={e => setLocalRates({...localRates, downlineJoinBonusPercentage: Number(e.target.value)})}
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 font-medium">Extra bonus % for members joining via link.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                <MessageCircle size={20} />
              </div>
              <h3 className="font-bold text-slate-800">Support Channels</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                    <Smartphone size={16} className="text-slate-400" /> WhatsApp Number
                  </label>
                  <input type="text" placeholder="+91 98765 43210" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
                    <Send size={16} className="text-slate-400" /> Telegram Username
                  </label>
                  <input type="text" placeholder="nexus_support" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-400 text-sm" />
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center gap-3">
              <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                <Globe size={20} />
              </div>
              <h3 className="font-bold text-slate-800">App Configuration</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-800">Maintenance Mode</p>
                  <p className="text-xs text-slate-500">Disable app for all users</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:bg-indigo-600 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full"></div>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-50 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Min Bet Points</label>
                  <input type="number" defaultValue="10" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm" />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 space-y-4">
                <div>
                  <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
                     <Gift size={16} className="text-indigo-600" /> Base Join Bonus
                  </p>
                  <input type="number" defaultValue="100" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-40">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-2xl active:scale-95 disabled:opacity-70"
        >
          {isSaving ? <RefreshIcon size={20} className="animate-spin" /> : <Save size={20} />}
          {isSaving ? "Saving..." : "Save All Changes"}
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
