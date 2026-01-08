import React, { useState } from 'react';
import { Play } from 'lucide-react';

interface AuthProps {
  onLogin: (username: string) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name.trim());
    }
  };

  return (
    <div className="w-full max-w-sm animate-in fade-in zoom-in duration-500">
      <div className="text-center mb-8">
         <h1 className="text-4xl font-extrabold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent mb-2">
            Chess Tic-Tac-Toe
         </h1>
         <p className="text-slate-400">Strategy on a 4x4 Grid.</p>
      </div>

      <div className="bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold text-slate-300 mb-2">Choose your Username</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. GrandmasterFlex"
              className="w-full bg-slate-900 border border-slate-700 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-lg px-4 py-3 text-white placeholder-slate-600 outline-none transition-all"
              autoFocus
              maxLength={12}
            />
          </div>
          
          <button 
            type="submit"
            disabled={!name.trim()}
            className="mt-2 w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            <span>Enter Arena</span>
            <Play size={16} fill="currentColor" />
          </button>
        </form>
      </div>
    </div>
  );
};
