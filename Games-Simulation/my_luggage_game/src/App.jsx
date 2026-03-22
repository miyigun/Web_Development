import React, { useState, useEffect, useRef } from 'react';
import { Plane, Package, Clock, RotateCcw, ChevronRight, Trophy, AlertCircle } from 'lucide-react';

// --- Sabitler ---
const GRID_SIZE = 6;
const CELL_SIZE = 60; // Mobil uyumlu olması için dinamikleşecek

const INITIAL_LEVELS = [
  {
    id: 1,
    name: 'İSTANBUL - İÇ HATLAR',
    targetBlock: { id: 'priority', x: 0, y: 2, len: 2, axis: 'h', type: 'priority' },
    blocks: [
      { id: 'b1', x: 2, y: 0, len: 3, axis: 'v', type: 'cargo' },
      { id: 'b2', x: 3, y: 1, len: 2, axis: 'h', type: 'bag' },
      { id: 'b3', x: 3, y: 2, len: 2, axis: 'v', type: 'bag' },
      { id: 'b4', x: 4, y: 3, len: 2, axis: 'v', type: 'bag' },
      { id: 'b5', x: 0, y: 4, len: 3, axis: 'h', type: 'cargo' },
    ]
  },
  {
    id: 2,
    name: 'LONDRA - AKTARMA',
    targetBlock: { id: 'priority', x: 1, y: 2, len: 2, axis: 'h', type: 'priority' },
    blocks: [
      { id: 'b1', x: 0, y: 0, len: 2, axis: 'v', type: 'bag' },
      { id: 'b2', x: 1, y: 0, len: 2, axis: 'h', type: 'bag' },
      { id: 'b3', x: 3, y: 1, len: 2, axis: 'v', type: 'bag' },
      { id: 'b4', x: 4, y: 0, len: 3, axis: 'v', type: 'cargo' },
      { id: 'b5', x: 5, y: 1, len: 2, axis: 'v', type: 'bag' },
      { id: 'b6', x: 0, y: 3, len: 3, axis: 'h', type: 'cargo' },
      { id: 'b7', x: 3, y: 4, len: 2, axis: 'v', type: 'bag' },
    ]
  },
  {
    id: 3,
    name: 'NEW YORK - JFK',
    targetBlock: { id: 'priority', x: 0, y: 2, len: 2, axis: 'h', type: 'priority' },
    blocks: [
      { id: 'b1', x: 0, y: 0, len: 2, axis: 'v', type: 'bag' },
      { id: 'b2', x: 1, y: 0, len: 2, axis: 'h', type: 'bag' },
      { id: 'b3', x: 1, y: 1, len: 2, axis: 'h', type: 'bag' },
      { id: 'b4', x: 3, y: 0, len: 3, axis: 'v', type: 'cargo' },
      { id: 'b5', x: 1, y: 3, len: 3, axis: 'h', type: 'cargo' },
      { id: 'b6', x: 4, y: 0, len: 2, axis: 'h', type: 'bag' },
      { id: 'b7', x: 4, y: 3, len: 2, axis: 'v', type: 'bag' },
      { id: 'b8', x: 5, y: 2, len: 2, axis: 'v', type: 'bag' },
      { id: 'b9', x: 0, y: 4, len: 3, axis: 'h', type: 'cargo' },
      { id: 'b10', x: 4, y: 5, len: 2, axis: 'h', type: 'bag' },
    ]
  },
  {
    id: 4,
    name: 'TOKYO - HANEDA',
    targetBlock: { id: 'priority', x: 0, y: 2, len: 2, axis: 'h', type: 'priority' },
    blocks: [
      { id: 'b1', x: 0, y: 0, len: 2, axis: 'h', type: 'bag' },
      { id: 'b2', x: 2, y: 0, len: 3, axis: 'h', type: 'cargo' },
      { id: 'b3', x: 5, y: 0, len: 3, axis: 'v', type: 'cargo' },
      { id: 'b4', x: 0, y: 3, len: 2, axis: 'v', type: 'bag' },
      { id: 'b5', x: 2, y: 1, len: 2, axis: 'v', type: 'bag' },
      { id: 'b6', x: 3, y: 1, len: 2, axis: 'v', type: 'bag' },
      { id: 'b7', x: 2, y: 3, len: 2, axis: 'h', type: 'bag' },
      { id: 'b8', x: 4, y: 2, len: 2, axis: 'v', type: 'bag' },
      { id: 'b9', x: 0, y: 5, len: 2, axis: 'h', type: 'bag' },
      { id: 'b10', x: 2, y: 5, len: 2, axis: 'h', type: 'bag' },
    ]
  },
  {
    id: 5,
    name: 'DUBAI - KARGO',
    targetBlock: { id: 'priority', x: 0, y: 2, len: 2, axis: 'h', type: 'priority' },
    blocks: [
      { id: 'b1', x: 0, y: 0, len: 2, axis: 'v', type: 'bag' },
      { id: 'b2', x: 1, y: 0, len: 2, axis: 'h', type: 'bag' },
      { id: 'b3', x: 3, y: 0, len: 3, axis: 'v', type: 'cargo' },
      { id: 'b4', x: 4, y: 1, len: 2, axis: 'v', type: 'bag' },
      { id: 'b5', x: 2, y: 2, len: 2, axis: 'v', type: 'bag' },
      { id: 'b6', x: 4, y: 3, len: 2, axis: 'h', type: 'bag' },
      { id: 'b7', x: 0, y: 3, len: 2, axis: 'h', type: 'bag' },
      { id: 'b8', x: 0, y: 4, len: 2, axis: 'v', type: 'bag' },
      { id: 'b9', x: 2, y: 4, len: 2, axis: 'h', type: 'bag' },
      { id: 'b10', x: 4, y: 5, len: 2, axis: 'h', type: 'bag' },
      { id: 'b11', x: 2, y: 5, len: 2, axis: 'h', type: 'bag' },
    ]
  }
];

