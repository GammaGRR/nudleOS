import { useState, useRef, useEffect } from 'react';
import { Header } from '../lib/header';
import {
  FileTextIcon,
  CodeFileIcon,
  ImageFileIcon,
  VideoFileIcon,
  FolderIcon,
} from '../lib/Desktop/DesktopIcon';

type DesktopItem = {
  name: string;
  type: 'file' | 'folder';
};

export const Desktop = () => {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const [selectedIndexes, setSelectedIndexes] = useState<number[]>([]);
  const [desktopItems, setDesktopItems] = useState<DesktopItem[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [selectionEnd, setSelectionEnd] = useState<{
    x: number;
    y: number;
  } | null>(null);

  const desktopRef = useRef<HTMLDivElement>(null);
  const iconRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/api/files')
      .then((res) => res.json())
      .then((data) => setDesktopItems(data))
      .catch((err) => console.error('Failed to fetch files:', err));
  }, []);

  const getIcon = (file: DesktopItem) => {
    if (file.type === 'folder') return <FolderIcon />;

    if (file.name.endsWith('.txt')) return <FileTextIcon />;
    if (file.name.endsWith('.js')) return <CodeFileIcon />;
    if (file.name.endsWith('.png')) return <ImageFileIcon />;
    if (file.name.endsWith('.mp4')) return <VideoFileIcon />;

    return <FileTextIcon />;
  };

  useEffect(() => {
    const handleMouseUp = () => {
      if (!isSelecting || !selectionStart || !selectionEnd) return;

      const left = Math.min(selectionStart.x, selectionEnd.x);
      const right = Math.max(selectionStart.x, selectionEnd.x);
      const top = Math.min(selectionStart.y, selectionEnd.y);
      const bottom = Math.max(selectionStart.y, selectionEnd.y);

      const newSelected: number[] = [];

      iconRefs.current.forEach((icon, index) => {
        if (!icon) return;

        const rect = icon.getBoundingClientRect();

        if (
          rect.right > left &&
          rect.left < right &&
          rect.bottom > top &&
          rect.top < bottom
        ) {
          newSelected.push(index);
        }
      });

      setSelectedIndexes(newSelected);
      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionEnd(null);
    };

    window.addEventListener('mouseup', handleMouseUp);
    return () => window.removeEventListener('mouseup', handleMouseUp);
  }, [isSelecting, selectionStart, selectionEnd]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!desktopRef.current?.contains(e.target as Node)) return;
    if ((e.target as HTMLElement).closest('.desktop-icon')) return;

    setContextMenu(null);
    setSelectedIndexes([]);
    setIsSelecting(true);
    setSelectionStart({ x: e.clientX, y: e.clientY });
    setSelectionEnd({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isSelecting) return;
    setSelectionEnd({ x: e.clientX, y: e.clientY });
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedIndexes([]);

    let x = e.clientX;
    let y = e.clientY;

    const menuWidth = 180;
    const menuHeight = 150;

    if (x + menuWidth > window.innerWidth) {
      x = window.innerWidth - menuWidth - 5;
    }

    if (y + menuHeight > window.innerHeight) {
      y = window.innerHeight - menuHeight - 5;
    }

    setContextMenu({ x, y });
  };

  const selectionBoxStyle = () => {
    if (!selectionStart || !selectionEnd) return { display: 'none' };

    const left = Math.min(selectionStart.x, selectionEnd.x);
    const top = Math.min(selectionStart.y, selectionEnd.y);
    const width = Math.abs(selectionStart.x - selectionEnd.x);
    const height = Math.abs(selectionStart.y - selectionEnd.y);

    return {
      position: 'fixed' as const,
      left,
      top,
      width,
      height,
    };
  };

  return (
    <div
      ref={desktopRef}
      className="relative w-screen h-screen overflow-hidden select-none font-['JetBrains_Mono'] bg-[#0d1117]"
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}>
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80')",
          filter: 'brightness(0.55) saturate(0.7)',
        }}
      />
      <div className="absolute top-0 left-0 w-full z-2000">
        <Header />
      </div>
      <div className="absolute inset-x-0 top-12 flex items-start px-4 py-6 z-10">
        <div className="flex flex-col gap-2">
          {desktopItems.map((item, index) => (
            <div
              key={item.name}
              ref={(el) => {
                iconRefs.current[index] = el;
              }}
              className={`desktop-icon flex flex-col items-center gap-[5px] pt-[10px] px-2 pb-2 rounded-lg w-20 border transition-colors duration-150 cursor-default
                ${
                  selectedIndexes.includes(index)
                    ? 'bg-sky-400/15 border-sky-400/35'
                    : 'border-transparent hover:bg-white/8 hover:border-white/10'
                }`}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIndexes([index]);
              }}>
              <div className="flex items-center justify-center w-11 h-11">
                {getIcon(item)}
              </div>
              <span className="text-[13px] text-slate-200 text-center break-all max-w-[72px]">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      {isSelecting && (
        <div
          className="fixed border border-sky-400 bg-sky-400/10 pointer-events-none z-[999]"
          style={selectionBoxStyle()}
        />
      )}
      {contextMenu && (
        <div
          className="fixed z-[1000] min-w-[180px] border border-white/10 rounded-lg p-1 bg-[rgba(15,23,42,0.92)] backdrop-blur-2xl"
          style={{ left: contextMenu.x, top: contextMenu.y }}>
          <button className="block w-full px-3 py-[7px] text-left hover:bg-sky-400/15">
            Open
          </button>
          <button className="block w-full px-3 py-[7px] text-left hover:bg-sky-400/15">
            Rename
          </button>
        </div>
      )}
    </div>
  );
};
