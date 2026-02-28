import { useState, useRef } from 'react';
import { Minus, Square, X, Maximize2, Minimize2 } from 'lucide-react';

type WindowProps = {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  initialWidth?: number;
  initialHeight?: number;
  initialX?: number;
  initialY?: number;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  zIndex: number;
  isMinimized: boolean;
};

const HEADER_HEIGHT = 48;
const MIN_WIDTH = 320;
const MIN_HEIGHT = 240;

export const Window = ({
  id,
  title,
  icon,
  children,
  initialWidth = 720,
  initialHeight = 480,
  initialX = 100,
  initialY = HEADER_HEIGHT + 40,
  onClose,
  onMinimize,
  onFocus,
  zIndex,
  isMinimized,
}: WindowProps) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const [pos,  setPos]  = useState({ x: initialX, y: initialY });
  const [size, setSize] = useState({ w: initialWidth, h: initialHeight });
  const prevNormal = useRef({ pos: { x: initialX, y: initialY }, size: { w: initialWidth, h: initialHeight } });

  const dragging   = useRef(false);
  const dragStart  = useRef({ mx: 0, my: 0, wx: 0, wy: 0 });
  const resizing   = useRef<string | null>(null);
  const resizeStart = useRef({ mx: 0, my: 0, x: 0, y: 0, w: 0, h: 0 });

  // ── Drag title bar ──────────────────────────────────────────────────────────
  const handleTitleMouseDown = (e: React.MouseEvent) => {
    if (isMaximized) return;
    if ((e.target as HTMLElement).closest('[data-winbtn]')) return;
    e.preventDefault();
    onFocus();
    dragging.current = true;
    dragStart.current = { mx: e.clientX, my: e.clientY, wx: pos.x, wy: pos.y };

    const onMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      setPos({
        x: Math.max(0, Math.min(dragStart.current.wx + ev.clientX - dragStart.current.mx, window.innerWidth - size.w)),
        y: Math.max(HEADER_HEIGHT, Math.min(dragStart.current.wy + ev.clientY - dragStart.current.my, window.innerHeight - 80)),
      });
    };
    const onUp = () => {
      dragging.current = false;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // ── Resize ──────────────────────────────────────────────────────────────────
  const handleResizeMouseDown = (e: React.MouseEvent, dir: string) => {
    e.preventDefault();
    e.stopPropagation();
    onFocus();
    resizing.current = dir;
    resizeStart.current = { mx: e.clientX, my: e.clientY, x: pos.x, y: pos.y, w: size.w, h: size.h };

    const onMove = (ev: MouseEvent) => {
      if (!resizing.current) return;
      const dx = ev.clientX - resizeStart.current.mx;
      const dy = ev.clientY - resizeStart.current.my;
      const d  = resizing.current;
      let { x: nx, y: ny, w: nw, h: nh } = resizeStart.current;

      if (d.includes('e')) nw = Math.max(MIN_WIDTH, resizeStart.current.w + dx);
      if (d.includes('s')) nh = Math.max(MIN_HEIGHT, resizeStart.current.h + dy);
      if (d.includes('w')) { nw = Math.max(MIN_WIDTH, resizeStart.current.w - dx); nx = resizeStart.current.x + resizeStart.current.w - nw; }
      if (d.includes('n')) {
        nh = Math.max(MIN_HEIGHT, resizeStart.current.h - dy);
        ny = resizeStart.current.y + resizeStart.current.h - nh;
        ny = Math.max(HEADER_HEIGHT, ny);
        if (ny === HEADER_HEIGHT) nh = resizeStart.current.y + resizeStart.current.h - HEADER_HEIGHT;
      }
      setPos({ x: nx, y: ny });
      setSize({ w: nw, h: nh });
    };
    const onUp = () => {
      resizing.current = null;
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  // ── Maximize toggle ─────────────────────────────────────────────────────────
  const toggleMaximize = () => {
    if (isMaximized) {
      setIsMaximized(false);
      setPos(prevNormal.current.pos);
      setSize(prevNormal.current.size);
    } else {
      prevNormal.current = { pos, size };
      setIsMaximized(true);
    }
  };

  const currentPos  = isMaximized ? { x: 0, y: HEADER_HEIGHT } : pos;
  const currentSize = isMaximized
    ? { w: window.innerWidth, h: window.innerHeight - HEADER_HEIGHT - 48 }
    : size;

  if (isMinimized) return null;

  return (
    <div
      className="absolute flex flex-col overflow-hidden"
      style={{
        left: currentPos.x,
        top: currentPos.y,
        width: currentSize.w,
        height: currentSize.h,
        zIndex,
        borderRadius: isMaximized ? 0 : 8,
        background: 'rgba(13, 18, 36, 0.97)',
        border: isMaximized ? 'none' : '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 16px 56px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.05) inset',
        backdropFilter: 'blur(24px)',
      }}
      onMouseDown={onFocus}
    >
      {/* ── Title bar ── */}
      <div
        className="flex items-center h-9 shrink-0 select-none cursor-default"
        style={{
          background: 'rgba(255,255,255,0.035)',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}
        onMouseDown={handleTitleMouseDown}
        onDoubleClick={toggleMaximize}
      >
        {/* Icon + Title — left side */}
        <div className="flex items-center gap-2 px-3 flex-1 min-w-0">
          {icon && <span className="text-sm shrink-0">{icon}</span>}
          <span className="text-xs text-white/50 font-medium tracking-wide truncate">{title}</span>
        </div>

        {/* Window controls — RIGHT side, Windows/Linux style */}
        <div className="flex items-stretch h-full shrink-0" data-winbtn>
          {/* Minimize */}
          <button
            data-winbtn
            onClick={(e) => { e.stopPropagation(); onMinimize(); }}
            className="flex items-center justify-center w-11 h-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            title="Свернуть"
          >
            <Minus size={13} strokeWidth={1.8} />
          </button>

          {/* Maximize / Restore */}
          <button
            data-winbtn
            onClick={(e) => { e.stopPropagation(); toggleMaximize(); }}
            className="flex items-center justify-center w-11 h-full text-white/40 hover:text-white hover:bg-white/10 transition-colors"
            title={isMaximized ? 'Восстановить' : 'Развернуть'}
          >
            {isMaximized
              ? <Minimize2 size={12} strokeWidth={1.8} />
              : <Maximize2 size={12} strokeWidth={1.8} />
            }
          </button>

          {/* Close — red on hover */}
          <button
            data-winbtn
            onClick={(e) => { e.stopPropagation(); onClose(); }}
            className="flex items-center justify-center w-11 h-full text-white/40 hover:text-white hover:bg-red-600 transition-colors"
            style={{ borderRadius: isMaximized ? 0 : '0 8px 0 0' }}
            title="Закрыть"
          >
            <X size={13} strokeWidth={1.8} />
          </button>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>

      {/* ── Resize handles ── */}
      {!isMaximized && (
        <>
          <div className="absolute top-0 left-3 right-3 h-[3px] cursor-n-resize"  onMouseDown={e => handleResizeMouseDown(e, 'n')} />
          <div className="absolute bottom-0 left-3 right-3 h-[3px] cursor-s-resize" onMouseDown={e => handleResizeMouseDown(e, 's')} />
          <div className="absolute left-0 top-3 bottom-3 w-[3px] cursor-w-resize"  onMouseDown={e => handleResizeMouseDown(e, 'w')} />
          <div className="absolute right-0 top-3 bottom-3 w-[3px] cursor-e-resize" onMouseDown={e => handleResizeMouseDown(e, 'e')} />
          <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize" onMouseDown={e => handleResizeMouseDown(e, 'nw')} />
          <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize" onMouseDown={e => handleResizeMouseDown(e, 'ne')} />
          <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize" onMouseDown={e => handleResizeMouseDown(e, 'sw')} />
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize" onMouseDown={e => handleResizeMouseDown(e, 'se')} />
        </>
      )}
    </div>
  );
};