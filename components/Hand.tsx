import React from 'react';
import { Piece, Player, PlayerProfile } from '../types';
import { PieceIcon } from './Icons';

interface HandProps {
  player: Player;
  profile: PlayerProfile;
  pieces: Piece[];
  isActive: boolean;
  selectedPieceId: string | null;
  onPieceSelect: (pieceId: string) => void;
  isSelf: boolean; // Is this the logged-in user?
}

export const Hand: React.FC<HandProps> = ({ player, profile, pieces, isActive, selectedPieceId, onPieceSelect, isSelf }) => {
  return (
    <div className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-colors duration-300 w-full ${isActive ? `bg-slate-800 border-2 border-${profile.theme.accent} shadow-lg shadow-${profile.theme.accent}/20` : 'bg-slate-900 border border-slate-800 opacity-70'}`}>
      <div className="flex items-center gap-2 mb-1 w-full justify-between px-2">
        <div className="flex items-center gap-2">
            <div 
                className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold text-slate-900 bg-white"
                style={{ borderColor: profile.theme.primary }}
            >
                {profile.username.substring(0, 1).toUpperCase()}
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
            {profile.username} {isSelf && "(You)"}
            </h3>
        </div>
        
        {isActive && <span className="flex h-2 w-2 relative">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-${profile.theme.accent}`}></span>
            <span className={`relative inline-flex rounded-full h-2 w-2 bg-${profile.theme.accent}`}></span>
        </span>}
      </div>
      
      <div className="flex gap-2 min-h-[60px] items-center justify-center bg-slate-950/50 w-full rounded-lg p-2 border-inner">
        {pieces.length === 0 && (
          <span className="text-xs text-slate-600 italic">Empty Hand</span>
        )}
        {pieces.map((piece) => {
          const isSelected = selectedPieceId === piece.id;
          return (
            <button
              key={piece.id}
              onClick={() => isActive && onPieceSelect(piece.id)}
              disabled={!isActive}
              className={`
                relative w-12 h-12 p-1 rounded-md transition-all
                ${isSelected ? `bg-${profile.theme.accent}/20 ring-2 ring-${profile.theme.accent} scale-110` : 'hover:bg-slate-700'}
                ${!isActive ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
              `}
            >
              <PieceIcon 
                type={piece.type} 
                pieceSet={profile.pieceSet}
                color={profile.theme.primary} 
                fillColor={profile.theme.secondary}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};
