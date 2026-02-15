
import React, { useState } from 'react';
import { X, Trophy, Calendar, Hash } from 'lucide-react';
import { Game } from '../types';

interface AddResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (result: any) => void;
  games: Game[];
}

const AddResultModal: React.FC<AddResultModalProps> = ({ isOpen, onClose, onAdd, games }) => {
  const [formData, setFormData] = useState({
    gameId: '',
    date: new Date().toISOString().split('T')[0],
    result: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedGame = games.find(g => g.id === formData.gameId);
    if (!selectedGame) return;

    onAdd({
      ...formData,
      result: formData.result.trim(), // Ensure no whitespace
      gameName: selectedGame.name
    });
    setFormData({ gameId: '', date: new Date().toISOString().split('T')[0], result: '' });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-amber-500 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Trophy size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Declare Result</h2>
              <p className="text-amber-50 text-xs">Announce winner for a specific draw</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Game Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Game</label>
            <select
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm transition-all"
              value={formData.gameId}
              onChange={(e) => setFormData({...formData, gameId: e.target.value})}
            >
              <option value="">Choose a game...</option>
              {games.map(game => (
                <option key={game.id} value={game.id}>{game.name} ({game.resultTime})</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
              <Calendar size={16} className="text-slate-400" /> Result Date
            </label>
            <input
              required
              type="date"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm transition-all"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
            />
          </div>

          {/* Result Number */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-2">
              <Hash size={16} className="text-slate-400" /> Result Number / Code
            </label>
            <input
              required
              type="text"
              placeholder="e.g. 45"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-sm transition-all font-mono font-bold text-lg"
              value={formData.result}
              onChange={(e) => setFormData({...formData, result: e.target.value})}
            />
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-all shadow-lg shadow-amber-500/20 text-sm"
            >
              Publish Result
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddResultModal;
