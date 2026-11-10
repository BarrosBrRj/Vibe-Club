import React, { useState, useEffect, useRef } from 'react';
import { 
  Gamepad2, Trophy, Play, RotateCcw, ArrowUp, 
  ArrowDown, ArrowLeft, ArrowRight, Award, Sparkles 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { INITIAL_ARCADE_GAMES } from '../../data/mockData';

export const ArcadeHub: React.FC = () => {
  const { saveArcadeScore, showToast } = useApp();
  const [selectedGame, setSelectedGame] = useState<'snake' | 'memory' | 'pong' | null>(null);

  // -------------------------------------------------------------
  // 1. SNAKE GAME ENGINE
  // -------------------------------------------------------------
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [snakeScore, setSnakeScore] = useState(0);
  const [snakeGameOver, setSnakeGameOver] = useState(false);
  const [snakeRunning, setSnakeRunning] = useState(false);

  const snakeState = useRef({
    snake: [{ x: 10, y: 10 }],
    food: { x: 15, y: 15 },
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    gridSize: 20,
    tileCount: 20
  });

  const startSnakeGame = () => {
    snakeState.current.snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
    snakeState.current.dir = { x: 1, y: 0 };
    snakeState.current.nextDir = { x: 1, y: 0 };
    snakeState.current.food = { x: 15, y: 15 };
    setSnakeScore(0);
    setSnakeGameOver(false);
    setSnakeRunning(true);
  };

  useEffect(() => {
    if (selectedGame !== 'snake' || !snakeRunning) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const interval = setInterval(() => {
      const { snake, food, gridSize, tileCount } = snakeState.current;
      snakeState.current.dir = snakeState.current.nextDir;
      const head = { 
        x: snake[0].x + snakeState.current.dir.x, 
        y: snake[0].y + snakeState.current.dir.y 
      };

      // Wall collision
      if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        setSnakeGameOver(true);
        setSnakeRunning(false);
        saveArcadeScore('game_snake', snakeScore);
        return;
      }

      // Self collision
      for (let segment of snake) {
        if (segment.x === head.x && segment.y === head.y) {
          setSnakeGameOver(true);
          setSnakeRunning(false);
          saveArcadeScore('game_snake', snakeScore);
          return;
        }
      }

      snake.unshift(head);

      // Eat food
      if (head.x === food.x && head.y === food.y) {
        setSnakeScore(s => s + 10);
        snakeState.current.food = {
          x: Math.floor(Math.random() * tileCount),
          y: Math.floor(Math.random() * tileCount)
        };
      } else {
        snake.pop();
      }

      // Draw game
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw food
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(
        food.x * gridSize + gridSize / 2, 
        food.y * gridSize + gridSize / 2, 
        gridSize / 2 - 2, 
        0, 
        Math.PI * 2
      );
      ctx.fill();

      // Draw snake
      snake.forEach((seg, i) => {
        ctx.fillStyle = i === 0 ? '#a855f7' : '#c084fc';
        ctx.fillRect(seg.x * gridSize + 1, seg.y * gridSize + 1, gridSize - 2, gridSize - 2);
      });

    }, 110);

    const handleKeyDown = (e: KeyboardEvent) => {
      const { dir } = snakeState.current;
      if (e.key === 'ArrowUp' && dir.y === 0) snakeState.current.nextDir = { x: 0, y: -1 };
      if (e.key === 'ArrowDown' && dir.y === 0) snakeState.current.nextDir = { x: 0, y: 1 };
      if (e.key === 'ArrowLeft' && dir.x === 0) snakeState.current.nextDir = { x: -1, y: 0 };
      if (e.key === 'ArrowRight' && dir.x === 0) snakeState.current.nextDir = { x: 1, y: 0 };
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedGame, snakeRunning, snakeScore]);

  const changeSnakeDir = (x: number, y: number) => {
    const { dir } = snakeState.current;
    if (x !== 0 && dir.x === 0) snakeState.current.nextDir = { x, y: 0 };
    if (y !== 0 && dir.y === 0) snakeState.current.nextDir = { x: 0, y };
  };

  // -------------------------------------------------------------
  // 2. MEMORY GAME ENGINE
  // -------------------------------------------------------------
  const memoryIcons = ['🕹️', '🎸', '🍕', '🚀', '💖', '🎧'];
  const [memoryCards, setMemoryCards] = useState<{ id: number; icon: string; isFlipped: boolean; isMatched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryWon, setMemoryWon] = useState(false);

  const startMemoryGame = () => {
    const deck = [...memoryIcons, ...memoryIcons]
      .sort(() => Math.random() - 0.5)
      .map((icon, index) => ({
        id: index,
        icon,
        isFlipped: false,
        isMatched: false
      }));
    setMemoryCards(deck);
    setFlippedIndices([]);
    setMemoryMoves(0);
    setMemoryWon(false);
  };

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || memoryCards[index].isFlipped || memoryCards[index].isMatched) return;

    const newCards = [...memoryCards];
    newCards[index].isFlipped = true;
    setMemoryCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (newCards[first].icon === newCards[second].icon) {
        newCards[first].isMatched = true;
        newCards[second].isMatched = true;
        setMemoryCards(newCards);
        setFlippedIndices([]);

        // Check victory
        if (newCards.every(c => c.isMatched)) {
          setMemoryWon(true);
          const finalScore = Math.max(100, 1000 - memoryMoves * 40);
          saveArcadeScore('game_memory', finalScore);
        }
      } else {
        setTimeout(() => {
          newCards[first].isFlipped = false;
          newCards[second].isFlipped = false;
          setMemoryCards([...newCards]);
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto w-full space-y-5">
      
      {/* Arcade Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white rounded-3xl p-5 sm:p-6 shadow-xl border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-widest text-amber-400">
            <Gamepad2 className="w-4 h-4" />
            <span>VIBE ARCADE RETRÔ 🕹️</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black mt-0.5">
            Jogos Clássicos, Recordes & Conquistas
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 mt-1 max-w-xl">
            Jogue os clássicos nostálgicos no seu navegador, pontue, suba de nível e ganhe Vibes para gastar no clube!
          </p>
        </div>
      </div>

      {/* Game Selector Cards */}
      {!selectedGame ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INITIAL_ARCADE_GAMES.map(game => (
            <div
              key={game.id}
              onClick={() => {
                if (game.id === 'game_snake') {
                  setSelectedGame('snake');
                  startSnakeGame();
                } else if (game.id === 'game_memory') {
                  setSelectedGame('memory');
                  startMemoryGame();
                } else {
                  showToast('Em desenvolvimento para a próxima atualização do Vibe Arcade!', 'info');
                }
              }}
              className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="h-40 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                  <div className="text-6xl group-hover:scale-110 transition-transform">
                    {game.icon}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
                    <span className="font-extrabold text-base">{game.name}</span>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {game.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs font-bold pt-2 border-t border-slate-100">
                    <span className="text-amber-600 flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5" /> Recorde: {game.topScore} pts
                    </span>
                    <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                      +75 XP
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-4 pb-4">
                <button className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 text-white rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-purple-500/20 active:scale-95 transition-transform cursor-pointer">
                  <Play className="w-4 h-4 fill-white" />
                  <span>JOGAR AGORA</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Game Playing Stage
        <div className="space-y-4">
          
          <button
            onClick={() => setSelectedGame(null)}
            className="flex items-center gap-2 text-xs font-bold text-purple-700 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-2xs hover:bg-purple-50 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Voltar ao Salão de Jogos</span>
          </button>

          {/* 1. Playable Snake */}
          {selectedGame === 'snake' && (
            <div className="bg-slate-900 text-white rounded-3xl p-5 border border-purple-500/40 shadow-2xl flex flex-col items-center space-y-4">
              <div className="flex items-center justify-between w-full max-w-sm">
                <h3 className="font-extrabold text-sm text-purple-300 flex items-center gap-2">
                  <span>🐍 Cobrinha Vibe</span>
                </h3>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="text-amber-400">Pontos: {snakeScore}</span>
                </div>
              </div>

              {/* Canvas Board */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-purple-500/50 shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={400}
                  height={400}
                  className="bg-slate-950 w-80 h-80 sm:w-96 sm:h-96"
                />

                {snakeGameOver && (
                  <div className="absolute inset-0 bg-black/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center space-y-3">
                    <div className="text-3xl">💥</div>
                    <h4 className="text-xl font-extrabold text-rose-500">Fim de Jogo!</h4>
                    <p className="text-xs text-slate-300">Você fez <span className="text-amber-400 font-bold text-sm">{snakeScore} pontos</span>!</p>
                    <button
                      onClick={startSnakeGame}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-purple-500/30 cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4" /> Jogar Novamente
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile / Screen D-Pad */}
              <div className="flex flex-col items-center gap-1 pt-2 sm:hidden">
                <button
                  onClick={() => changeSnakeDir(0, -1)}
                  className="w-12 h-12 bg-purple-800 active:bg-purple-600 rounded-xl flex items-center justify-center text-white"
                >
                  <ArrowUp className="w-6 h-6" />
                </button>
                <div className="flex gap-4">
                  <button
                    onClick={() => changeSnakeDir(-1, 0)}
                    className="w-12 h-12 bg-purple-800 active:bg-purple-600 rounded-xl flex items-center justify-center text-white"
                  >
                    <ArrowLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => changeSnakeDir(1, 0)}
                    className="w-12 h-12 bg-purple-800 active:bg-purple-600 rounded-xl flex items-center justify-center text-white"
                  >
                    <ArrowRight className="w-6 h-6" />
                  </button>
                </div>
                <button
                  onClick={() => changeSnakeDir(0, 1)}
                  className="w-12 h-12 bg-purple-800 active:bg-purple-600 rounded-xl flex items-center justify-center text-white"
                >
                  <ArrowDown className="w-6 h-6" />
                </button>
              </div>

            </div>
          )}

          {/* 2. Playable Memory Game */}
          {selectedGame === 'memory' && (
            <div className="bg-slate-900 text-white rounded-3xl p-5 border border-purple-500/40 shadow-2xl flex flex-col items-center space-y-4">
              <div className="flex items-center justify-between w-full max-w-md">
                <h3 className="font-extrabold text-sm text-pink-300">
                  🃏 Jogo da Memória das Vibes
                </h3>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <span className="text-purple-300">Tentativas: {memoryMoves}</span>
                </div>
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 w-full max-w-md">
                {memoryCards.map((card, idx) => (
                  <div
                    key={card.id}
                    onClick={() => handleCardClick(idx)}
                    className={`aspect-square rounded-2xl flex items-center justify-center text-3xl font-bold cursor-pointer transition-all duration-300 select-none ${
                      card.isFlipped || card.isMatched
                        ? 'bg-gradient-to-tr from-purple-600 to-pink-500 text-white rotate-y-180 shadow-lg'
                        : 'bg-slate-800 hover:bg-slate-700 border border-purple-500/30'
                    }`}
                  >
                    {(card.isFlipped || card.isMatched) ? card.icon : '✨'}
                  </div>
                ))}
              </div>

              {memoryWon && (
                <div className="bg-emerald-950/80 border border-emerald-500/50 p-4 rounded-2xl text-center space-y-2 max-w-md w-full animate-in fade-in">
                  <div className="text-3xl">🎉</div>
                  <h4 className="font-extrabold text-emerald-400 text-base">Parabéns, você encontrou todos os pares!</h4>
                  <p className="text-xs text-slate-300">Você completou em {memoryMoves} jogadas.</p>
                  <button
                    onClick={startMemoryGame}
                    className="px-4 py-2 bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
                  >
                    Jogar Outra Partida
                  </button>
                </div>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
};
