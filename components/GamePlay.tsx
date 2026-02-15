
import React, { useState, useMemo } from 'react';
import { Game } from '../types';
import { 
  Gamepad2, 
  Clock, 
  ChevronRight, 
  ArrowLeft, 
  Hash, 
  CircleDollarSign, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  History,
  Grid3X3,
  Wallet
} from 'lucide-react';

interface GamePlayProps {
  games: Game[];
  wallets: { deposit: number; winner: number; spin: number; refer: number; interest: number };
  onPlaceBet: (gameId: string, amount: number) => void;
  onPlaceBetDetailed?: (gameId: string, numbers: string[], amountPerNumber: number, type: string) => void;
  onBack: () => void;
}

const GamePlay: React.FC<GamePlayProps> = ({ games, wallets, onPlaceBet, onPlaceBetDetailed, onBack }) => {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [betData, setBetData] = useState({ number: '', amount: '', type: 'jodi' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const totalWalletPoints = useMemo(() => {
    return (Object.values(wallets) as number[]).reduce((a: number, b: number) => a + b, 0);
  }, [wallets]);

  const currentTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  
  const isMarketOpen = (game: Game) => {
    // Basic string comparison works for HH:mm format usually, 
    // but for 9:00am to 8:00am cycle, we need robust logic.
    // Assuming simple open/close logic for now.
    return true; 
  };

  const crossJodis = useMemo(() => {
    if (betData.type !== 'cross' || !betData.number) return [];
    const digits = betData.number.split('').filter((v, i, a) => a.indexOf(v) === i);
    const jodis: string[] = [];
    for (let i = 0; i < digits.length; i++) {
      for (let j = 0; j < digits.length; j++) {
        jodis.push(`${digits[i]}${digits[j]}`);
      }
    }
    return jodis;
  }, [betData.type, betData.number]);

  const activeNumbers = useMemo(() => {
    if (betData.type === 'jodi') return [betData.number];
    if (betData.type === 'cross') return crossJodis;
    if (betData.type.startsWith('harup')) return [betData.number];
    return [];
  }, [betData.type, betData.number, crossJodis]);

  const totalBetAmount = useMemo(() => {
    const amount = Number(betData.amount) || 0;
    return activeNumbers.length * amount;
  }, [activeNumbers, betData.amount]);

  const handleBetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totalBetAmount > totalWalletPoints) return alert(`Insufficient total funds! Required: Rs ${totalBetAmount}`);
    if (Number(betData.amount) < 1) return alert("Min bet Rs 1");
    if (!betData.number) return alert("Please enter a number");

    setIsSubmitting(true);
    setTimeout(() => {
      if (onPlaceBetDetailed) {
        onPlaceBetDetailed(selectedGame!.id, activeNumbers, Number(betData.amount), betData.type);
      } else {
        onPlaceBet(selectedGame!.id, totalBetAmount);
      }
      
      setIsSubmitting(false);
      setShowSuccess(true);
      setBetData({ number: '', amount: '', type: betData.type });
      setTimeout(() => { setShowSuccess(false); setSelectedGame(null); }, 2000);
    }, 1000);
  };

  if (selectedGame) {
    return (
      <div className="animate-in fade-in slide-in-from-right-4 duration-300">
        <button onClick={() => setSelectedGame(null)} className="flex items-center gap-2 text-slate-500 font-bold mb-6 hover:text-slate-800 transition-colors">
          <ArrowLeft size={20} /> Back to Games
        </button>

        <div className="bg-white rounded-[2rem] border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-slate-900 p-8 text-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-3xl font-black tracking-tight">{selectedGame.name}</h3>
                <p className="text-slate-400 mt-1 font-medium">Available Balance: Rs {totalWalletPoints.toLocaleString()}</p>
              </div>
              <div className="px-4 py-2 bg-indigo-600 rounded-2xl text-xs font-black uppercase tracking-widest">Live Now</div>
            </div>
            
            <div className="grid grid-cols-3 gap-4 mt-8">
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center"><p className="text-[10px] text-slate-400 font-bold uppercase">Open</p><p className="font-bold">{selectedGame.openTime}</p></div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center"><p className="text-[10px] text-slate-400 font-bold uppercase">Close</p><p className="font-bold">{selectedGame.closeTime}</p></div>
              <div className="bg-white/5 p-3 rounded-2xl border border-white/10 text-center"><p className="text-[10px] text-indigo-400 font-bold uppercase">Result</p><p className="font-bold text-indigo-400">{selectedGame.resultTime}</p></div>
            </div>
          </div>

          <div className="p-8">
            {showSuccess ? (
              <div className="py-12 flex flex-col items-center justify-center text-center animate-in zoom-in duration-300">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4"><CheckCircle2 size={48} /></div>
                <h4 className="text-2xl font-black text-slate-800">Bet Placed!</h4>
                <p className="text-slate-500 mt-2">Your play has been recorded successfully.</p>
              </div>
            ) : (
              <form onSubmit={handleBetSubmit} className="space-y-6">
                <div className="flex p-1 bg-slate-100 rounded-2xl overflow-x-auto no-scrollbar">
                  {['jodi', 'cross', 'harup-in', 'harup-out'].map((t) => (
                    <button key={t} type="button" onClick={() => setBetData({ ...betData, type: t, number: '' })} className={`flex-1 min-w-[80px] py-3 text-[10px] font-black rounded-xl transition-all uppercase tracking-wider ${betData.type === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>{t.replace('-', ' ')}</button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><Hash size={16} className="text-slate-400" /> Number</label>
                    <input required type="text" maxLength={betData.type === 'jodi' ? 2 : betData.type === 'cross' ? 10 : 1} placeholder={betData.type === 'jodi' ? "00-99" : betData.type === 'cross' ? "e.g. 123" : "0-9"} value={betData.number} onChange={(e) => setBetData({ ...betData, number: e.target.value.replace(/\D/g, '') })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-black text-center outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 flex items-center gap-2"><CircleDollarSign size={16} className="text-slate-400" /> Points Per No.</label>
                    <input required type="number" placeholder="Min Rs 1" value={betData.amount} onChange={(e) => setBetData({ ...betData, amount: e.target.value })} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-2xl font-black text-center outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 transition-all" />
                  </div>
                </div>

                <div className="flex items-center justify-between p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                  <div className="flex items-start gap-3">
                    <Wallet className="text-indigo-600 mt-0.5" size={18} />
                    <div><p className="text-xs text-indigo-700 font-bold leading-tight">Total Play Amount</p><p className="text-[10px] text-indigo-500 mt-1">{activeNumbers.length} numbers selected</p></div>
                  </div>
                  <div className="text-right"><span className="text-2xl font-black text-indigo-700">Rs {totalBetAmount}</span></div>
                </div>

                <button type="submit" disabled={isSubmitting} className="w-full py-5 bg-indigo-600 text-white font-black text-xl rounded-[1.5rem] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3">
                  {isSubmitting ? "Processing..." : <><TrendingUp size={24} /> CONFIRM PLAY</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Market Selection</h2>
          <p className="text-slate-500 text-sm font-medium">Consolidated Assets: Rs {totalWalletPoints.toLocaleString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {games.map((game) => {
          const status = 'open'; 
          return (
            <div key={game.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm group hover:shadow-md hover:-translate-y-1 transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600"><Gamepad2 size={24} /></div>
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border bg-emerald-50 text-emerald-600 border-emerald-100">open</span>
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-6 uppercase tracking-tighter">{game.name}</h3>
              <div className="grid grid-cols-3 gap-2 mb-8">
                <div className="text-center"><p className="text-[10px] font-bold text-slate-400 uppercase">Open</p><p className="text-sm font-bold text-slate-700">{game.openTime}</p></div>
                <div className="text-center"><p className="text-[10px] font-bold text-slate-400 uppercase">Close</p><p className="text-sm font-bold text-slate-700">{game.closeTime}</p></div>
                <div className="text-center"><p className="text-[10px] font-bold text-indigo-400 uppercase">Result</p><p className="text-sm font-bold text-indigo-600">{game.resultTime}</p></div>
              </div>
              <button onClick={() => setSelectedGame(game)} className="w-full py-4 rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-slate-800">
                PLAY NOW <ChevronRight size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GamePlay;
