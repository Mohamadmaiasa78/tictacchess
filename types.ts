export type Player = 'p1' | 'p2';

export type PieceType = 'pawn' | 'rook' | 'knight' | 'bishop';
export type PieceSet = 'classic' | 'geometric' | 'retro';

export interface ColorTheme {
  name: string;
  primary: string; // Hex for stroke/main
  secondary: string; // Hex for fill/bg
  accent: string; // Tailwind class for UI highlights (e.g., 'emerald-400')
}

export interface PlayerProfile {
  username: string;
  pieceSet: PieceSet;
  theme: ColorTheme;
}

export interface Piece {
  id: string;
  type: PieceType;
  owner: Player;
  direction?: number; 
}

export interface GameState {
  board: (Piece | null)[];
  hands: {
    p1: Piece[];
    p2: Piece[];
  };
  currentTurn: Player;
  winner: Player | 'draw' | null;
  moveHistory: string[];
  selectedSquare: number | null;
  selectedHandPieceId: string | null;
  validMoves: number[];
}

export const GRID_SIZE = 4;
export const CELL_COUNT = 16;

export type AppView = 'auth' | 'lobby' | 'customize' | 'game' | 'join';
