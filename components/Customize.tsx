import React, { useState } from 'react';
import { PlayerProfile, PieceSet, ColorTheme } from '../types';
import { PieceIcon } from './Icons';
import { ArrowLeft, Check } from 'lucide-react';

interface CustomizeProps {
  user: PlayerProfile;
  onSave: (profile: PlayerProfile) => void;
  onBack: () => void;
}

const THEMES: ColorTheme[] = [
  { name: 'Emerald', primary: '#34d399', secondary: 'rgba(52, 211, 153, 0.2)', accent: 'emerald-400' },
  { name: 'Rose', primary: '#fb7185', secondary: 'rgba(251, 113, 133, 0.2)', accent: 'rose-400' },
  { name: 'Cyan', primary: '#22d3ee', secondary: 'rgba(34, 211, 238, 0.2)', accent: 'cyan-400' },
  { name: 'Amber', primary: '#fbbf24', secondary: 'rgba(251, 191, 36, 0.2)', accent: 'amber-400' },
  { name: 'Violet', primary: '#a78bfa', secondary: 'rgba(167, 139, 250, 0.2)', accent: 'violet-400' },
];

const SETS: { id: PieceSet; label: string }[] = [
  { id: 'classic', label: 'Classic' },
  { id: 'geometric', label: 'Geometric' },
  { id: 'retro', label: 'Retro 8-Bit' },
];

export const Customize: React.FC<CustomizeProps> = ({ user, onSave, onBack }) => {
  const [draft, setDraft] = useState<PlayerProfile>(user);

  const save = () => {
    onSave(draft);
  };

  return (
    <div className="w-full max-w-md bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 hover:bg-slate-700 rounded-full transition-colors text-slate-400 hover:text-white">
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-bold text-white">Customize Appearance</h2>
      </div>

      {/* Preview */}
      <div className="bg-slate-900 rounded-lg p-6 mb-8 flex flex-col items-center justify-center border border-slate-800">
        <div className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2">Preview</div>
        <div className="flex gap-4">
            <div className="w-16 h-16 bg-slate-800 rounded-lg p-2 ring-2 ring-slate-700">
               <PieceIcon type="knight" pieceSet={draft.pieceSet} color={draft.theme.primary} fillColor={draft.theme.secondary} />
            </div>
            <div className="w-16 h-16 bg-slate-800 rounded-lg p-2 ring-2 ring-slate-700">
               <PieceIcon type="rook" pieceSet={draft.pieceSet} color={draft.theme.primary} fillColor={draft.theme.secondary} />
            </div>
        </div>
      </div>

      {/* Color Selection */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-300 mb-3">Color Theme</label>
        <div className="grid grid-cols-5 gap-2">
          {THEMES.map(theme => (
            <button
              key={theme.name}
              onClick={() => setDraft({ ...draft, theme })}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                draft.theme.name === theme.name ? 'border-white scale-110' : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: theme.primary }}
            >
              {draft.theme.name === theme.name && <Check size={16} className="text-slate-900" />}
            </button>
          ))}
        </div>
      </div>

      {/* Piece Set Selection */}
      <div className="mb-8">
        <label className="block text-sm font-semibold text-slate-300 mb-3">Piece Style</label>
        <div className="space-y-2">
          {SETS.map(set => (
            <button
              key={set.id}
              onClick={() => setDraft({ ...draft, pieceSet: set.id })}
              className={`w-full p-3 rounded-lg flex items-center justify-between border transition-all ${
                draft.pieceSet === set.id 
                  ? 'bg-slate-700 border-blue-500 shadow-md' 
                  : 'bg-slate-900 border-slate-700 hover:bg-slate-750'
              }`}
            >
              <span className="text-slate-200 font-medium">{set.label}</span>
              {draft.pieceSet === set.id && <Check size={18} className="text-blue-400" />}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={save}
        className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95"
      >
        Save Changes
      </button>
    </div>
  );
};
