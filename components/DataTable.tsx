
import React from 'react';
import { 
  ExternalLink, 
  Wallet, 
  Plus, 
  Ban, 
  Trash2, 
  UserPlus 
} from 'lucide-react';
import { User } from '../types';

interface DataTableProps {
  users: User[];
  onEditUser?: (user: User) => void;
  onBlockUser?: (user: User) => void;
  onDeleteUser?: (user: User) => void;
}

const DataTable: React.FC<DataTableProps> = ({ users, onEditUser, onBlockUser, onDeleteUser }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h3 className="font-bold text-slate-800 text-lg">System Members</h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1 transition-colors">
          View All <ExternalLink size={14} />
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Member</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Consolidated Assets</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {users.length > 0 ? users.map((user) => {
              const total = (Object.values(user.wallets) as number[]).reduce((a, b) => a + b, 0);
              const avatarSrc = user.avatar || `https://picsum.photos/seed/${user.id}/100/100`;
              return (
                <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold overflow-hidden border border-slate-200">
                        <img src={avatarSrc} alt={user.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-slate-900">{user.name}</div>
                        <div className="text-[10px] font-mono text-slate-500 uppercase">{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-black text-indigo-600 flex items-center gap-1">
                        <Wallet size={12} /> Rs {total.toLocaleString()}
                      </span>
                      <div className="flex gap-1 mt-1">
                        <span className="text-[8px] bg-blue-50 text-blue-600 px-1 rounded">D:{user.wallets.deposit}</span>
                        <span className="text-[8px] bg-emerald-50 text-emerald-600 px-1 rounded">W:{user.wallets.winner}</span>
                        <span className="text-[8px] bg-indigo-50 text-indigo-600 px-1 rounded">I:{user.wallets.interest}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                      user.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      'bg-rose-50 text-rose-600 border border-rose-100'
                    }`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-x-4 group-hover:translate-x-0">
                      {/* Add Action (Points/Edit) */}
                      <button 
                        onClick={() => onEditUser?.(user)}
                        className="p-2 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all shadow-sm border border-indigo-100"
                        title="Add Points / Edit"
                      >
                        <Plus size={18} />
                      </button>
                      
                      {/* Block Action */}
                      <button 
                        onClick={() => onBlockUser?.(user)}
                        className="p-2 bg-amber-50 text-amber-600 rounded-xl hover:bg-amber-500 hover:text-white transition-all shadow-sm border border-amber-100"
                        title="Block User"
                      >
                        <Ban size={18} />
                      </button>
                      
                      {/* Delete Action */}
                      <button 
                        onClick={() => onDeleteUser?.(user)}
                        className="p-2 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-sm border border-rose-100"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            }) : (
              <tr><td colSpan={4} className="px-6 py-20 text-center italic text-slate-400">No members found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DataTable;
