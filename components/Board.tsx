import React from 'react';
import { GameState, PlayerProfile } from '../types';
import { PieceIcon } from './Icons';

interface BoardProps {
  gameState: GameState;
  p1Profile: PlayerProfile;
  p2Profile: PlayerProfile;
  onSquareClick: (index: number) => void;
}

export const Board: React.FC<BoardProps> = ({ gameState, p1Profile, p2Profile, onSquareClick }) => {
  const { board, validMoves, selectedSquare, currentTurn, winner } = gameState;

  return (
    <div className="grid grid-cols-4 gap-2 bg-slate-800 p-2 rounded-xl shadow-2xl border border-slate-700">
      {board.map((piece, index) => {
        const isSelected = selectedSquare === index;
        const isValidMove = validMoves.includes(index);
        
        // Visual helpers
        const isEnemyPiece = piece && piece.owner !== currentTurn;
        const isCapture = isValidMove && isEnemyPiece;

        // Styling classes
        let baseClasses = "w-20 h-20 sm:w-24 sm:h-24 rounded-lg flex items-center justify-center relative transition-all duration-200";
        let bgClass = "bg-slate-700 hover:bg-slate-600"; // Default
        
        // Checkerboard pattern subtle
        const x = index % 4;
        const y = Math.floor(index / 4);
        const isDark = (x + y) % 2 === 1;
        if (isDark) bgClass = "bg-slate-750 hover:bg-slate-650"; // Slightly darker

        if (isSelected) {
          bgClass = "bg-blue-600 ring-2 ring-blue-400 z-10 scale-105";
        } else if (isCapture) {
          bgClass = "bg-red-900/50 ring-2 ring-red-500 cursor-pointer";
        } else if (isValidMove) {
          bgClass = "bg-emerald-900/50 ring-2 ring-emerald-500 cursor-pointer";
        } else if (piece && piece.owner === currentTurn && !winner) {
            // My piece
            bgClass = `${isDark ? 'bg-slate-700' : 'bg-slate-600'} cursor-pointer hover:ring-2 hover:ring-slate-400`;
        }

        const profile = piece?.owner === 'p1' ? p1Profile : p2Profile;

        return (
          <div
            key={index}
            onClick={() => onSquareClick(index)}
            className={`${baseClasses} ${bgClass}`}
          >
            {/* Coordinate label for debug/pro feel (optional) */}
            <span className="absolute bottom-0.5 right-1 text-[8px] text-slate-500 opacity-30 select-none">
                {String.fromCharCode(97 + x)}{4 - y}
            </span>

            {/* Valid Move Indicator (Dot) */}
            {isValidMove && !isCapture && (
               <div className="absolute w-4 h-4 bg-emerald-500/50 rounded-full animate-pulse pointer-events-none" />
            )}

            {/* Piece */}
            {piece && (
              <div className={`w-3/4 h-3/4 transition-transform ${isSelected ? '-translate-y-1' : ''}`}>
                 <PieceIcon 
                    type={piece.type} 
                    pieceSet={profile.pieceSet}
                    color={profile.theme.primary}
                    fillColor={profile.theme.secondary}
                 />
                 {piece.type === 'pawn' && (
                     <div className={`absolute -top-1 -right-1 text-[10px] font-bold px-1 rounded bg-slate-900 border border-slate-600 text-slate-400`}>
                        {piece.direction === -1 ? '↑' : '↓'}
                     </div>
                 )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
