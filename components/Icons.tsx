import React from 'react';
import { PieceType, PieceSet } from '../types';

interface PieceIconProps {
  type: PieceType;
  pieceSet: PieceSet;
  color: string; // Primary stroke color
  fillColor: string; // Secondary fill color
  className?: string;
}

export const PieceIcon: React.FC<PieceIconProps> = ({ type, pieceSet, color, fillColor, className = '' }) => {
  const commonProps = {
    stroke: color,
    fill: fillColor,
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className: `w-full h-full p-2 ${className}`,
  };

  // --- GEOMETRIC SET ---
  if (pieceSet === 'geometric') {
    switch (type) {
      case 'pawn':
        return (
          <svg viewBox="0 0 24 24" {...commonProps}>
            <circle cx="12" cy="12" r="6" strokeWidth="3" />
            <path d="M12 4V8" />
            <path d="M12 16V20" />
          </svg>
        );
      case 'rook':
        return (
          <svg viewBox="0 0 24 24" {...commonProps}>
            <rect x="6" y="6" width="12" height="12" rx="1" strokeWidth="3" />
            <path d="M6 6L18 18" />
            <path d="M18 6L6 18" />
          </svg>
        );
      case 'knight':
        return (
          <svg viewBox="0 0 24 24" {...commonProps}>
             <path d="M12 2L2 22H22L12 2Z" strokeWidth="3" />
             <circle cx="12" cy="14" r="2" fill={color} stroke="none"/>
          </svg>
        );
      case 'bishop':
        return (
          <svg viewBox="0 0 24 24" {...commonProps}>
             <path d="M12 2L22 12L12 22L2 12Z" strokeWidth="3" />
             <path d="M12 2V22" />
             <path d="M2 12H22" />
          </svg>
        );
    }
  }

  // --- RETRO (PIXEL) SET ---
  if (pieceSet === 'retro') {
    // Simulating pixel art with rects
    switch (type) {
      case 'pawn':
        return (
          <svg viewBox="0 0 24 24" {...commonProps} fill={color} stroke="none">
             <rect x="10" y="4" width="4" height="4" />
             <rect x="8" y="8" width="8" height="8" />
             <rect x="6" y="16" width="12" height="4" />
          </svg>
        );
      case 'rook':
        return (
          <svg viewBox="0 0 24 24" {...commonProps} fill={color} stroke="none">
             <rect x="4" y="4" width="4" height="6" />
             <rect x="16" y="4" width="4" height="6" />
             <rect x="4" y="10" width="16" height="10" />
             <rect x="2" y="20" width="20" height="2" />
          </svg>
        );
      case 'knight':
        return (
          <svg viewBox="0 0 24 24" {...commonProps} fill={color} stroke="none">
             <rect x="8" y="4" width="6" height="4" />
             <rect x="6" y="8" width="4" height="4" />
             <rect x="10" y="8" width="8" height="4" />
             <rect x="10" y="12" width="4" height="8" />
             <rect x="6" y="20" width="12" height="2" />
          </svg>
        );
      case 'bishop':
        return (
          <svg viewBox="0 0 24 24" {...commonProps} fill={color} stroke="none">
             <rect x="10" y="2" width="4" height="4" />
             <rect x="8" y="6" width="8" height="4" />
             <rect x="6" y="10" width="12" height="8" />
             <rect x="4" y="18" width="16" height="4" />
          </svg>
        );
    }
  }

  // --- CLASSIC SET (Default) ---
  switch (type) {
    case 'pawn':
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path d="M12 2L12 22" strokeWidth="3" />
          <circle cx="12" cy="6" r="3" />
          <path d="M7 22H17" />
          <path d="M9 14H15" />
        </svg>
      );
    case 'rook':
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path d="M5 20H19V14H5V20Z" />
          <path d="M5 20H19" strokeWidth="3"/>
          <path d="M7 4V14" />
          <path d="M17 4V14" />
          <rect x="5" y="4" width="14" height="4" />
          <path d="M9 4V2" />
          <path d="M12 4V2" />
          <path d="M15 4V2" />
        </svg>
      );
    case 'knight':
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path d="M19 19C19 20.6 17.6 22 16 22H8C6.4 22 5 20.6 5 19V18H19V19Z" />
          <path d="M11 2C13 2 15 3 15 6C15 7.5 14 9 12 11C12 11 15 11 16 13C17 15 16 18 16 18H5C5 18 4 14 7 11C6 10 5 9 5 9C5 9 6 5 8 4C9 3 11 2 11 2Z" />
          <circle cx="11" cy="6" r="1" fill={color} stroke="none" />
        </svg>
      );
    case 'bishop':
      return (
        <svg viewBox="0 0 24 24" {...commonProps}>
          <path d="M12 2L12 22" />
          <path d="M12 2L6 10L12 18L18 10L12 2Z" />
          <path d="M12 22H8" />
          <path d="M12 22H16" />
          <line x1="9" y1="9" x2="15" y2="9" />
        </svg>
      );
    default:
      return null;
  }
};
