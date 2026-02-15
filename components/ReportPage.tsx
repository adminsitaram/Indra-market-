
import React, { useMemo, useState } from 'react';
import { MOCK_JODI_REPORT } from '../constants';
import { Search, TrendingDown, Filter, Gamepad2, ArrowRight, X, User as UserIcon, Smartphone, Wallet } from 'lucide-react';
import { Game, Bet } from '../types';

interface ReportPageProps {
  games: Game[];
  bets: Bet[];
}

const ReportPage: React.FC<ReportPageProps> = ({ games, bets }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGameId, setSelectedGameId] = useState<string>('');
  const [activeNumberDetail, setActiveNumberDetail] = useState<string | null>(null);
  
  const selectedGame = useMemo(() => {
    return games.find(g => g.id === selectedGameId);
  }, [games, selectedGameId]);

  // Aggregate bets by number for the selected game
  const consolidatedReport = useMemo(() => {
    if (!selectedGameId) return [];
    
    // Create map for all 100 Jodis
    const reportMap: Record<string, number> = {};
    for (let i = 0; i < 100; i++) {
      reportMap[i.toString().padStart(2, '0')] = 0;
    }

    // Sum up bets for the selected game
    bets.filter(b => b.gameId === selectedGameId).forEach(bet => {
      if (reportMap[bet.number] !== undefined) {
        reportMap[bet.number] += bet.amount;
      }
    });

    return Object.entries(reportMap)
      .map(([number, amount]) => ({ number, amount }))
      .filter(item => item.number.includes(searchTerm))
      .sort((a, b) => a.amount - b.amount); // Low risk first
  }, [searchTerm, selectedGameId, bets]);

  const totalBetAmount = useMemo(() => {
    if (!selectedGameId) return 0;
    return bets.filter(b => b.gameId === selectedGameId).reduce((acc, curr) => acc + curr.amount, 0);
  }, [selectedGameId, bets]);

  const selectedNumberBets = useMemo(() => {
    if (!activeNumberDetail || !selectedGameId) return [];
    return bets.filter(b => b.gameId === selectedGameId && b.number === activeNumberDetail);
  }, [activeNumberDetail, selectedGameId, bets]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 relative">
      <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5">
           <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Gamepad2 size={28} />
           </div>
           <div>
              <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">Market Exposure</h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Live point distribution analysis</p>
           </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
           <select 
              value={selectedGameId} 
              onChange={(e) => setSelectedGameId(e.target.value)}
              className="flex-1 md:w-64 px-6 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 text-sm font-bold text-slate-700 transition-all appearance-none cursor-pointer"
           >
              <option value="">Select Game Market...</option>
              {games.map(game => (
                <option key={game.id} value={game.id}>{game.name} ({game.resultTime})</option>
              ))}
           </select>
           {selectedGame && (
              <div className="px-6 py-3.5 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 flex items-center gap-3 border border-indigo-500 transition-all">
                <span className="text-[10px] uppercase tracking-widest opacity-80">Total Liab:</span>
                <span className="text-lg">Rs {totalBetAmount.toLocaleString()}</span>
              </div>
           )}
        </div>
      </div>

      {!selectedGameId ? (
        <div className="py-32 text-center bg-white rounded-[3rem] border border-slate-200 border-dashed">
           <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Filter size={48} className="text-slate-200" />
           </div>
           <h4 className="text-xl font-black text-slate-400 uppercase tracking-widest">Awaiting Selection</h4>
           <p className="text-slate-400 text-sm font-medium mt-2 max-w-xs mx-auto">Please pick a market to view live member plays and liability details.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <TrendingDown size={24} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight leading-none">{selectedGame?.name} Exposure</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Click a number to see which members played it</p>
              </div>
            </div>
            
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search number (00-99)..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-10 gap-3">
            {consolidatedReport.map((item) => (
              <button 
                key={item.number} 
                onClick={() => setActiveNumberDetail(item.number)}
                className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center gap-1 group relative overflow-hidden ${
                  item.amount === 0 
                    ? 'bg-slate-50 border-slate-200 opacity-60' 
                    : item.amount > 3000 
                      ? 'bg-rose-50 border-rose-200 shadow-rose-100/50' 
                      : item.amount > 1000 
                        ? 'bg-amber-50 border-amber-200' 
                        : 'bg-emerald-50 border-emerald-200'
                } hover:shadow-xl hover:scale-105 hover:-translate-y-1`}
              >
                <span className="text-2xl font-black text-slate-800">{item.number}</span>
                <div className={`text-[10px] font-black uppercase tracking-widest ${
                  item.amount > 3000 ? 'text-rose-600' : 
                  item.amount > 1000 ? 'text-amber-600' : 
                  'text-emerald-600'
                }`}>
                  Rs {item.amount.toLocaleString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Member Breakdown Side Panel/Modal */}
      {activeNumberDetail && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end">
           <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setActiveNumberDetail(null)} />
           <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-500">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/80 backdrop-blur">
                 <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-3xl font-black">
                       {activeNumberDetail}
                    </div>
                    <div>
                       <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">Bet Breakdown</h3>
                       <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Total: Rs {selectedNumberBets.reduce((a,b)=>a+b.amount,0).toLocaleString()}</p>
                    </div>
                 </div>
                 <button onClick={() => setActiveNumberDetail(null)} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                    <X size={24} />
                 </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                 {selectedNumberBets.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                      <Search size={48} className="opacity-20 mb-4" />
                      <p className="font-bold">No bets on this number yet.</p>
                   </div>
                 ) : (
                   selectedNumberBets.map((bet) => (
                      <div key={bet.id} className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex items-center justify-between group hover:bg-white hover:border-indigo-300 transition-all shadow-sm">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-400 border border-slate-100 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                               <UserIcon size={20} />
                            </div>
                            <div>
                               <p className="text-sm font-black text-slate-800 truncate">{bet.userName}</p>
                               <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase">
                                  <Smartphone size={10} /> {bet.userMobile}
                               </div>
                            </div>
                         </div>
                         <div className="text-right">
                            <p className="text-lg font-black text-indigo-600">Rs {bet.amount.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase">{bet.type}</p>
                         </div>
                      </div>
                   ))
                 )}
              </div>

              <div className="p-8 border-t border-slate-100 bg-slate-50/80">
                 <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Liability</span>
                    <span className="text-2xl font-black text-slate-900">Rs {selectedNumberBets.reduce((a,b)=>a+b.amount,0).toLocaleString()}</span>
                 </div>
                 <button onClick={() => setActiveNumberDetail(null)} className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-slate-800 transition-all flex items-center justify-center gap-3">
                    CLOSE BREAKDOWN
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default ReportPage;
