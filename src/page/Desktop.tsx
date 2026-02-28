import { useState, useRef, useEffect, useCallback } from 'react';
import { Header } from '../lib/header';
import { Window } from './WindowManager';
import { Taskbar } from './Taskbar';
import { FileManager } from '../app/nudleFileManager';

const HEADER_HEIGHT = 48;
const TASKBAR_HEIGHT = 72;

// ─── Types ────────────────────────────────────────────────────────────────────

type OpenApp = {
  id: string;
  title: string;
  isMinimized: boolean;
  zIndex: number;
};

let zCounter = 100;

// ─── App content registry ─────────────────────────────────────────────────────

const APP_CONFIG: Record<string, { title: string; width?: number; height?: number }> = {
  files:    { title: 'Файловый менеджер', width: 860, height: 520 },
  terminal: { title: 'Терминал',          width: 700, height: 440 },
  settings: { title: 'Настройки',         width: 600, height: 420 },
};

function renderAppContent(appId: string) {
  if (appId === 'files') return <FileManager />;
  return (
    <div className="flex items-center justify-center h-full text-white/20 text-sm select-none">
      {APP_CONFIG[appId]?.title ?? appId}
    </div>
  );
}

// ─── Desktop ──────────────────────────────────────────────────────────────────

export const Desktop = () => {
  const [openApps, setOpenApps] = useState<OpenApp[]>([]);

  // ── App window management ─────────────────────────────────────────────────

  const launchApp = useCallback((appId: string) => {
    setOpenApps(prev => {
      const existing = prev.find(a => a.id === appId);
      if (existing) {
        return prev.map(a =>
          a.id === appId ? { ...a, isMinimized: false, zIndex: ++zCounter } : a
        );
      }
      const cfg = APP_CONFIG[appId] ?? { title: appId };
      return [...prev, { id: appId, title: cfg.title, isMinimized: false, zIndex: ++zCounter }];
    });
  }, []);

  const closeApp = useCallback((appId: string) => {
    setOpenApps(prev => prev.filter(a => a.id !== appId));
  }, []);

  const minimizeApp = useCallback((appId: string) => {
    setOpenApps(prev => prev.map(a => a.id === appId ? { ...a, isMinimized: true } : a));
  }, []);

  const focusApp = useCallback((appId: string) => {
    setOpenApps(prev => prev.map(a => a.id === appId ? { ...a, zIndex: ++zCounter } : a));
  }, []);

  const toggleApp = useCallback((appId: string) => {
    setOpenApps(prev =>
      prev.map(a =>
        a.id === appId
          ? { ...a, isMinimized: !a.isMinimized, zIndex: a.isMinimized ? ++zCounter : a.zIndex }
          : a
      )
    );
  }, []);

  // ── Stagger initial positions ──────────────────────────────────────────────

  const getInitialPos = (index: number) => ({
    x: 80  + index * 32,
    y: HEADER_HEIGHT + 40 + index * 24,
  });

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none bg-[#0d1117]">
      {/* Wallpaper */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1448375240586-882707db888b?w=1920&q=80')",
          filter: 'brightness(0.55) saturate(0.7)',
        }}
      />

      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-50">
        <Header onLaunch={launchApp} />
      </div>

      {/* Windows */}
      {openApps.map((app, index) => {
        const cfg = APP_CONFIG[app.id] ?? {};
        const initPos = getInitialPos(openApps.indexOf(app));
        return (
          <Window
            key={app.id}
            id={app.id}
            title={app.title}
            initialWidth={cfg.width}
            initialHeight={cfg.height}
            initialX={initPos.x}
            initialY={initPos.y}
            onClose={() => closeApp(app.id)}
            onMinimize={() => minimizeApp(app.id)}
            onFocus={() => focusApp(app.id)}
            zIndex={app.zIndex}
            isMinimized={app.isMinimized}
          >
            {renderAppContent(app.id)}
          </Window>
        );
      })}

      {/* Taskbar */}
      <Taskbar
        apps={openApps.map(a => ({ id: a.id, title: a.title, isMinimized: a.isMinimized }))}
        onToggle={toggleApp}
        onClose={closeApp}
      />
    </div>
  );
};