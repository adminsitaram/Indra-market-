
import React, { useState, useEffect, useMemo, useRef } from 'react';
/* Added missing LayoutDashboard, Percent, and Users (aliased as UsersIcon) from lucide-react */
import { 
  Wallet, Trophy, Gamepad2, ArrowDownCircle, ArrowUpCircle, User as UserIcon, RotateCw, TrendingUp, QrCode, Menu, CreditCard, Star, Zap, Camera, Lock, Smartphone, Check, LogOut, ShieldAlert, Copy, ShieldCheck, RefreshCw, ShoppingBasket, BookOpen, Plus, UserCheck, LayoutDashboard, Percent, Users as UsersIcon
} from 'lucide-react';
import { Game, User, Transaction, GameResult, GameRates } from '../types';
import GamePlay from './GamePlay';

interface MemberPanelProps {
  games: Game[];
  results: GameResult[];
  member: User;
  onUpdateProfile: (updates: Partial<User>) => void;
  onAddTransaction: (tx: Partial<Transaction>) => void;
  onPlaceBetDetailed: (gameId: string, numbers: string[], amountPerNumber: number, type: string) => void;
  onLogout: () => void;
  transactions?: Transaction[];
  gameRates: GameRates;
}

interface Product {
  id: string;
  name: string;
  price: string;
  category: string;
  description: string;
  image: string | null;
}

const DEFAULT_SEGMENTS = ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100', 'Next day try'];
const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#10b981', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef'];