const App = () => {
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [blocks, setBlocks] = useState([]);
  const [moves, setMoves] = useState(0);
  const [isWon, setIsWon] = useState(false);
  const [isGameCompleted, setIsGameCompleted] = useState(false);
  const [totalMoves, setTotalMoves] = useState(0);
  const [draggingId, setDraggingId] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [initialBlockPos, setInitialBlockPos] = useState({ x: 0, y: 0 });

  const boardRef = useRef(null);

  // Seviye yükleme
  useEffect(() => {
    const level = INITIAL_LEVELS[currentLevelIdx];
    setBlocks([level.targetBlock, ...level.blocks]);
    setMoves(0);
    setIsWon(false);
  }, [currentLevelIdx]);

  // Çarpışma ve Hareket Kontrolü
  const canMoveTo = (blockId, newX, newY, currentBlocks) => {
    const block = currentBlocks.find(b => b.id === blockId);
    
    // Duvar sınırları
    if (newX < 0 || newY < 0) return false;
    if (block.axis === 'h' && newX + block.len > GRID_SIZE) return false;
    if (block.axis === 'v' && newY + block.len > GRID_SIZE) return false;
    if (block.axis === 'h' && newY >= GRID_SIZE) return false;
    if (block.axis === 'v' && newX >= GRID_SIZE) return false;

    // Diğer bloklarla çarpışma
    for (const b of currentBlocks) {
      if (b.id === blockId) continue;
      
      const bCells = [];
      for(let i=0; i<b.len; i++) {
        bCells.push(b.axis === 'h' ? {x: b.x + i, y: b.y} : {x: b.x, y: b.y + i});
      }

      for(let i=0; i<block.len; i++) {
        const currX = block.axis === 'h' ? newX + i : newX;
        const currY = block.axis === 'v' ? newY + i : newY;
        if (bCells.some(c => c.x === currX && c.y === currY)) return false;
      }
    }
    return true;
  };

  const handleStart = (e, id) => {
    if (isWon) return;
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const block = blocks.find(b => b.id === id);
    setDraggingId(id);
    setDragStart({ x: clientX, y: clientY });
    setInitialBlockPos({ x: block.x, y: block.y });
  };

  const handleMove = (e) => {
    if (!draggingId) return;

    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;

    const dx = (clientX - dragStart.x) / 60; // 60px cell size
    const dy = (clientY - dragStart.y) / 60;

    setBlocks(prev => {
      const block = prev.find(b => b.id === draggingId);
      let newX = initialBlockPos.x;
      let newY = initialBlockPos.y;

      if (block.axis === 'h') {
        newX = Math.round(initialBlockPos.x + dx);
      } else {
        newY = Math.round(initialBlockPos.y + dy);
      }

      // Adım adım kontrol (atlamayı önlemek için)
      const step = (block.axis === 'h' ? newX - block.x : newY - block.y);
      if (step === 0) return prev;
      
      const dir = step > 0 ? 1 : -1;
      let finalX = block.x;
      let finalY = block.y;

      for (let i = 1; i <= Math.abs(step); i++) {
        const testX = block.axis === 'h' ? block.x + (i * dir) : block.x;
        const testY = block.axis === 'v' ? block.y + (i * dir) : block.y;
        
        if (canMoveTo(draggingId, testX, testY, prev)) {
          finalX = testX;
          finalY = testY;
        } else {
          break;
        }
      }

      if (finalX !== block.x || finalY !== block.y) {
        // Hareket gerçekleştiyse moves artır (basitlik için dragging bittiğinde artırmak daha iyi olur ama burada da olur)
        return prev.map(b => b.id === draggingId ? { ...b, x: finalX, y: finalY } : b);
      }
      return prev;
    });
  };

  const handleEnd = () => {
    if (draggingId) {
      const block = blocks.find(b => b.id === draggingId);
      if (block.x !== initialBlockPos.x || block.y !== initialBlockPos.y) {
        setMoves(m => m + 1);
      }
      
      // Kazanma kontrolü - priority bloğunun çıkış y pozisyonunu da kontrol et
      const targetBlock = INITIAL_LEVELS[currentLevelIdx].targetBlock;
      if (block.id === 'priority' && block.x === 4 && block.y === targetBlock.y) {
        setIsWon(true);
      }
    }
    setDraggingId(null);
  };

  const resetLevel = () => {
    const level = INITIAL_LEVELS[currentLevelIdx];
    setBlocks([level.targetBlock, ...level.blocks]);
    setMoves(0);
    setIsWon(false);
  };

  const nextLevel = () => {
    setTotalMoves(prev => prev + moves);
    if (currentLevelIdx < INITIAL_LEVELS.length - 1) {
      setCurrentLevelIdx(prev => prev + 1);
    } else {
      setIsGameCompleted(true);
      setIsWon(false);
    }
  };

  const restartGame = () => {
    setIsGameCompleted(false);
    setCurrentLevelIdx(0);
    setTotalMoves(0);
  };

  if (isGameCompleted) {
    return (
      <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 font-sans select-none animate-in fade-in duration-500">
        <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl border-2 border-yellow-500 text-center shadow-2xl">
          <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
            <Trophy className="text-slate-900" size={48} />
          </div>
          <h1 className="text-4xl font-black text-white mb-2 tracking-tighter">TEBRİKLER!</h1>
          <p className="text-slate-400 mb-8 text-lg">Tüm uçuşlar başarıyla tamamlandı.</p>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <div className="text-xs text-slate-500 uppercase mb-1">Toplam Hamle</div>
              <div className="text-3xl font-mono font-bold text-yellow-500">{totalMoves}</div>
            </div>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700">
              <div className="text-xs text-slate-500 uppercase mb-1">Performans</div>
              <div className="text-xl font-bold text-green-400">
                {totalMoves < 100 ? 'MÜKEMMEL' : totalMoves < 150 ? 'İYİ' : 'GELİŞTİRİLEBİLİR'}
              </div>
            </div>
          </div>

          <button 
            onClick={restartGame}
            className="w-full py-4 bg-yellow-500 text-slate-900 font-bold text-lg rounded-xl hover:bg-yellow-400 active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={24} /> YENİDEN BAŞLA
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4 font-sans select-none overflow-hidden touch-none">
      
      {/* Header */}
      <div className="w-full max-w-lg flex justify-between items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-yellow-500 flex items-center gap-2 whitespace-nowrap">
            <Plane className="rotate-45" /> ÖNCELİKLİ GEÇİŞ
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            BAGAJ LOJİSTİK MERKEZİ v1.0 <span className="text-yellow-500/50 mx-2">|</span> 
            <span className="text-slate-300">{INITIAL_LEVELS[currentLevelIdx].name}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <div className="bg-slate-800 px-3 py-1 rounded-lg border border-slate-700 text-center">
            <div className="text-[10px] text-slate-500 uppercase">Hamle</div>
            <div className="text-lg font-bold font-mono">{moves}</div>
          </div>
          <button 
            onClick={resetLevel}
            className="bg-slate-800 p-2 rounded-lg border border-slate-700 hover:bg-slate-700 active:scale-95 transition-all"
          >
            <RotateCcw size={20} />
          </button>
        </div>
      </div>

      {/* Game Board */}
      <div className="relative">
        {/* Raylar / Arka Plan Izgarası */}
        <div 
          ref={boardRef}
          className="relative bg-slate-800 rounded-xl overflow-hidden shadow-2xl border-4 border-slate-700 p-0"
          style={{ width: 360, height: 360 }}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
        >
          {/* Grid Lines */}
          <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 pointer-events-none">
            {[...Array(36)].map((_, i) => (
              <div key={i} className="border-[0.5px] border-slate-700/50 flex items-center justify-center">
                <div className="w-1 h-1 bg-slate-600 rounded-full opacity-20"></div>
              </div>
            ))}
          </div>

          {/* Exit Gate Lazer */}
          <div className="absolute top-[120px] right-0 w-1 h-[60px] bg-red-500 shadow-[0_0_10px_#ef4444] animate-pulse z-30"></div>
          <div className="absolute top-[135px] -right-8 text-[10px] font-bold text-red-500 rotate-90 uppercase tracking-widest z-30">
            YÜKLEME HATTI
          </div>

          {/* Blocks */}
          {blocks.map(block => (
            <div
              key={block.id}
              onMouseDown={(e) => handleStart(e, block.id)}
              onTouchStart={(e) => handleStart(e, block.id)}
              className={`absolute cursor-grab active:cursor-grabbing transition-shadow rounded-lg flex items-center justify-center overflow-hidden
                ${block.type === 'priority' ? 'z-20 ring-2 ring-yellow-400' : 'z-10'}
                ${draggingId === block.id ? 'shadow-xl scale-[1.02]' : 'shadow-md'}
              `}
              style={{
                width: block.axis === 'h' ? block.len * 60 - 4 : 56,
                height: block.axis === 'v' ? block.len * 60 - 4 : 56,
                left: block.x * 60 + 2,
                top: block.y * 60 + 2,
                backgroundColor: block.type === 'priority' ? '#eab308' : block.type === 'cargo' ? '#334155' : '#475569',
                backgroundImage: block.type === 'priority' ? 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)' : 'none',
                border: `2px solid ${block.type === 'priority' ? '#fde047' : '#1e293b'}`
              }}
            >
              {/* Blok İçeriği (İkonlar) */}
              <div className="flex flex-col items-center opacity-40 text-white">
                {block.type === 'priority' ? (
                  <div className="flex flex-col items-center text-slate-900 opacity-100">
                    <AlertCircle size={24} />
                    <span className="text-[8px] font-black uppercase mt-1 tracking-tighter">ÖNCELİKLİ</span>
                  </div>
                ) : block.type === 'cargo' ? (
                  <Package size={20} />
                ) : (
                  <div className="w-4 h-1 bg-white/20 rounded-full"></div>
                )}
              </div>
              
              {/* Tutma yeri çizgileri */}
              <div className={`absolute ${block.axis === 'h' ? 'right-2' : 'bottom-2'} flex gap-1`}>
                 <div className="w-1 h-1 bg-white/20 rounded-full"></div>
                 <div className="w-1 h-1 bg-white/20 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Win Modal Overlay */}
        {isWon && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm rounded-xl">
            <div className="bg-slate-800 p-8 rounded-2xl border-2 border-yellow-500 text-center shadow-[0_0_50px_rgba(234,179,8,0.3)] animate-in zoom-in duration-300">
              <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Trophy className="text-slate-900" size={32} />
              </div>
              <h2 className="text-2xl font-black text-white mb-2">GÖREV TAMAM!</h2>
              <p className="text-slate-400 mb-6 text-sm">Bavul uçağa zamanında yetişti.<br/>{moves} hamlede başardın.</p>
              <button 
                onClick={nextLevel}
                className="w-full py-3 bg-yellow-500 text-slate-900 font-bold rounded-xl hover:bg-yellow-400 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                SONRAKİ TERMİNAL <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="mt-8 max-w-md text-center">
        <div className="flex items-center justify-center gap-6 text-slate-500 text-sm mb-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-sm"></div> Öncelikli
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-700 rounded-sm"></div> Standart
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-600 rounded-sm"></div> Ağır Kargo
          </div>
        </div>
        <p className="text-[10px] text-slate-600 leading-relaxed uppercase tracking-widest">
          Dikkat: Uçuş güvenliği için valizleri sadece ray hattı üzerinde hareket ettirin. Çıkış kapısı sağ taraftaki kırmızı lazerli alandır.
        </p>
      </div>

      <style>{`
        body { margin: 0; background: #0f172a; }
        * { box-sizing: border-box; }
        .cursor-grab { cursor: grab; }
        .cursor-grabbing { cursor: grabbing; }
      `}</style>
    </div>
  );
};

export default App;