
import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Smartphone, 
  UserPlus, 
  ArrowRight, 
  CheckCircle2,
  ChevronLeft,
  Key,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { UserRole } from '../types';

interface AuthPageProps {
  initialReferCode?: string;
  onLogin: (role: UserRole, identifier: string, password?: string) => void;
  onSignUp: (name: string, mobile: string, password: string, referCode: string) => void;
}

const AuthPage: React.FC<AuthPageProps> = ({ initialReferCode = '', onLogin, onSignUp }) => {
  const [view, setView] = useState<'member-login' | 'admin-login' | 'member-signup'>('member-login');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [adminId, setAdminId] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  
  const [signUpData, setSignUpData] = useState({
    name: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    referCode: ''
  });

  const [error, setError] = useState('');

  // Auto-fill and switch view if referral code is detected
  useEffect(() => {
    if (initialReferCode) {
      setSignUpData(prev => ({ ...prev, referCode: initialReferCode }));
      setView('member-signup');
    }
  }, [initialReferCode]);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId === 'Admin' && adminPass === '1234') {
      onLogin('admin', 'ADMIN');
    } else {
      setError('Invalid Admin Credentials.');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleMemberLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length === 10 && password) {
      onLogin('member', mobile, password);
    } else {
      setError('Enter valid 10-digit mobile and password');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (signUpData.password !== signUpData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    if (signUpData.mobile.length !== 10) {
      setError('Enter a valid 10-digit mobile number');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      onSignUp(signUpData.name, signUpData.mobile, signUpData.password, signUpData.referCode || '');
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-inter overflow-hidden relative">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full"></div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto mb-4 shadow-2xl shadow-indigo-600/40 border border-indigo-400/30">
            <ShieldCheck size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase">Indra Market Terminal</h1>
          <p className="text-slate-400 text-sm font-medium mt-1 uppercase tracking-widest">Premium System Gateway</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-2xl border border-slate-700/50 rounded-[2.5rem] shadow-2xl overflow-hidden">
          {view !== 'member-signup' && (
            <div className="flex p-2 bg-slate-900/50 border-b border-slate-700/30">
              <button onClick={() => setView('member-login')} className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${view === 'member-login' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Member</button>
              <button onClick={() => setView('admin-login')} className={`flex-1 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${view === 'admin-login' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>Admin</button>
            </div>
          )}

          <div className="p-8">
            {error && <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-400 text-xs font-bold"><ShieldAlert size={18} /> {error}</div>}

            {view === 'admin-login' && (
              <form onSubmit={handleAdminLogin} className="space-y-5">
                <input required type="text" placeholder="Admin ID" className="w-full px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white font-bold outline-none focus:border-indigo-500" value={adminId} onChange={e => setAdminId(e.target.value)} />
                <input required type="password" placeholder="Passcode" className="w-full px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white font-bold outline-none focus:border-indigo-500" value={adminPass} onChange={e => setAdminPass(e.target.value)} />
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest flex items-center justify-center gap-3">Admin Access <ArrowRight size={20} /></button>
              </form>
            )}

            {view === 'member-login' && (
              <form onSubmit={handleMemberLogin} className="space-y-5">
                <input required type="tel" maxLength={10} placeholder="Mobile Number" className="w-full px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white font-bold outline-none focus:border-indigo-500" value={mobile} onChange={e => setMobile(e.target.value.replace(/\D/g, ''))} />
                <input required type="password" placeholder="Password" className="w-full px-6 py-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-white font-bold outline-none focus:border-indigo-500" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="submit" className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest flex items-center justify-center gap-3">Sign In <ArrowRight size={20} /></button>
                <div className="text-center pt-4"><button type="button" onClick={() => setView('member-signup')} className="text-xs text-indigo-400 font-bold uppercase hover:text-indigo-300">Create Account</button></div>
              </form>
            )}

            {view === 'member-signup' && (
              <form onSubmit={handleSignUp} className="space-y-4">
                <button type="button" onClick={() => setView('member-login')} className="flex items-center gap-2 text-slate-500 text-xs font-black uppercase mb-6"><ChevronLeft size={16} /> Back</button>
                <input required type="text" placeholder="Full Name" className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-white text-sm font-bold" value={signUpData.name} onChange={e => setSignUpData({...signUpData, name: e.target.value})} />
                <input required type="tel" maxLength={10} placeholder="Mobile" className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-white text-sm font-bold" value={signUpData.mobile} onChange={e => setSignUpData({...signUpData, mobile: e.target.value.replace(/\D/g, '')})} />
                <div className="grid grid-cols-2 gap-3">
                  <input required type="password" placeholder="Password" className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-white text-sm font-bold" value={signUpData.password} onChange={e => setSignUpData({...signUpData, password: e.target.value})} />
                  <input required type="password" placeholder="Confirm" className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-white text-sm font-bold" value={signUpData.confirmPassword} onChange={e => setSignUpData({...signUpData, confirmPassword: e.target.value})} />
                </div>
                <input type="text" placeholder="Refer Code (Optional)" className="w-full px-4 py-3.5 bg-slate-900/50 border border-slate-700 rounded-2xl text-white text-sm font-bold uppercase" value={signUpData.referCode} onChange={e => setSignUpData({...signUpData, referCode: e.target.value})} />
                <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl uppercase tracking-widest flex items-center justify-center gap-3 mt-6">
                   {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <UserPlus size={20} />}
                   {isSubmitting ? 'Registering...' : 'Register Account'}
                </button>
              </form>
            )}
          </div>
        </div>
        <div className="text-center mt-8"><div className="flex items-center justify-center gap-2"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div><span className="text-emerald-500/80 text-[10px] font-bold uppercase tracking-widest">Indra Market Secure Server Live</span></div></div>
      </div>
    </div>
  );
};

export default AuthPage;