const MemberPanel: React.FC<MemberPanelProps> = ({ 
  games, 
  results, 
  member, 
  onUpdateProfile, 
  onAddTransaction, 
  onPlaceBetDetailed,
  onLogout,
  transactions = [],
  gameRates
}) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const depositFileRef = useRef<HTMLInputElement>(null);
  const profilePicRef = useRef<HTMLInputElement>(null);
  
  const [adminBarcode, setAdminBarcode] = useState<string | null>(null);
  const [roi, setRoi] = useState(0.5); 
  const [products, setProducts] = useState<Product[]>([]);
  const [segments, setSegments] = useState<string[]>(DEFAULT_SEGMENTS);

  const [profileForm, setProfileForm] = useState({
    name: member.name,
    mobile: member.mobile,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    avatar: member.avatar || `https://picsum.photos/seed/${member.id}/200/200`
  });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const [depositForm, setDepositForm] = useState({ amount: '', utr: '', screenshot: null as string | null });
  const [withdrawForm, setWithdrawForm] = useState({ amount: '', method: 'upi', details: '', screenshot: null as string | null });

  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [showWinCelebration, setShowWinCelebration] = useState(false);
  const [lastFreeSpin, setLastFreeSpin] = useState<number>(0);
  const [lastInterestClaim, setLastInterestClaim] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(Date.now());

  const { deposit, winner, spin, refer, interest } = member.wallets;
  const totalBalance = deposit + winner + spin + refer + interest;

  useEffect(() => {
    const savedBarcode = localStorage.getItem('admin_payment_barcode');
    if (savedBarcode) setAdminBarcode(savedBarcode);
    const savedRoi = localStorage.getItem('app_daily_roi');
    if (savedRoi) setRoi(Number(savedRoi));
    const savedProducts = localStorage.getItem('indra_store_products');
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    const savedSegments = localStorage.getItem('chakkri_segments');
    if (savedSegments) setSegments(JSON.parse(savedSegments));
    const savedLastSpin = localStorage.getItem(`last_spin_${member.id}`);
    if (savedLastSpin) setLastFreeSpin(Number(savedLastSpin));
    const savedLastInterest = localStorage.getItem(`last_interest_${member.id}`);
    if (savedLastInterest) setLastInterestClaim(Number(savedLastInterest));
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, [activeTab, member.id]);

  useEffect(() => {
    setProfileForm(prev => ({
      ...prev,
      name: member.name,
      mobile: member.mobile,
      avatar: member.avatar || prev.avatar
    }));
  }, [member]);

  const canFreeSpin = useMemo(() => (currentTime - lastFreeSpin) >= 24 * 60 * 60 * 1000, [lastFreeSpin, currentTime]);
  const canClaimInterest = useMemo(() => (currentTime - lastInterestClaim) >= 24 * 60 * 60 * 1000, [lastInterestClaim, currentTime]);

  const timeLeft = useMemo(() => {
    if (canFreeSpin) return null;
    const diff = 24 * 60 * 60 * 1000 - (currentTime - lastFreeSpin);
    const h = Math.floor(diff / (3600000));
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  }, [lastFreeSpin, currentTime, canFreeSpin]);

  const interestTimeLeft = useMemo(() => {
    if (canClaimInterest) return null;
    const diff = 24 * 60 * 60 * 1000 - (currentTime - lastInterestClaim);
    const h = Math.floor(diff / (3600000));
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return `${h}h ${m}m ${s}s`;
  }, [lastInterestClaim, currentTime, canClaimInterest]);

  const handleSpin = () => {
    if (isSpinning || !canFreeSpin) return;
    setIsSpinning(true);
    setShowWinCelebration(false);
    const spinTime = Date.now();
    setLastFreeSpin(spinTime);
    localStorage.setItem(`last_spin_${member.id}`, spinTime.toString());

    const forcedLabel = localStorage.getItem('chakkri_forced_result');
    let targetIndex = forcedLabel ? segments.indexOf(forcedLabel) : -1;
    if (targetIndex === -1) targetIndex = Math.floor(Math.random() * segments.length);

    const segmentAngle = 360 / segments.length;
    const extraSpins = (10 + Math.floor(Math.random() * 5)) * 360;
    const finalRotation = rotation + (360 - (rotation % 360)) + extraSpins + (360 - (targetIndex * segmentAngle + segmentAngle / 2));
    setRotation(finalRotation);
    
    setTimeout(() => {
      setIsSpinning(false);
      const res = segments[targetIndex];
      setLastResult(res);
      const winVal = parseInt(res);
      if (!isNaN(winVal) && winVal > 0) {
        setShowWinCelebration(true);
        onUpdateProfile({ wallets: { ...member.wallets, spin: member.wallets.spin + winVal } });
      }
    }, 6000);
  };

  const handleClaimInterest = () => {
    if (!canClaimInterest) return;
    const earning = (totalBalance * roi) / 100;
    if (earning <= 0) return alert("Holding balance required!");
    const now = Date.now();
    setLastInterestClaim(now);
    localStorage.setItem(`last_interest_${member.id}`, now.toString());
    onUpdateProfile({ wallets: { ...member.wallets, interest: member.wallets.interest + earning } });
    alert(`Rs ${earning.toFixed(2)} credited!`);
  };

  const handleUpdateProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (profileForm.newPassword) {
      if (profileForm.oldPassword !== member.password) return alert("Incorrect old password!");
      if (profileForm.newPassword !== profileForm.confirmPassword) return alert("New passwords do not match!");
    }
    setIsUpdatingProfile(true);
    setTimeout(() => {
      onUpdateProfile({ name: profileForm.name, mobile: profileForm.mobile, avatar: profileForm.avatar, password: profileForm.newPassword || member.password });
      setIsUpdatingProfile(false);
      setProfileForm(prev => ({ ...prev, oldPassword: '', newPassword: '', confirmPassword: '' }));
      alert("Profile updated in Indra Market system!");
    }, 1200);
  };

  const handleAddDeposit = () => {
    if(!depositForm.amount) return alert("Enter amount!");
    onAddTransaction({ amount: Number(depositForm.amount), reference: depositForm.utr || undefined, type: 'deposit', screenshot: depositForm.screenshot || undefined });
    alert("Submitted!");
    setDepositForm({ amount: '', utr: '', screenshot: null });
  };

  const handleAddWithdraw = () => {
    const withdrawAmount = Number(withdrawForm.amount);
    if(withdrawAmount > member.wallets.winner) return alert("Insufficient winner balance!");
    onAddTransaction({ amount: withdrawAmount, type: 'withdrawal', method: withdrawForm.method === 'upi' ? 'UPI' : 'Bank', paymentDetails: withdrawForm.details, screenshot: withdrawForm.screenshot || undefined });
    onUpdateProfile({ wallets: { ...member.wallets, winner: member.wallets.winner - withdrawAmount } });
    alert("Sent!");
    setWithdrawForm({ amount: '', method: 'upi', details: '', screenshot: null });
  };

  const memberIdPart = member.id.includes('-') ? member.id.split('-')[1] : member.id.replace(/\D/g, '') || '1001';
  const referLink = `${window.location.origin}/signup?ref=INDRA-${memberIdPart}`;

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'how-to-play', label: 'How to Play', icon: BookOpen },
    { id: 'rates', label: 'Game Rates', icon: Percent },
    { id: 'india-bazar-play', label: 'India Bazar Play', icon: Gamepad2 },
    { id: 'chakkri', label: 'Spin & Win', icon: RotateCw },
    { id: 'basket', label: 'Basket Store', icon: ShoppingBasket },
    { id: 'wallets', label: 'My Wallets', icon: CreditCard },
    { id: 'profile', label: 'My Profile', icon: UserIcon },
    { id: 'deposit', label: 'Add Cash', icon: ArrowDownCircle },
    { id: 'withdraw', label: 'Withdraw', icon: ArrowUpCircle },
    { id: 'refer', label: 'Refer & Earn', icon: UsersIcon },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden font-inter text-slate-900">
      {sidebarOpen && <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[55] lg:hidden" onClick={() => setSidebarOpen(false)} />}
      <aside className={`fixed inset-y-0 left-0 z-[60] w-72 bg-slate-900 text-white transform transition-all duration-500 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex flex-col h-full">
          <div className="p-8 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center font-black text-white shadow-xl text-xl">I</div>
              <div><span className="block font-black text-2xl tracking-tighter leading-none">Indra Market</span><span className="text-[10px] text-indigo-400 font-bold uppercase tracking-[0.2em] mt-1">Player Terminal</span></div>
            </div>
          </div>
          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto no-scrollbar py-6">
            {menuItems.map((item) => (
              <button key={item.id} onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                <item.icon size={22} /><span className="text-sm">{item.label}</span>
              </button>
            ))}
          </nav>
          <div className="p-4 border-t border-slate-800">
             <button onClick={onLogout} className="w-full flex items-center gap-3 p-4 text-slate-400 hover:text-white transition-all"><LogOut size={20} /> <span className="text-xs font-black uppercase">Log Out</span></button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen transition-all duration-500 lg:ml-72">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-3 text-slate-700 bg-slate-100 rounded-2xl"><Menu size={24} /></button>
          <h1 className="text-lg font-black text-slate-900 uppercase tracking-tight">{activeTab.replace(/-/g, ' ')}</h1>
          <div className="bg-emerald-50 px-5 py-2.5 rounded-2xl flex items-center gap-3">
             <div className="p-1.5 bg-emerald-600 rounded-lg text-white"><Wallet size={16} /></div>
             <p className="text-sm font-black text-slate-900">Rs {totalBalance.toLocaleString()}</p>
          </div>
        </header>

        <main className="p-6 md:p-8 max-w-6xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
              <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div>
                  <h3 className="text-indigo-200 text-sm font-black uppercase tracking-widest mb-2">Combined Assets</h3>
                  <p className="text-7xl font-black tracking-tighter">Rs {totalBalance.toLocaleString()}</p>
                  <div className="mt-8 flex flex-wrap gap-4">
                    <button onClick={handleClaimInterest} disabled={!canClaimInterest} className={`px-8 py-4 rounded-2xl font-black shadow-xl transition-all ${canClaimInterest ? 'bg-white text-indigo-600 hover:bg-indigo-50' : 'bg-slate-400 text-slate-100 cursor-not-allowed opacity-60'}`}>
                      {canClaimInterest ? 'CLAIM INTEREST' : `CLAIM IN: ${interestTimeLeft}`}
                    </button>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                 {[
                   { label: 'Deposit', val: deposit, color: 'blue', icon: Wallet },
                   { label: 'Winner', val: winner, color: 'emerald', icon: Trophy },
                   { label: 'Spin', val: spin, color: 'amber', icon: RotateCw },
                   { label: 'Refer', val: refer, color: 'purple', icon: UsersIcon },
                   { label: 'Interest', val: interest, color: 'indigo', icon: TrendingUp },
                 ].map((w) => (
                   <div key={w.label} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm transition-all group">
                      <div className={`w-10 h-10 bg-${w.color}-50 text-${w.color}-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}><w.icon size={20} /></div>
                      <p className="text-[10px] font-black text-slate-400 uppercase">{w.label}</p>
                      <p className="text-lg font-black text-slate-900 mt-1">Rs {w.val.toLocaleString()}</p>
                   </div>
                 ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-500 pb-20">
              <div className="bg-white rounded-[3rem] border border-slate-200 shadow-xl overflow-hidden">
                <div className="bg-slate-900 p-12 text-white flex flex-col md:flex-row items-center gap-10">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full border-4 border-indigo-600 overflow-hidden shadow-2xl relative">
                      <img src={profileForm.avatar} className="w-full h-full object-cover" alt="Profile" />
                      <button onClick={() => profilePicRef.current?.click()} className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Camera size={24} className="text-white" />
                      </button>
                    </div>
                    <input type="file" ref={profilePicRef} onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setProfileForm(prev => ({ ...prev, avatar: reader.result as string }));
                        reader.readAsDataURL(file);
                      }
                    }} className="hidden" accept="image/*" />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-3xl font-black uppercase tracking-tight">{member.name}</h2>
                    <p className="text-indigo-400 font-bold uppercase tracking-widest text-xs mt-1">Member ID: {member.id}</p>
                  </div>
                </div>
                <form onSubmit={handleUpdateProfileSubmit} className="p-12 space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Personal Details</h3>
                      <input type="text" required className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} />
                      <input type="tel" required maxLength={10} className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" value={profileForm.mobile} onChange={e => setProfileForm({...profileForm, mobile: e.target.value})} />
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest border-b border-slate-100 pb-2">Security</h3>
                      <input type="password" placeholder="Old Password" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" value={profileForm.oldPassword} onChange={e => setProfileForm({...profileForm, oldPassword: e.target.value})} />
                      <input type="password" placeholder="New Password" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" value={profileForm.newPassword} onChange={e => setProfileForm({...profileForm, newPassword: e.target.value})} />
                      <input type="password" placeholder="Confirm Password" className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm outline-none" value={profileForm.confirmPassword} onChange={e => setProfileForm({...profileForm, confirmPassword: e.target.value})} />
                    </div>
                  </div>
                  <button type="submit" disabled={isUpdatingProfile} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl shadow-2xl hover:bg-indigo-600 transition-all uppercase tracking-[0.2em] text-sm">
                    {isUpdatingProfile ? 'Updating System...' : 'Update Profile Details'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'refer' && (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
               <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
                  <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Your Referral Link</h2>
                  <div className="mt-10 p-2 bg-slate-50 border border-slate-200 rounded-[2rem] flex items-center gap-4">
                     <div className="flex-1 px-6 text-sm font-bold text-slate-600 truncate">{referLink}</div>
                     <button onClick={() => { navigator.clipboard.writeText(referLink); alert("Referral link copied!"); }} className="px-8 py-4 bg-indigo-600 text-white font-black text-xs uppercase tracking-widest rounded-[1.5rem] hover:bg-indigo-700 transition-all">COPY LINK</button>
                  </div>
               </div>
            </div>
          )}
          {activeTab === 'india-bazar-play' && <GamePlay games={games} wallets={member.wallets} onPlaceBet={() => {}} onPlaceBetDetailed={onPlaceBetDetailed} onBack={() => setActiveTab('dashboard')} />}
          {activeTab === 'deposit' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
              <div className="bg-white rounded-[3rem] border border-slate-200 shadow-2xl p-10 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Step 1: Scan & Pay</h3>
                  <div className="bg-slate-900 p-8 rounded-[2.5rem] flex items-center justify-center">
                    {adminBarcode ? <img src={adminBarcode} className="w-56 h-56 object-contain bg-white p-2 rounded-xl" alt="QR" /> : <QrCode size={64} className="text-slate-500" />}
                  </div>
                </div>
                <div className="space-y-6">
                  <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Step 2: Submit Proof</h3>
                  <input type="number" value={depositForm.amount} onChange={e => setDepositForm({...depositForm, amount: e.target.value})} className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] font-black text-2xl" placeholder="Amount" />
                  <input type="text" value={depositForm.utr} onChange={e => setDepositForm({...depositForm, utr: e.target.value})} className="w-full px-8 py-4 bg-slate-50 border border-slate-200 rounded-[2rem] font-bold" placeholder="UTR Number" />
                  <input type="file" ref={depositFileRef} onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setDepositForm(prev => ({ ...prev, screenshot: reader.result as string }));
                      reader.readAsDataURL(file);
                    }
                  }} className="hidden" accept="image/*" />
                  <button onClick={() => depositFileRef.current?.click()} className="w-full py-5 border-2 border-dashed border-slate-200 rounded-[2rem] text-slate-400 font-black uppercase text-xs">
                    {depositForm.screenshot ? "Screenshot Loaded" : "Upload Proof"}
                  </button>
                  <button onClick={handleAddDeposit} className="w-full py-6 bg-slate-900 text-white font-black text-lg rounded-[2.5rem] shadow-2xl">SUBMIT REQUEST</button>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'withdraw' && (
            <div className="max-w-2xl mx-auto bg-white rounded-[3rem] p-10 space-y-8 shadow-2xl">
              <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 flex justify-between items-center">
                <div><p className="text-xs font-black text-amber-600 uppercase">Winner Wallet</p><p className="text-4xl font-black text-amber-900">Rs {member.wallets.winner.toLocaleString()}</p></div>
                <Trophy className="text-amber-200" size={56} />
              </div>
              <input type="number" placeholder="Amount" className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] font-black text-xl" value={withdrawForm.amount} onChange={e => setWithdrawForm({...withdrawForm, amount: e.target.value})} />
              <input type="text" placeholder="UPI ID or Bank Details" className="w-full px-8 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] font-bold" value={withdrawForm.details} onChange={e => setWithdrawForm({...withdrawForm, details: e.target.value})} />
              <button onClick={handleAddWithdraw} className="w-full py-6 bg-emerald-600 text-white font-black text-lg rounded-[2.5rem] shadow-2xl">CONFIRM WITHDRAWAL</button>
            </div>
          )}
          {activeTab === 'chakkri' && (
            <div className="flex flex-col items-center py-10 relative">
              <div className="relative w-80 h-80 md:w-[500px] md:h-[500px]" style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 6s cubic-bezier(0.15, 0, 0.15, 1)', background: `conic-gradient(${COLORS.map((c, i) => `${c} ${i * (360/segments.length)}deg ${(i + 1) * (360/segments.length)}deg`).join(', ')})` }}>
                <div className="absolute inset-0 flex items-center justify-center"><div className="w-32 h-32 md:w-44 md:h-44 bg-white rounded-full border-8 border-slate-900 flex items-center justify-center font-black text-4xl">{lastResult || '--'}</div></div>
              </div>
              <button onClick={handleSpin} disabled={isSpinning || !canFreeSpin} className={`mt-20 w-full max-w-md py-8 text-white font-black text-2xl rounded-[2.5rem] shadow-2xl transition-all ${canFreeSpin ? 'bg-indigo-600' : 'bg-slate-300 text-slate-500'}`}>
                 {isSpinning ? 'SPINNING...' : (canFreeSpin ? 'SPIN THE WHEEL' : timeLeft)}
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MemberPanel;
