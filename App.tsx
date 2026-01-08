import React, { useState, useEffect } from 'react';
import { Board } from './components/Board';
import { Hand } from './components/Hand';
import { Auth } from './components/Auth';
import { Lobby } from './components/Lobby';
import { Customize } from './components/Customize';
import { GameState, PlayerProfile, AppView } from './types';
import { getInitialState as generateInitialGame, getValidMoves, checkWin, updatePawnDirection, serializeBoard } from './utils/gameLogic';
import { RefreshCcw, Info, Trophy, AlertTriangle, ArrowLeft } from 'lucide-react';

const DEFAULT_THEME_P1 = { name: 'Emerald', primary: '#34d399', secondary: 'rgba(52, 211, 153, 0.2)', accent: 'emerald-400' };
const DEFAULT_THEME_P2 = { name: 'Rose', primary: '#fb7185', secondary: 'rgba(251, 113, 133, 0.2)', accent: 'rose-400' };

const App: React.FC = () => {
  // --- STATE ---
  const [view, setView] = useState<AppView>('auth');
  const [user, setUser] = useState<PlayerProfile | null>(null);
  const [opponent, setOpponent] = useState<PlayerProfile | null>(null);
  const [gameState, setGameState] = useState<GameState>(generateInitialGame());
  const [showRules, setShowRules] = useState(false);

  // --- PERSISTENCE ---
  useEffect(() => {
    const savedUser = localStorage.getItem('chess-ttt-user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setView('lobby');
    }
  }, []);

  // --- ACTIONS ---

  const handleLogin = (username: string) => {
    const newUser: PlayerProfile = {
      username,
      pieceSet: 'classic',
      theme: DEFAULT_THEME_P1
    };
    setUser(newUser);
    localStorage.setItem('chess-ttt-user', JSON.stringify(newUser));
    setView('lobby');
  };

  const handleLogout = () => {
    localStorage.removeItem('chess-ttt-user');
    setUser(null);
    setView('auth');
  };

  const handleSaveProfile = (updatedProfile: PlayerProfile) => {
    setUser(updatedProfile);
    localStorage.setItem('chess-ttt-user', JSON.stringify(updatedProfile));
    setView('lobby');
  };

  const handleStartGame = () => {
    // Generate a simulated opponent
    setOpponent({
      username: 'Opponent',
      pieceSet: 'classic', // Opponent usually matches or has default
      theme: DEFAULT_THEME_P2
    });
    setGameState(generateInitialGame());
    setView('game');
  };

  const handleReturnToLobby = () => {
    setView('lobby');
  };

  // --- GAME LOGIC (Wrapped) ---
  // We reuse the logic from the previous file, just scoped here
  const { board, hands, currentTurn, winner, validMoves, selectedHandPieceId, selectedSquare, moveHistory } = gameState;
  const isPlacementPhaseStrict = board.filter(p => p?.owner === currentTurn).length < 3;

  const handleHandSelect = (pieceId: string) => {
    if (winner) return;
    setGameState(prev => ({
      ...prev,
      selectedSquare: null,
      selectedHandPieceId: pieceId,
      validMoves: board.map((p, i) => p === null ? i : -1).filter(i => i !== -1)
    }));
  };

  const handleBoardClick = (index: number) => {
    if (winner) return;
    const clickedPiece = board[index];
    const isMyPiece = clickedPiece?.owner === currentTurn;

    if (selectedHandPieceId) {
      if (validMoves.includes(index)) {
        // PLACE
        const pieceToPlace = hands[currentTurn].find(p => p.id === selectedHandPieceId);
        if (!pieceToPlace) return;
        const newBoard = [...board];
        newBoard[index] = pieceToPlace;
        const newHands = { ...hands, [currentTurn]: hands[currentTurn].filter(p => p.id !== selectedHandPieceId) };
        finalizeTurn(newBoard, newHands);
      } else if (isMyPiece && !isPlacementPhaseStrict) {
        selectBoardPiece(index);
      } else {
        cancelSelection();
      }
      return;
    }

    if (isMyPiece) {
      if (isPlacementPhaseStrict) return;
      selectBoardPiece(index);
      return;
    }

    if (selectedSquare !== null && validMoves.includes(index)) {
      // MOVE
      const pieceToMove = board[selectedSquare];
      if (!pieceToMove) return;
      const targetPiece = board[index];
      const newBoard = [...board];
      const newHands = { ...hands };
      if (targetPiece) {
        newHands[targetPiece.owner] = [...newHands[targetPiece.owner], targetPiece];
      }
      let finalPiece = updatePawnDirection(pieceToMove, index);
      newBoard[selectedSquare] = null;
      newBoard[index] = finalPiece;
      finalizeTurn(newBoard, newHands);
      return;
    }
    cancelSelection();
  };

  const selectBoardPiece = (index: number) => {
    const piece = board[index];
    if (!piece) return;
    const moves = getValidMoves(board, index, piece);
    setGameState(prev => ({ ...prev, selectedHandPieceId: null, selectedSquare: index, validMoves: moves }));
  };

  const finalizeTurn = (newBoard: (import('./types').Piece | null)[], newHands: any) => {
    const gameWinner = checkWin(newBoard);
    const newHistory = [...moveHistory, serializeBoard(newBoard)];
    const occurrences = newHistory.filter(h => h === newHistory[newHistory.length - 1]).length;
    
    setGameState({
      board: newBoard,
      hands: newHands,
      currentTurn: currentTurn === 'p1' ? 'p2' : 'p1',
      winner: gameWinner ? gameWinner : (occurrences >= 3 ? 'draw' : null),
      moveHistory: newHistory,
      selectedSquare: null,
      selectedHandPieceId: null,
      validMoves: []
    });
  };

  const cancelSelection = () => setGameState(prev => ({ ...prev, selectedSquare: null, selectedHandPieceId: null, validMoves: [] }));


  // --- RENDER VIEWS ---

  if (!user || view === 'auth') {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <Auth onLogin={handleLogin} />
      </div>
    );
  }

  if (view === 'customize') {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <Customize user={user} onSave={handleSaveProfile} onBack={() => setView('lobby')} />
      </div>
    );
  }

  if (view === 'lobby') {
    return (
      <div className="w-full h-full flex items-center justify-center p-4">
        <Lobby 
          user={user} 
          onCreateGame={handleStartGame} 
          onJoinGame={handleStartGame} 
          onCustomize={() => setView('customize')}
          onLogout={handleLogout}
        />
      </div>
    );
  }

  // --- GAME VIEW ---

  return (
    <div className="flex flex-col items-center w-full max-w-lg p-4 gap-6 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <button onClick={handleReturnToLobby} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white">
           <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
          VS {opponent?.username || "Opponent"}
        </h1>
        <button 
          onClick={() => setShowRules(!showRules)}
          className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <Info size={24} />
        </button>
      </div>

      {/* Rules Modal */}
      {showRules && (
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 text-sm leading-relaxed shadow-xl w-full relative z-30">
          <h3 className="font-bold text-lg mb-2 text-white">How to Play</h3>
           <ul className="list-disc list-inside space-y-2 text-slate-300">
            <li><strong>Goal:</strong> Get 4 of your pieces in a row.</li>
            <li><strong>Phase 1:</strong> Place pieces until 3 are on board.</li>
            <li><strong>Phase 2:</strong> Place OR Move existing pieces.</li>
            <li><strong>Capture:</strong> Returns enemy piece to their hand.</li>
          </ul>
          <button onClick={() => setShowRules(false)} className="mt-4 w-full py-2 bg-blue-600 rounded font-bold">Got it</button>
        </div>
      )}

      {/* Opponent Hand (P2) */}
      <Hand 
        player="p2" 
        profile={opponent || { username: 'Player 2', pieceSet: 'classic', theme: DEFAULT_THEME_P2 }}
        pieces={hands.p2} 
        isActive={currentTurn === 'p2' && !winner} 
        selectedPieceId={selectedHandPieceId}
        onPieceSelect={handleHandSelect}
        isSelf={false}
        label=""
      />

      {/* Game Board */}
      <div className="relative">
        <Board 
            gameState={gameState} 
            p1Profile={user} 
            p2Profile={opponent || { username: 'Player 2', pieceSet: 'classic', theme: DEFAULT_THEME_P2 }}
            onSquareClick={handleBoardClick} 
        />
        
        {/* Game Over Overlay */}
        {winner && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-xl">
                <div className="text-center p-6 bg-slate-800 rounded-xl border border-slate-600 shadow-2xl animate-in zoom-in">
                    {winner === 'draw' ? (
                        <>
                            <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-2" />
                            <h2 className="text-3xl font-bold text-white mb-1">Draw!</h2>
                        </>
                    ) : (
                        <>
                            <Trophy className={`w-16 h-16 mx-auto mb-2 ${winner === 'p1' ? `text-${user.theme.accent}` : `text-${opponent?.theme.accent || 'rose-400'}`}`} />
                            <h2 className="text-3xl font-bold text-white mb-1">
                                {winner === 'p1' ? user.username : opponent?.username} Wins!
                            </h2>
                        </>
                    )}
                    <div className="mt-6 flex gap-3">
                        <button onClick={handleStartGame} className="px-6 py-2 bg-white text-slate-900 font-bold rounded-full hover:scale-105 transition-transform">
                            Rematch
                        </button>
                        <button onClick={handleReturnToLobby} className="px-6 py-2 bg-slate-700 text-white font-bold rounded-full hover:bg-slate-600 transition-colors">
                            Leave
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Player Hand (P1 - You) */}
      <Hand 
        player="p1" 
        profile={user}
        pieces={hands.p1} 
        isActive={currentTurn === 'p1' && !winner} 
        selectedPieceId={selectedHandPieceId}
        onPieceSelect={handleHandSelect}
        isSelf={true}
        label=""
      />

      {/* Action Bar */}
      {!winner && (
        <div className="flex items-center gap-4 text-sm text-slate-400">
           <span className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full" style={{ backgroundColor: currentTurn === 'p1' ? user.theme.primary : opponent?.theme.primary }}></div>
             {currentTurn === 'p1' ? "Your Turn" : "Opponent's Turn"}
           </span>
        </div>
      )}
      
      {isPlacementPhaseStrict && !winner && (
         <div className="text-xs text-amber-400 animate-pulse">
            Placement Phase: You must place pieces.
         </div>
      )}
    </div>
  );
};

export default App;