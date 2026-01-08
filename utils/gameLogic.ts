import { GameState, Piece, Player, GRID_SIZE, CELL_COUNT } from '../types';

// Initialize Game State
export const getInitialState = (): GameState => {
  const p1Pieces: Piece[] = [
    { id: 'p1-pawn', type: 'pawn', owner: 'p1', direction: -1 }, // P1 moves UP (index decreases)
    { id: 'p1-rook', type: 'rook', owner: 'p1' },
    { id: 'p1-knight', type: 'knight', owner: 'p1' },
    { id: 'p1-bishop', type: 'bishop', owner: 'p1' },
  ];
  const p2Pieces: Piece[] = [
    { id: 'p2-pawn', type: 'pawn', owner: 'p2', direction: 1 }, // P2 moves DOWN (index increases)
    { id: 'p2-rook', type: 'rook', owner: 'p2' },
    { id: 'p2-knight', type: 'knight', owner: 'p2' },
    { id: 'p2-bishop', type: 'bishop', owner: 'p2' },
  ];

  return {
    board: Array(CELL_COUNT).fill(null),
    hands: {
      p1: p1Pieces,
      p2: p2Pieces,
    },
    currentTurn: 'p1',
    winner: null,
    moveHistory: [],
    selectedSquare: null,
    selectedHandPieceId: null,
    validMoves: [],
  };
};

// Convert Index to X/Y
const getCoords = (index: number) => ({
  x: index % GRID_SIZE,
  y: Math.floor(index / GRID_SIZE),
});

// Convert X/Y to Index
const getIndex = (x: number, y: number) => {
  if (x < 0 || x >= GRID_SIZE || y < 0 || y >= GRID_SIZE) return -1;
  return y * GRID_SIZE + x;
};

// Check for Win
export const checkWin = (board: (Piece | null)[]): Player | null => {
  const lines = [
    // Rows
    [0, 1, 2, 3], [4, 5, 6, 7], [8, 9, 10, 11], [12, 13, 14, 15],
    // Cols
    [0, 4, 8, 12], [1, 5, 9, 13], [2, 6, 10, 14], [3, 7, 11, 15],
    // Diagonals
    [0, 5, 10, 15], [3, 6, 9, 12],
  ];

  for (const line of lines) {
    const p0 = board[line[0]];
    if (p0 && line.every(idx => board[idx]?.owner === p0.owner)) {
      return p0.owner;
    }
  }
  return null;
};

// Get Valid Moves for a Piece on the Board
export const getValidMoves = (
  board: (Piece | null)[],
  index: number,
  piece: Piece
): number[] => {
  const moves: number[] = [];
  const { x, y } = getCoords(index);

  const addMoveIfValid = (tx: number, ty: number): boolean => {
    // Returns true if we should stop looking in this direction (blocked or capture)
    const tIndex = getIndex(tx, ty);
    if (tIndex === -1) return true; // Out of bounds

    const targetPiece = board[tIndex];
    if (!targetPiece) {
      moves.push(tIndex); // Empty square
      return false; // Continue
    } else {
      if (targetPiece.owner !== piece.owner) {
        moves.push(tIndex); // Capture
      }
      return true; // Blocked by piece (friendly or enemy)
    }
  };

  if (piece.type === 'rook') {
    // Horizontal and Vertical
    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];
    for (const [dx, dy] of directions) {
      let cx = x + dx;
      let cy = y + dy;
      while (true) {
        if (addMoveIfValid(cx, cy)) break;
        cx += dx;
        cy += dy;
      }
    }
  } else if (piece.type === 'bishop') {
    // Diagonals
    const directions = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
    for (const [dx, dy] of directions) {
      let cx = x + dx;
      let cy = y + dy;
      while (true) {
        if (addMoveIfValid(cx, cy)) break;
        cx += dx;
        cy += dy;
      }
    }
  } else if (piece.type === 'knight') {
    // L-shapes
    const jumps = [
      [2, 1], [2, -1], [-2, 1], [-2, -1],
      [1, 2], [1, -2], [-1, 2], [-1, -2]
    ];
    for (const [dx, dy] of jumps) {
      addMoveIfValid(x + dx, y + dy);
    }
  } else if (piece.type === 'pawn') {
    // 1 step forward based on direction
    const dir = piece.direction || (piece.owner === 'p1' ? -1 : 1);
    
    // According to the prompt:
    // "Beweegt 1 vakje recht vooruit" (Moves 1 square straight forward)
    // "Slaan: ... wordt dat stuk geslagen" (Capturing is done by moving to the square)
    // Unlike chess, pawns here capture straight ahead because of the 4x4 constraints 
    // and simplicity described in the prompt ("verplaatsen naar een vakje").
    
    addMoveIfValid(x, y + dir);
  }

  return moves;
};

export const updatePawnDirection = (piece: Piece, newIndex: number): Piece => {
  if (piece.type !== 'pawn') return piece;
  
  const { y } = getCoords(newIndex);
  let newDirection = piece.direction;

  // "Als de pion de overkant bereikt, draait hij simpelweg om"
  // Top edge is y=0, Bottom edge is y=3
  if (y === 0 && newDirection === -1) {
    newDirection = 1;
  } else if (y === 3 && newDirection === 1) {
    newDirection = -1;
  }

  return { ...piece, direction: newDirection };
};

export const serializeBoard = (board: (Piece | null)[]): string => {
  return board.map(p => p ? `${p.owner}-${p.id}` : 'x').join('|');
};
