
import React, { useState } from 'react';
import { Transaction } from '../types';
import { Check, X, Eye, Clock, User as UserIcon, Wallet, CreditCard } from 'lucide-react';

interface TransactionQueueProps {
  type: 'deposit' | 'withdrawal';
  transactions: Transaction[];
  onAction: (id: string, status: 'approved' | 'rejected') => void;
}

// TransactionQueue component to manage and display deposit/withdrawal requests
const TransactionQueue: React.FC<TransactionQueueProps> = ({ type, transactions, onAction }) => {
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-lg uppercase tracking-tight">
          {type === 'deposit' ? 'Deposit Queue' : 'Withdrawal Queue'}
        </h3>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
            {transactions.length} Requests
          </span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Method & Details</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold border border-slate-200 overflow-hidden">
                       <img src={`https://picsum.photos/seed/${tx.userId}/100/100`} alt={tx.userName} />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{tx.userName}</div>
                      <div className="text-[10px] font-mono text-slate-500 uppercase">{tx.userId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`text-sm font-black ${type === 'deposit' ? 'text-indigo-600' : 'text-rose-600'}`}>
                    Rs {tx.amount.toLocaleString()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                      {tx.type === 'deposit' ? <Wallet size={12} /> : <CreditCard size={12} />}
                      {tx.method}: {tx.reference || tx.paymentDetails}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                      <Clock size={10} /> {tx.createdAt}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <div className="flex items-center justify-end gap-2">
                    {tx.screenshot && (
                      <button 
                        onClick={() => setSelectedScreenshot(tx.screenshot!)}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                        title="View Screenshot"
                      >
                        <Eye size={18} />
                      </button>
                    )}
                    {tx.status === 'pending' ? (
                      <>
                        <button 
                          onClick={() => onAction(tx.id, 'approved')}
                          className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                          title="Approve"
                        >
                          <Check size={18} />
                        </button>
                        <button 
                          onClick={() => onAction(tx.id, 'rejected')}
                          className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                          title="Reject"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        tx.status === 'approved' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'
                      }`}>
                        {tx.status}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={4} className="px-6 py-20 text-center text-slate-400 font-medium italic">
                   No {type} requests in the queue.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for viewing transaction screenshots */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setSelectedScreenshot(null)} />
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
             <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-800 uppercase tracking-tight text-sm">Transaction Proof</span>
                <button onClick={() => setSelectedScreenshot(null)} className="p-1 hover:bg-slate-200 rounded-full transition-colors"><X size={20} /></button>
             </div>
             <div className="p-4 bg-slate-100 flex items-center justify-center min-h-[300px]">
                <img src={selectedScreenshot} alt="UTR Screenshot" className="max-w-full max-h-[70vh] rounded-xl shadow-lg object-contain" />
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionQueue;
