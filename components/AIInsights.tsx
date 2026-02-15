
import React, { useState, useCallback } from 'react';
import { Sparkles, BrainCircuit, RefreshCcw } from 'lucide-react';
import { geminiService } from '../services/geminiService';
import { DASHBOARD_STATS } from '../constants';

const AIInsights: React.FC = () => {
  const [insights, setInsights] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const fetchInsights = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await geminiService.getDashboardInsights(DASHBOARD_STATS);
      setInsights(result);
    } catch (err) {
      setInsights("Failed to load insights. Make sure API_KEY is set.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-2xl text-white shadow-xl shadow-indigo-500/20 mb-8 relative overflow-hidden group">
      {/* Decorative background circle */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all duration-700"></div>
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-xl">
            <Sparkles size={24} className="text-indigo-100" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Nexus AI Business Insights</h3>
            {/* Update: Changed label to reflect correct model name used in GeminiService */}
            <p className="text-indigo-100 text-sm opacity-90">Powered by Gemini 3 Pro</p>
          </div>
        </div>
        <button 
          onClick={fetchInsights}
          disabled={isLoading}
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-700 font-bold rounded-xl hover:bg-indigo-50 transition-all shadow-lg active:scale-95 disabled:opacity-70"
        >
          {isLoading ? <RefreshCcw className="animate-spin" size={20} /> : <BrainCircuit size={20} />}
          {isLoading ? 'Analyzing...' : 'Generate New Insights'}
        </button>
      </div>

      <div className="mt-6 bg-white/10 backdrop-blur-md border border-white/10 p-5 rounded-xl min-h-[100px] flex items-center justify-center">
        {insights ? (
          <div className="w-full prose prose-invert">
            <p className="text-indigo-50 leading-relaxed font-medium whitespace-pre-line">
              {insights}
            </p>
          </div>
        ) : (
          <p className="text-indigo-200 italic font-medium">Click the button above to analyze current business performance and get strategic recommendations.</p>
        )}
      </div>
    </div>
  );
};

export default AIInsights;
