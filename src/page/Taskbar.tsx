import { Folder, FileText, Code, Image, Music, Video, Box } from 'lucide-react';

type TaskbarApp = {
  id: string;
  title: string;
  isMinimized: boolean;
};

type TaskbarProps = {
  apps: TaskbarApp[];
  onToggle: (id: string) => void;
  onClose: (id: string) => void;
};

const APP_ICONS: Record<string, React.ReactNode> = {
  files:    <Folder   size={22} className="text-amber-400" />,
  terminal: <Code     size={22} className="text-emerald-400" />,
  settings: <Box      size={22} className="text-slate-300" />,
  images:   <Image    size={22} className="text-pink-400" />,
  music:    <Music    size={22} className="text-purple-400" />,
  video:    <Video    size={22} className="text-rose-400" />,
  docs:     <FileText size={22} className="text-sky-300" />,
};

const DEFAULT_ICON = <Box size={22} className="text-slate-300" />;

export const Taskbar = ({ apps, onToggle, onClose }: TaskbarProps) => {
  if (apps.length === 0) {
    return (
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: 72, zIndex: 9999, pointerEvents: 'none' }}
      />
    );
  }

  return (
    <div
      className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-2.5"
      style={{ height: 72, zIndex: 9999, pointerEvents: 'none' }}
    >
      {/* Dock pill */}
      <div
        className="flex items-center gap-1.5 px-2.5 py-2"
        style={{
          pointerEvents: 'all',
          background: 'rgba(13, 18, 38, 0.75)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255,255,255,0.09)',
          borderRadius: 18,
          boxShadow: '0 8px 40px rgba(0,0,0,0.55), 0 1px 0 rgba(255,255,255,0.07) inset',
        }}
      >
        {apps.map((app) => {
          const isActive = !app.isMinimized;
          const icon = APP_ICONS[app.id] ?? DEFAULT_ICON;

          return (
            <div key={app.id} className="relative flex flex-col items-center gap-[3px]">
              {/* Icon wrapper with tooltip */}
              <div className="group relative">
                {/* Tooltip */}
                <div
                  className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-2.5 py-1 rounded-lg text-[11px] text-white/90
                             whitespace-nowrap pointer-events-none select-none
                             opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                  style={{
                    background: 'rgba(10,14,26,0.92)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(12px)',
                    zIndex: 99999,
                  }}
                >
                  {app.title}
                  {/* Arrow */}
                  <div
                    className="absolute top-full left-1/2 -translate-x-1/2"
                    style={{
                      width: 0, height: 0,
                      borderLeft: '4px solid transparent',
                      borderRight: '4px solid transparent',
                      borderTop: '4px solid rgba(255,255,255,0.09)',
                    }}
                  />
                </div>

                <button
                  onClick={() => onToggle(app.id)}
                  onContextMenu={(e) => { e.preventDefault(); onClose(app.id); }}
                  className="relative flex items-center justify-center transition-all duration-100 active:scale-90"
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 13,
                    background: isActive
                      ? 'rgba(78, 128, 220, 0.2)'
                      : 'rgba(255,255,255,0.055)',
                    border: isActive
                      ? '1px solid rgba(100,158,255,0.32)'
                      : '1px solid rgba(255,255,255,0.08)',
                    cursor: 'default',
                    outline: 'none',
                  }}
                >
                  {icon}
                </button>
              </div>

              {/* Active indicator dot */}
              <div
                style={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  background: isActive ? 'rgba(140, 185, 255, 0.85)' : 'transparent',
                  transition: 'background 0.2s ease',
                  flexShrink: 0,
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};