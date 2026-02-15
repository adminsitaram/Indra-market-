
import React, { useState, useEffect } from 'react';
import { X, Gamepad2, Clock, CalendarDays, Edit3 } from 'lucide-react';
import { Game } from '../types';

interface AddGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (game: any) => void;
  initialData?: Game | null;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const AddGameModal: React.FC<AddGameModalProps> = ({ isOpen, onClose, onAdd, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    openTime: '',
    closeTime: '',
    resultTime: '',
    activeDays: DAYS
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        openTime: initialData.openTime,
        closeTime: initialData.closeTime,
        resultTime: initialData.resultTime,
        activeDays: initialData.activeDays
      });
    } else {
      setFormData({
        name: '',
        openTime: '',
        closeTime: '',
        resultTime: '',
        activeDays: DAYS
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      activeDays: prev.activeDays.includes(day)
        ? prev.activeDays.filter(d => d !== day)
        : [...prev.activeDays, day]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: initialData?.id // Pass back the ID if we are editing
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className={`${initialData ? 'bg-indigo-600' : 'bg-blue-600'} p-6 text-white flex items-center justify-between transition-colors`}>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              {initialData ? <Edit3 size={24} /> : <Gamepad2 size={24} />}
            </div>
            <div>
              <h2 className="text-xl font-bold">{initialData ? 'Edit Game Market' : 'Add New Game'}</h2>
              <p className="text-indigo-100 text-xs">{initialData ? `Modifying ${initialData.name}` : 'Configure a new game draw'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Game Name */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Game Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Indra Matka Premium"
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Times Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" /> Open Time
              </label>
              <input
                required
                type="time"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                value={formData.openTime}
                onChange={(e) => setFormData({...formData, openTime: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" /> Close Time
              </label>
              <input
                required
                type="time"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                value={formData.closeTime}
                onChange={(e) => setFormData({...formData, closeTime: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
                <Clock size={14} className="text-slate-400" /> Result Time
              </label>
              <input
                required
                type="time"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-bold"
                value={formData.resultTime}
                onChange={(e) => setFormData({...formData, resultTime: e.target.value})}
              />
            </div>
          </div>

          {/* Active Days Selection */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-3 flex items-center gap-1.5">
              <CalendarDays size={14} className="text-slate-400" /> Active Days
            </label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(day)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    formData.activeDays.includes(day)
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              className={`flex-1 px-4 py-3 ${initialData ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/20' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/20'} text-white font-black rounded-xl transition-all shadow-lg text-sm uppercase tracking-wider`}
            >
              {initialData ? 'Update Market' : 'Create Market'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGameModal;
