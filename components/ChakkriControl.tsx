
import React, { useState, useEffect } from 'react';
import { 
  Settings2, 
  CheckCircle2, 
  AlertCircle,
  RefreshCcw,
  Edit3,
  Save,
  Undo2,
  Dice5,
  Settings,
  Target,
  Zap
} from 'lucide-react';

const DEFAULT_SEGMENTS = ['0', '10', '20', '30', '40', '50', '60', '70', '80', '90', '100', 'Next day try'];
const COLORS = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#10b981', 
  '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#d946ef'
];

const ChakkriControl: React.FC = () => {
  const [segments, setSegments] = useState<string[]>(DEFAULT_SEGMENTS);
  const [forcedResult, setForcedResult] = useState<string | null>(null);
  const [isEditingSegments, setIsEditingSegments] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    // Load custom segments
    const savedSegments = localStorage.getItem('chakkri_segments');
    if (savedSegments) setSegments(JSON.parse(savedSegments));
    
    // Load forced result
    const savedForced = localStorage.getItem('chakkri_forced_result');
    if (savedForced) setForcedResult(savedForced);
  }, []);

  const handleSetForcedResult = (label: string) => {
    if (isEditingSegments) return;
    setForcedResult(label);
    localStorage.setItem('chakkri_forced_result', label);
  };

  const handleResetForced = () => {
    setForcedResult(null);
    localStorage.removeItem('chakkri_forced_result');
  };

  const handleSaveSegments = () => {
    setIsUpdating(true);
    localStorage.setItem('chakkri_segments', JSON.stringify(segments));
    setTimeout(() => {
      setIsUpdating(false);
      setIsEditingSegments(false);
      alert("Wheel layout saved! Result override is still active if selected.");
    }, 800);
  };

  const handleResetSegments = () => {
    if (window.confirm("Reset wheel segments to factory defaults?")) {
      setSegments(DEFAULT_SEGMENTS);
      localStorage.removeItem('chakkri_segments');
      setIsEditingSegments(false);
    }
  };

  const handleSegmentChange = (index: number, value: string) => {
    const newSegments = [...segments];
    newSegments[index] = value;
    setSegments(newSegments);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="max-w-5xl mx-auto">
        
        {/* Main Control Panel */}
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-10 flex flex-col relative overflow-hidden">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h3 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                <Target className="text-indigo-600" size={32} />
                Outcome Controller
              </h3>
              <p className="text-slate-500 text-sm font-medium mt-1">
                {isEditingSegments 
                  ? "Editing prize values. Result forcing is disabled while editing." 
                  : "Click any value below to FORCE it as the result for all members."}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {!isEditingSegments ? (
                <>
                  <button 
                    onClick={() => setIsEditingSegments(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 text-slate-600 rounded-2xl text-sm font-black hover:bg-slate-200 transition-all"
                  >
                    <Edit3 size={18} /> Edit Prizes
                  </button>
                  {forcedResult && (
                    <button 
                      onClick={handleResetForced}
                      className="flex items-center gap-2 px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl text-sm font-black hover:bg-rose-100 transition-all border border-rose-100"
                    >
                      <RefreshCcw size={18} /> Reset to Random
                    </button>
                  )}
                </>
              ) : (
                <button 
                  onClick={handleSaveSegments}
                  disabled={isUpdating}
                  className="flex items-center gap-2 px-8 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-black hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                >
                  {isUpdating ? <RefreshCcw size={18} className="animate-spin" /> : <Save size={18} />} 
                  Save Layout
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-10">
            {segments.map((label, i) => (
              <div
                key={i}
                onClick={() => !isEditingSegments && handleSetForcedResult(label)}
                className={`relative p-6 rounded-3xl border-2 transition-all flex flex-col items-center justify-center gap-3 group ${
                  !isEditingSegments && forcedResult === label 
                    ? 'border-indigo-600 bg-indigo-50 shadow-xl shadow-indigo-600/10 scale-105 z-10' 
                    : isEditingSegments 
                      ? 'border-slate-100 bg-white'
                      : 'border-slate-100 bg-slate-50 hover:border-indigo-300 cursor-pointer'
                }`}
              >
                <div className="w-6 h-6 rounded-full shadow-inner" style={{ backgroundColor: COLORS[i] }} />
                
                {isEditingSegments ? (
                  <input 
                    type="text" 
                    value={label}
                    onChange={(e) => handleSegmentChange(i, e.target.value)}
                    className="w-full bg-slate-100 border-none rounded-xl text-center font-black text-indigo-900 p-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ) : (
                  <span className={`font-black text-xl ${forcedResult === label ? 'text-indigo-700' : 'text-slate-600'}`}>
                    {label === 'Next day try' ? 'TRY' : label}
                  </span>
                )}

                {!isEditingSegments && forcedResult === label && (
                  <div className="absolute -top-3 -right-3 bg-indigo-600 text-white rounded-full p-1.5 shadow-lg border-4 border-white">
                    <CheckCircle2 size={16} />
                  </div>
                )}
                
                {!isEditingSegments && !forcedResult && (
                   <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-indigo-600/5 transition-opacity rounded-3xl" />
                )}
              </div>
            ))}
          </div>

          <div className={`p-8 rounded-[2rem] border transition-all flex items-start gap-5 ${
            forcedResult && !isEditingSegments ? 'bg-amber-50 border-amber-200' : 'bg-indigo-900 text-white'
          }`}>
            <div className={`p-3 rounded-2xl ${forcedResult && !isEditingSegments ? 'bg-amber-100 text-amber-600' : 'bg-white/10 text-white'}`}>
              <Zap size={24} />
            </div>
            <div>
              <h4 className={`font-black uppercase tracking-tight ${forcedResult && !isEditingSegments ? 'text-amber-800' : 'text-white'}`}>
                {forcedResult && !isEditingSegments ? "Result Override Active" : "Global Random Mode"}
              </h4>
              <p className={`text-sm mt-1 font-medium ${forcedResult && !isEditingSegments ? 'text-amber-700' : 'text-indigo-200'}`}>
                {forcedResult && !isEditingSegments 
                  ? `All members will stop exactly at "${forcedResult}" on their 24h free spin.`
                  : "All spins are currently 100% random and fair for every member ID."}
              </p>
            </div>
          </div>
        </div>

        {/* Global Rules Card */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white mt-8 shadow-2xl relative overflow-hidden">
           <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-4">
                 <h3 className="text-2xl font-black flex items-center gap-3">
                    <Dice5 className="text-indigo-400" />
                    Chakkri Business Logic
                 </h3>
                 <ul className="space-y-3 text-slate-400 font-medium">
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> 24-hour interval enforced strictly per member ID.</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Paid spins (Rs 100) have been permanently disabled.</li>
                    <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" /> Winnings are credited instantly to Member's Deposit Wallet.</li>
                 </ul>
              </div>
              <button 
                onClick={handleResetSegments}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl text-sm font-black uppercase tracking-widest transition-all"
              >
                Reset Factory Defaults
              </button>
           </div>
           <Settings size={200} className="absolute -right-20 -bottom-20 text-white/5 rotate-12" />
        </div>
      </div>
    </div>
  );
};

export default ChakkriControl;
