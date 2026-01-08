import React, { useState } from 'react';
import { PlayerProfile } from '../types';
import { User, Swords, Palette, LogOut, Copy, Check } from 'lucide-react';

interface LobbyProps {
  user: PlayerProfile;
  onJoinGame: () => void;
  onCreateGame: () => void;
  onCustomize: () => void;
  onLogout: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({ user, onJoinGame, onCreateGame, onCustomize, onLogout }) => {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteCode] = useState(() => Math.random().toString(36).substring(2, 8).toUpperCase());
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState('');

  const copyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (showInvite) {
    return (
      <div className="w-full max-w-md bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-2xl text-center animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-bold text-white mb-2">Challenge Friend</h2>
        <p className="text-slate-400 mb-6">Share this code with your friend to start.</p>
        
        <div className="bg-slate-900 p-4 rounded-lg flex items-center justify-between mb-8 border border-slate-700">
          <span className="text-2xl font-mono text-emerald-400 tracking-widest font-bold">{inviteCode}</span>
          <button onClick={copyCode} className="p-2 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors">
            {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
          </button>
        </div>

        <div className="text-sm text-slate-500 mb-6 animate-pulse">
          Waiting for opponent to join...
        </div>

        <button 
          onClick={onCreateGame} // Simulating connection success
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all"
        >
          Start Game (Simulated)
        </button>
        
        <button 
          onClick={() => setShowInvite(false)}
          className="mt-4 text-slate-400 hover:text-slate-200 text-sm"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Header Profile */}
      <div className="bg-slate-800/80 backdrop-blur p-4 rounded-xl border border-slate-700 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <div 
             className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-slate-900 bg-white"
             style={{ borderColor: user.theme.primary }}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="text-white font-bold">{user.username}</div>
            <div className="text-xs text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Online
            </div>
          </div>
        </div>
        <button onClick={onLogout} className="text-slate-500 hover:text-rose-400 transition-colors">
            <LogOut size={20} />
        </button>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={() => setShowInvite(true)}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-6 rounded-xl flex flex-col items-center gap-3 transition-all hover:-translate-y-1 hover:shadow-xl group"
        >
          <div className="w-12 h-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <Swords size={24} />
          </div>
          <span className="font-bold text-slate-200">Create Game</span>
        </button>

        <button 
          onClick={onCustomize}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-6 rounded-xl flex flex-col items-center gap-3 transition-all hover:-translate-y-1 hover:shadow-xl group"
        >
          <div className="w-12 h-12 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center group-hover:bg-purple-500 group-hover:text-white transition-colors">
            <Palette size={24} />
          </div>
          <span className="font-bold text-slate-200">Customize</span>
        </button>
      </div>

      {/* Join Game Section */}
      <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 shadow-lg">
         <h3 className="text-slate-300 font-bold mb-3 text-sm uppercase tracking-wide">Join Friend</h3>
         <div className="flex gap-2">
            <input 
                type="text" 
                placeholder="ENTER CODE"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                className="bg-slate-900 border border-slate-700 text-white px-4 py-2 rounded-lg flex-1 focus:outline-none focus:border-blue-500 tracking-widest font-mono"
                maxLength={6}
            />
            <button 
                onClick={onJoinGame}
                disabled={joinCode.length < 4}
                className="bg-slate-700 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold px-4 py-2 rounded-lg transition-colors"
            >
                Join
            </button>
         </div>
      </div>
    </div>
  );
};
