
import React from 'react';
import { DollarSign, Users, TrendingUp, Zap, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { StatData } from '../types';

const iconMap: Record<string, any> = {
  DollarSign,
  Users,
  TrendingUp,
  Zap
};

const StatCard: React.FC<StatData> = ({ label, value, change, trend, icon }) => {
  const Icon = iconMap[icon];

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 text-sm font-medium ${trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
          {change > 0 ? '+' : ''}{change}%
          {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
        </div>
      </div>
      <div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{label}</h3>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
};

export default StatCard;
