
import React, { useState, useEffect } from 'react';
import { X, User as UserIcon, Smartphone, Lock, Wallet, Save, Plus, Minus } from 'lucide-react';
import { User } from '../types';

interface EditUserPointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUpdate: (userId: string, updates: { password?: string; pointsAdjustment: number }) => void;
}

const EditUserPointsModal: React.FC<EditUserPointsModalProps> = ({ isOpen, onClose, user, onUpdate }) => {
  const [password, setPassword] = useState('');
  const [adjustment, setAdjustment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setPassword(user.password || '');
      setAdjustment('');
    }
  }, [user, isOpen]);

  if (!isOpen || !user) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Artificial delay for UX
    setTimeout(() => {
      onUpdate(user.id, {
        password: password,
        pointsAdjustment: Number(adjustment) || 0
      });
      setIsSubmitting(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-indigo-600 p-8 text-white">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Plus size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase tracking-tight">Credit & Edit</h2>
                <p className="text-indigo-100 text-xs font-medium">Update account: {user.id}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {/* Name - Read Only */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Member Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  disabled
                  type="text" 
                  value={user.name}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 font-bold outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* Mobile - Read Only */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mobile Number</label>
              <div className="relative">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input 
                  disabled
                  type="text" 
                  value={user.mobile}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl text-slate-500 font-bold outline-none cursor-not-allowed"
                />
              </div>
            </div>

            {/* Password - Editable */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  required
                  type="text" 
                  placeholder="Enter Password"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </div>

            {/* Wallet Adjustment */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Deposit Wallet Adjustment (+/-)</label>
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">Current: Rs {user.wallets.deposit}</span>
              </div>
              <div className="relative group">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <input 
                  type="number" 
                  placeholder="e.g. 500 or -500"
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-black text-indigo-600 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all"
                  value={adjustment}
                  onChange={e => setAdjustment(e.target.value)}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                  <Plus size={14} className="text-emerald-500" />
                  <Minus size={14} className="text-rose-500" />
                </div>
              </div>
              <p className="text-[9px] text-slate-400 font-medium px-2 italic">Enter positive value to add, negative to deduct.</p>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-4 border border-slate-200 text-slate-600 font-black rounded-2xl hover:bg-slate-50 transition-all text-xs uppercase tracking-widest"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all shadow-xl text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {isSubmitting ? 'Updating...' : <><Save size={16} /> Update Account</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserPointsModal;
