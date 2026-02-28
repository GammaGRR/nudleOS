import { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import {
    Folder, FolderOpen, FileText, File, Image, Music, Video,
    Archive, Code, ArrowLeft, ArrowRight, Home, ChevronRight,
    Grid3X3, List, Search, Trash2, Edit3,
    Copy, Scissors, Clipboard, AlertCircle, HardDrive,
    RefreshCw, ChevronDown, Loader2, AlertTriangle, Plus,
} from "lucide-react";

const API = "http://localhost:3001/api";
const ext = (name: string) => name.split(".").pop()?.toLowerCase() ?? "";

type FSItem = {
    name: string;
    type: "folder" | "file";
    path: string;
    parentPath: string;
    modified?: string;
    size?: string;
};

// ─── Icon Helper ──────────────────────────────────────────────────────────────

function getIcon(item: FSItem, size = 16) {
    if (item.type === "folder") return <Folder size={size} className="text-amber-400" />;
    const e = ext(item.name);
    const cls = "opacity-80";
    const map: Record<string, React.ReactNode> = {
        txt: <FileText size={size} className={`text-slate-300 ${cls}`} />,
        md: <FileText size={size} className={`text-sky-300 ${cls}`} />,
        js: <Code size={size} className={`text-yellow-300 ${cls}`} />,
        ts: <Code size={size} className={`text-blue-400 ${cls}`} />,
        tsx: <Code size={size} className={`text-cyan-400 ${cls}`} />,
        jsx: <Code size={size} className={`text-cyan-300 ${cls}`} />,
        json: <Code size={size} className={`text-orange-300 ${cls}`} />,
        css: <Code size={size} className={`text-pink-300 ${cls}`} />,
        scss: <Code size={size} className={`text-pink-400 ${cls}`} />,
        html: <Code size={size} className={`text-orange-400 ${cls}`} />,
        png: <Image size={size} className={`text-pink-400 ${cls}`} />,
        jpg: <Image size={size} className={`text-pink-400 ${cls}`} />,
        jpeg: <Image size={size} className={`text-pink-400 ${cls}`} />,
        gif: <Image size={size} className={`text-fuchsia-400 ${cls}`} />,
        svg: <Image size={size} className={`text-emerald-400 ${cls}`} />,
        webp: <Image size={size} className={`text-pink-300 ${cls}`} />,
        mp3: <Music size={size} className={`text-purple-400 ${cls}`} />,
        wav: <Music size={size} className={`text-purple-300 ${cls}`} />,
        ogg: <Music size={size} className={`text-purple-300 ${cls}`} />,
        mp4: <Video size={size} className={`text-rose-400 ${cls}`} />,
        mov: <Video size={size} className={`text-rose-400 ${cls}`} />,
        zip: <Archive size={size} className={`text-stone-400 ${cls}`} />,
        rar: <Archive size={size} className={`text-stone-400 ${cls}`} />,
        tar: <Archive size={size} className={`text-stone-400 ${cls}`} />,
        gz: <Archive size={size} className={`text-stone-400 ${cls}`} />,
    };
    return map[e] ?? <File size={size} className={`text-slate-400 ${cls}`} />;
}

// ─── Input Modal (portal) ─────────────────────────────────────────────────────

function InputModal({ title, value, onChange, onConfirm, onCancel, placeholder }: {
    title: string; value: string; placeholder: string;
    onChange: (v: string) => void; onConfirm: () => void; onCancel: () => void;
}) {
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => { ref.current?.focus(); ref.current?.select(); }, []);

    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 999999 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative w-96 rounded-2xl border border-white/10 bg-[#141b2d] shadow-2xl p-6">
                <p className="text-sm font-semibold text-white mb-3">{title}</p>
                <input
                    ref={ref} value={value} onChange={e => onChange(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") onConfirm(); if (e.key === "Escape") onCancel(); }}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/60 transition-all"
                />
                <div className="flex gap-2 mt-4 justify-end">
                    <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 transition">Отмена</button>
                    <button onClick={onConfirm} disabled={!value.trim()}
                        className="px-4 py-2 rounded-lg text-sm bg-blue-600 hover:bg-blue-500 disabled:opacity-30 text-white transition">
                        Подтвердить
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ─── Context Menu (portal) ────────────────────────────────────────────────────
//
// Renders into document.body via createPortal.
// This bypasses the Window's backdropFilter which creates a new stacking context
// and breaks position:fixed — making menus appear far from the cursor.

type CtxItem = {
    label: string;
    icon: React.ReactNode;
    action: () => void;
    danger?: boolean;
    divider?: boolean;
};

function ContextMenu({ x, y, items, onClose }: {
    x: number; y: number; items: CtxItem[]; onClose: () => void;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const menuW = 208;
    const menuH = items.length * 36 + 12;

    // Clamp so menu stays fully inside viewport
    const left = Math.min(x, window.innerWidth - menuW - 4);
    const top = Math.min(y, window.innerHeight - menuH - 4);

    useEffect(() => {
        // Delay so the right-click that opened the menu doesn't instantly close it
        const onDown = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        };
        const tid = setTimeout(() => document.addEventListener("mousedown", onDown), 80);
        return () => { clearTimeout(tid); document.removeEventListener("mousedown", onDown); };
    }, [onClose]);

    return createPortal(
        <div
            ref={ref}
            style={{ position: "fixed", left, top, zIndex: 999999, width: menuW }}
            className="rounded-xl border border-white/10 bg-[#141b2d]/97 backdrop-blur-xl shadow-2xl py-1.5 overflow-hidden"
        >
            {items.map((item, i) => (
                <div key={i}>
                    {item.divider && <div className="my-1 border-t border-white/5" />}
                    <button
                        onClick={() => { item.action(); onClose(); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 text-sm transition-colors
                            ${item.danger
                                ? "text-red-400 hover:bg-red-500/10"
                                : "text-white/75 hover:bg-white/8 hover:text-white"
                            }`}
                    >
                        <span className="opacity-55 shrink-0">{item.icon}</span>
                        {item.label}
                    </button>
                </div>
            ))}
        </div>,
        document.body
    );
}

// ─── Confirm Dialog (portal) ──────────────────────────────────────────────────

function ConfirmDialog({ message, onConfirm, onCancel }: {
    message: string; onConfirm: () => void; onCancel: () => void;
}) {
    return createPortal(
        <div className="fixed inset-0 flex items-center justify-center" style={{ zIndex: 999999 }}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
            <div className="relative w-80 rounded-2xl border border-white/10 bg-[#141b2d] shadow-2xl p-6">
                <div className="flex items-start gap-3 mb-4">
                    <AlertCircle size={20} className="text-red-400 mt-0.5 shrink-0" />
                    <p className="text-sm text-white/80">{message}</p>
                </div>
                <div className="flex gap-2 justify-end">
                    <button onClick={onCancel} className="px-4 py-2 rounded-lg text-sm text-white/60 hover:bg-white/5 transition">Отмена</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-sm bg-red-600 hover:bg-red-500 text-white transition">Удалить</button>
                </div>
            </div>
        </div>,
        document.body
    );
}

// ─── Main FileManager ─────────────────────────────────────────────────────────

export const FileManager = () => {
    const [currentPath, setCurrentPath] = useState<string>("");
    const [history, setHistory] = useState<string[]>([""]);
    const [histIdx, setHistIdx] = useState(0);

    const [items, setItems] = useState<FSItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selected, setSelected] = useState<string[]>([]);
    const [view, setView] = useState<"list" | "grid">("list");
    const [sort, setSort] = useState("name");
    const [search, setSearch] = useState("");

    const [clipboard, setClipboard] = useState<{ names: string[]; op: "copy" | "cut"; fromPath: string } | null>(null);
    const [modal, setModal] = useState<{ type: string; value: string; targetName?: string } | null>(null);
    const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null);
    const [ctx, setCtx] = useState<{ x: number; y: number; items: CtxItem[] } | null>(null);

    const [selBox, setSelBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
    const selStart = useRef<{ x: number; y: number } | null>(null);
    const isSelectingRef = useRef(false);
    const contentRef = useRef<HTMLDivElement>(null);

    // ── Fetch ────────────────────────────────────────────────────────────────

    const fetchDir = useCallback(async (dirPath: string) => {
        setLoading(true);
        setError(null);
        setSelected([]);
        try {
            const q = dirPath ? `?path=${encodeURIComponent(dirPath)}` : "";
            const res = await fetch(`${API}/files${q}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data: { name: string; type: "folder" | "file"; modified?: string; size?: string }[] = await res.json();
            setItems(data.map(d => ({
                ...d,
                path: dirPath ? `${dirPath}/${d.name}` : d.name,
                parentPath: dirPath,
            })));
        } catch {
            setError("Не удалось подключиться к серверу. Убедитесь, что сервер запущен на порту 3001.");
            setItems([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchDir(currentPath); }, [currentPath, fetchDir]);

    // ── Navigation ───────────────────────────────────────────────────────────

    const navigate = useCallback((dirPath: string) => {
        setCurrentPath(dirPath);
        setSearch("");
        setHistory(prev => {
            const nh = [...prev.slice(0, histIdx + 1), dirPath];
            setHistIdx(nh.length - 1);
            return nh;
        });
    }, [histIdx]);

    const goBack = () => { if (histIdx > 0) { setCurrentPath(history[histIdx - 1]); setHistIdx(i => i - 1); setSearch(""); } };
    const goForward = () => { if (histIdx < history.length - 1) { setCurrentPath(history[histIdx + 1]); setHistIdx(i => i + 1); setSearch(""); } };

    const crumbs = (() => {
        const parts = currentPath ? currentPath.split("/") : [];
        const result: { label: string; path: string }[] = [{ label: "Диск C", path: "" }];
        parts.forEach((p, i) => result.push({ label: p, path: parts.slice(0, i + 1).join("/") }));
        return result;
    })();

    // ── Sorted / filtered ────────────────────────────────────────────────────

    const currentList = items
        .filter(i => i.name.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
            if (sort === "name") return a.name.localeCompare(b.name);
            if (sort === "modified") return (a.modified ?? "").localeCompare(b.modified ?? "");
            if (sort === "size") return (a.size ?? "").localeCompare(b.size ?? "");
            return 0;
        });

    // ── Server ops ───────────────────────────────────────────────────────────

    const post = (endpoint: string, body: object) =>
        fetch(`${API}/${endpoint}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });

    const base = (p = currentPath) => p ? p + "/" : "";

    const apiCreateFolder = async (name: string) => { try { await post("mkdir", { path: base() + name }); fetchDir(currentPath); } catch { setError("Ошибка создания папки"); } };
    const apiCreateFile = async (name: string) => { try { await post("touch", { path: base() + name }); fetchDir(currentPath); } catch { setError("Ошибка создания файла"); } };
    const apiRename = async (old: string, nw: string) => { try { await post("rename", { oldPath: base() + old, newPath: base() + nw }); fetchDir(currentPath); } catch { setError("Ошибка переименования"); } };
    const apiDelete = async (names: string[]) => {
        try { await Promise.all(names.map(n => post("delete", { path: base() + n }))); setSelected([]); fetchDir(currentPath); }
        catch { setError("Ошибка удаления"); }
    };
    const apiCopy = async (names: string[], from: string, to: string) => {
        try { await Promise.all(names.map(n => post("copy", { src: base(from) + n, dest: base(to) + n }))); fetchDir(currentPath); }
        catch { setError("Ошибка копирования"); }
    };
    const apiMove = async (names: string[], from: string, to: string) => {
        try { await Promise.all(names.map(n => post("rename", { oldPath: base(from) + n, newPath: base(to) + n }))); setClipboard(null); fetchDir(currentPath); }
        catch { setError("Ошибка перемещения"); }
    };

    const pasteItems = useCallback(() => {
        if (!clipboard) return;
        clipboard.op === "copy"
            ? apiCopy(clipboard.names, clipboard.fromPath, currentPath)
            : apiMove(clipboard.names, clipboard.fromPath, currentPath);
    }, [clipboard, currentPath]);

    // ── Context menus ─────────────────────────────────────────────────────────
    // e.clientX/Y are true viewport coordinates.
    // ContextMenu renders via portal into document.body, so position:fixed
    // works correctly — bypassing the Window's backdropFilter stacking context.

    const openItemCtx = (e: React.MouseEvent, item: FSItem) => {
        e.preventDefault();
        e.stopPropagation();
        if (!selected.includes(item.name)) setSelected([item.name]);
        const names = selected.includes(item.name) && selected.length > 1 ? selected : [item.name];
        setCtx({
            x: e.clientX, y: e.clientY,
            items: [
                ...(item.type === "folder" ? [{
                    label: "Открыть", icon: <FolderOpen size={14} />,
                    action: () => navigate(currentPath ? `${currentPath}/${item.name}` : item.name),
                }] : []),
                { label: "Переименовать", icon: <Edit3 size={14} />, action: () => setModal({ type: "rename", value: item.name, targetName: item.name }) },
                { label: "Копировать", icon: <Copy size={14} />, action: () => setClipboard({ names, op: "copy", fromPath: currentPath }) },
                { label: "Вырезать", icon: <Scissors size={14} />, action: () => setClipboard({ names, op: "cut", fromPath: currentPath }) },
                {
                    label: "Удалить", icon: <Trash2 size={14} />, danger: true, divider: true,
                    action: () => setConfirm({ message: `Удалить ${names.length} элем.? Необратимо.`, onConfirm: () => { apiDelete(names); setConfirm(null); } }),
                },
            ],
        });
    };

    const openBgCtx = (e: React.MouseEvent) => {
        e.preventDefault();
        setCtx({
            x: e.clientX, y: e.clientY,
            items: [
                { label: "Новая папка", icon: <Folder size={14} />, action: () => setModal({ type: "newFolder", value: "" }) },
                { label: "Новый файл", icon: <Plus size={14} />, action: () => setModal({ type: "newFile", value: "" }) },
                ...(clipboard ? [{
                    label: `Вставить (${clipboard.op === "copy" ? "копия" : "переместить"})`,
                    icon: <Clipboard size={14} />, action: pasteItems, divider: true,
                }] : []),
                { label: "Обновить", icon: <RefreshCw size={14} />, action: () => fetchDir(currentPath), divider: true },
            ],
        });
    };

    // ── Selection box ─────────────────────────────────────────────────────────
    // Selection box uses position:fixed with clientX/Y — same portal caveat applies,
    // but since it's rendered inside FileManager (not a separate portal), we use
    // the contentRef bounding rect to convert to relative coords instead.

    const onContentMouseDown = (e: React.MouseEvent) => {
        if ((e.target as HTMLElement).closest("[data-file]")) return;
        if (e.button !== 0) return;
        e.preventDefault();
        isSelectingRef.current = true;
        selStart.current = { x: e.clientX, y: e.clientY };
        setSelected([]); setSelBox(null);
    };

    const onContentMouseMove = (e: React.MouseEvent) => {
        if (!isSelectingRef.current || !selStart.current) return;
        const x = Math.min(e.clientX, selStart.current.x);
        const y = Math.min(e.clientY, selStart.current.y);
        const w = Math.abs(e.clientX - selStart.current.x);
        const h = Math.abs(e.clientY - selStart.current.y);
        setSelBox({ x, y, w, h });

        if (!contentRef.current) return;
        const names: string[] = [];
        contentRef.current.querySelectorAll("[data-file]").forEach(el => {
            const r = el.getBoundingClientRect();
            const name = el.getAttribute("data-file");
            if (name && !(r.right < x || r.left > x + w || r.bottom < y || r.top > y + h)) names.push(name);
        });
        setSelected(names);
    };

    const onContentMouseUp = () => { isSelectingRef.current = false; selStart.current = null; setSelBox(null); };

    // ── Keyboard shortcuts ────────────────────────────────────────────────────

    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (modal || confirm) return;
            if ((e.ctrlKey || e.metaKey) && e.key === "c" && selected.length) setClipboard({ names: selected, op: "copy", fromPath: currentPath });
            if ((e.ctrlKey || e.metaKey) && e.key === "x" && selected.length) setClipboard({ names: selected, op: "cut", fromPath: currentPath });
            if ((e.ctrlKey || e.metaKey) && e.key === "v") pasteItems();
            if (e.key === "Delete" && selected.length)
                setConfirm({ message: `Удалить ${selected.length} элем.?`, onConfirm: () => { apiDelete(selected); setConfirm(null); } });
            if (e.key === "F2" && selected.length === 1)
                setModal({ type: "rename", value: selected[0], targetName: selected[0] });
            if (e.key === "Escape") setSelected([]);
        };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, [selected, modal, confirm, clipboard, currentPath, pasteItems]);

    const handleModalConfirm = () => {
        if (!modal) return;
        if (modal.type === "newFolder") apiCreateFolder(modal.value.trim());
        if (modal.type === "newFile") apiCreateFile(modal.value.trim());
        if (modal.type === "rename" && modal.targetName) apiRename(modal.targetName, modal.value.trim());
        setModal(null);
    };

    // ── Renderers ─────────────────────────────────────────────────────────────

    const renderList = () => (
        <table className="w-full text-sm border-collapse">
            <thead>
                <tr className="border-b border-white/5">
                    {[["name", "Имя"], ["modified", "Изменён"], ["size", "Размер"]].map(([k, label]) => (
                        <th key={k} onClick={() => setSort(k)}
                            className={`px-4 py-2 text-left text-xs font-medium cursor-pointer select-none
                                ${k === "size" ? "w-24" : k === "modified" ? "w-36" : ""}
                                ${sort === k ? "text-blue-400" : "text-white/30 hover:text-white/50"}`}>
                            {label} {sort === k && <ChevronDown size={10} className="inline" />}
                        </th>
                    ))}
                    <th className="w-8" />
                </tr>
            </thead>
            <tbody>
                {currentList.map(item => {
                    const isSel = selected.includes(item.name);
                    return (
                        <tr key={item.path} data-file={item.name}
                            onClick={e => {
                                if (e.ctrlKey || e.metaKey)
                                    setSelected(prev => prev.includes(item.name) ? prev.filter(i => i !== item.name) : [...prev, item.name]);
                                else if (e.shiftKey && selected.length > 0) {
                                    const last = currentList.findIndex(i => i.name === selected[selected.length - 1]);
                                    const cur = currentList.findIndex(i => i.name === item.name);
                                    const [a, b] = [Math.min(last, cur), Math.max(last, cur)];
                                    setSelected(currentList.slice(a, b + 1).map(i => i.name));
                                } else setSelected([item.name]);
                            }}
                            onDoubleClick={() => { if (item.type === "folder") navigate(item.path); }}
                            onContextMenu={e => openItemCtx(e, item)}
                            className={`group border-b border-white/[0.03] cursor-default transition-colors
                                ${isSel ? "bg-blue-500/15" : "hover:bg-white/[0.04]"}`}>
                            <td className="px-4 py-2.5">
                                <div className="flex items-center gap-3">
                                    {getIcon(item, 16)}
                                    <span className={`font-medium ${isSel ? "text-white" : "text-white/80"}`}>{item.name}</span>
                                </div>
                            </td>
                            <td className="px-4 py-2.5 text-white/30 tabular-nums text-xs">{item.modified ?? "—"}</td>
                            <td className="px-4 py-2.5 text-white/30 tabular-nums text-xs">{item.size ?? "—"}</td>
                            <td className="px-2 py-2.5">
                                <button onClick={e => {
                                    e.stopPropagation();
                                    setConfirm({ message: `Удалить «${item.name}»?`, onConfirm: () => { apiDelete([item.name]); setConfirm(null); } });
                                }} className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-500/20 text-white/30 hover:text-red-400 transition-all">
                                    <Trash2 size={13} />
                                </button>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );

    const renderGrid = () => (
        <div className="grid grid-cols-5 xl:grid-cols-7 gap-2 p-3">
            {currentList.map(item => {
                const isSel = selected.includes(item.name);
                return (
                    <div key={item.path} data-file={item.name}
                        onClick={e => {
                            if (e.ctrlKey || e.metaKey) setSelected(prev => prev.includes(item.name) ? prev.filter(i => i !== item.name) : [...prev, item.name]);
                            else setSelected([item.name]);
                        }}
                        onDoubleClick={() => { if (item.type === "folder") navigate(item.path); }}
                        onContextMenu={e => openItemCtx(e, item)}
                        className={`group relative flex flex-col items-center gap-1.5 p-2.5 rounded-xl cursor-default transition-all
                            ${isSel ? "bg-blue-500/20 ring-1 ring-blue-500/40" : "hover:bg-white/[0.06]"}`}>
                        <div className="w-12 h-12 flex items-center justify-center">{getIcon(item, 32)}</div>
                        <span className={`text-xs text-center leading-tight line-clamp-2 max-w-full break-all ${isSel ? "text-white" : "text-white/70"}`}>
                            {item.name}
                        </span>
                    </div>
                );
            })}
        </div>
    );

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <>
            <style>{`
                .fm-sb::-webkit-scrollbar        { width: 4px; }
                .fm-sb::-webkit-scrollbar-track  { background: transparent; }
                .fm-sb::-webkit-scrollbar-thumb  { background: rgba(255,255,255,0.1); border-radius: 99px; }
                .fm-sb::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
            `}</style>

            <div className="flex h-full w-full min-h-0" style={{ fontFamily: "'JetBrains Mono','Fira Code',monospace" }}>

                {/* ── Sidebar ── */}
                <div className="w-44 border-r border-white/5 flex flex-col shrink-0 fm-sb overflow-y-auto py-2"
                    style={{ background: "rgba(255,255,255,0.01)" }}>
                    <p className="px-3 py-1 text-[10px] font-semibold text-white/20 uppercase tracking-widest">Устройства</p>
                    <button onClick={() => navigate("")}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors
                            ${currentPath === "" ? "bg-blue-500/15 text-blue-300" : "text-white/50 hover:bg-white/5 hover:text-white/80"}`}>
                        <HardDrive size={15} className="opacity-70" />Диск C
                    </button>
                    {items.filter(i => i.parentPath === "" && i.type === "folder").length > 0 && (<>
                        <p className="px-3 py-1 mt-3 text-[10px] font-semibold text-white/20 uppercase tracking-widest">Быстрый доступ</p>
                        {items.filter(i => i.parentPath === "" && i.type === "folder").map(f => (
                            <button key={f.name} onClick={() => navigate(f.name)}
                                className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors
                                    ${currentPath === f.name ? "bg-blue-500/15 text-blue-300" : "text-white/50 hover:bg-white/5 hover:text-white/80"}`}>
                                <Folder size={15} className="text-amber-400 opacity-70" />
                                <span className="truncate">{f.name}</span>
                            </button>
                        ))}
                    </>)}
                </div>

                {/* ── Main ── */}
                <div className="flex-1 flex flex-col min-w-0">
                    {/* Toolbar */}
                    <div className="h-10 flex items-center gap-1 px-2 border-b border-white/5 shrink-0">
                        <button onClick={goBack} disabled={histIdx === 0}
                            className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition">
                            <ArrowLeft size={14} />
                        </button>
                        <button onClick={goForward} disabled={histIdx >= history.length - 1}
                            className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 disabled:opacity-20 disabled:cursor-not-allowed transition">
                            <ArrowRight size={14} />
                        </button>
                        <button onClick={() => navigate("")}
                            className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition">
                            <Home size={14} />
                        </button>
                        <button onClick={() => fetchDir(currentPath)}
                            className="p-1.5 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/5 transition">
                            <RefreshCw size={14} />
                        </button>

                        {/* Breadcrumbs */}
                        <div className="flex items-center gap-0.5 text-xs overflow-hidden flex-1 mx-1">
                            {crumbs.map((c, i) => (
                                <div key={c.path + i} className="flex items-center gap-0.5 shrink-0">
                                    {i > 0 && <ChevronRight size={11} className="text-white/20" />}
                                    <button onClick={() => navigate(c.path)}
                                        className={`px-1.5 py-0.5 rounded transition-colors
                                            ${i === crumbs.length - 1 ? "text-white/70 font-medium" : "text-white/30 hover:text-white/60"}`}>
                                        {c.label}
                                    </button>
                                </div>
                            ))}
                        </div>

                        {/* Search */}
                        <div className="relative shrink-0">
                            <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30" />
                            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск..."
                                className="w-32 pl-7 pr-3 py-1 rounded-lg bg-white/5 border border-white/8 text-xs text-white/80 placeholder:text-white/20 focus:outline-none focus:border-blue-500/40 transition-all" />
                        </div>

                        {/* View controls */}
                        <div className="flex items-center gap-0.5 shrink-0 ml-1">
                            {clipboard && (
                                <button onClick={pasteItems}
                                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs text-white/60 hover:bg-white/8 hover:text-white transition mr-1">
                                    <Clipboard size={12} />{clipboard.op === "cut" ? "Вставить" : "Копия"}
                                </button>
                            )}
                            <button onClick={() => setView("list")}
                                className={`p-1.5 rounded-lg transition ${view === "list" ? "bg-white/10 text-white" : "text-white/30 hover:bg-white/5 hover:text-white/60"}`}>
                                <List size={14} />
                            </button>
                            <button onClick={() => setView("grid")}
                                className={`p-1.5 rounded-lg transition ${view === "grid" ? "bg-white/10 text-white" : "text-white/30 hover:bg-white/5 hover:text-white/60"}`}>
                                <Grid3X3 size={14} />
                            </button>
                        </div>
                    </div>

                    {/* File area */}
                    <div ref={contentRef} className="flex-1 overflow-y-auto fm-sb relative"
                        onMouseDown={onContentMouseDown}
                        onMouseMove={onContentMouseMove}
                        onMouseUp={onContentMouseUp}
                        onMouseLeave={onContentMouseUp}
                        onContextMenu={e => { if (!(e.target as HTMLElement).closest("[data-file]")) openBgCtx(e); }}>

                        {/* Selection box — portal to escape stacking context */}
                        {selBox && createPortal(
                            <div style={{
                                position: "fixed",
                                left: selBox.x, top: selBox.y,
                                width: selBox.w, height: selBox.h,
                                border: "1px solid rgba(59,130,246,0.6)",
                                background: "rgba(59,130,246,0.08)",
                                pointerEvents: "none",
                                zIndex: 999998,
                                borderRadius: 4,
                            }} />,
                            document.body
                        )}

                        {loading && (
                            <div className="flex flex-col items-center justify-center h-full gap-3 text-white/20 select-none">
                                <Loader2 size={32} className="animate-spin text-blue-400/50" />
                                <span className="text-sm">Загрузка...</span>
                            </div>
                        )}
                        {!loading && error && (
                            <div className="flex flex-col items-center justify-center h-full gap-3 select-none">
                                <AlertTriangle size={36} className="text-red-400/60" />
                                <span className="text-sm text-white/40 text-center max-w-xs px-4">{error}</span>
                                <button onClick={() => fetchDir(currentPath)}
                                    className="mt-2 px-4 py-2 rounded-lg text-xs bg-white/5 hover:bg-white/10 text-white/50 hover:text-white/80 border border-white/8 transition flex items-center gap-2">
                                    <RefreshCw size={12} />Повторить
                                </button>
                            </div>
                        )}
                        {!loading && !error && currentList.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-full gap-3 text-white/15 select-none">
                                <Folder size={40} />
                                <span className="text-sm">{search ? "Ничего не найдено" : "Папка пуста"}</span>
                                {!search && <span className="text-xs text-white/10">ПКМ → создать файл или папку</span>}
                            </div>
                        )}
                        {!loading && !error && currentList.length > 0 && (view === "list" ? renderList() : renderGrid())}
                    </div>

                    {/* Status bar */}
                    <div className="h-7 px-4 flex items-center justify-between text-[11px] text-white/20 border-t border-white/5 shrink-0">
                        <span>{!loading && !error ? `${currentList.length} элем.` : ""}</span>
                        <span className="flex items-center gap-3">
                            {selected.length > 0 && `Выделено: ${selected.length}`}
                            {clipboard && <span className="text-blue-400/60">{clipboard.op === "copy" ? "📋" : "✂️"} {clipboard.names.length} в буфере</span>}
                        </span>
                    </div>
                </div>
            </div>

            {/* All overlays rendered via portal into document.body
                to escape the Window's backdropFilter stacking context */}
            {modal && <InputModal title={modal.type === "newFile" ? "Новый файл" : modal.type === "newFolder" ? "Новая папка" : "Переименовать"} placeholder={modal.type === "newFile" ? "имя.txt" : modal.type === "newFolder" ? "Новая папка" : ""} value={modal.value} onChange={v => setModal(prev => prev ? { ...prev, value: v } : null)} onConfirm={handleModalConfirm} onCancel={() => setModal(null)} />}
            {confirm && <ConfirmDialog message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
            {ctx && <ContextMenu x={ctx.x} y={ctx.y} items={ctx.items} onClose={() => setCtx(null)} />}
        </>
    );
};