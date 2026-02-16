import {
  Folder,
  Settings,
  User,
  Chrome,
  FileText,
  Image,
  Terminal,
  Music,
  Video,
} from 'lucide-react';

export interface AppItem {
  id: string;
  name: string;
  icon: any;
  category: string;
}

export const appsConfig: AppItem[] = [
  { id: 'files', name: 'Файлы', icon: Folder, category: 'Система' },
  { id: 'browser', name: 'Браузер', icon: Chrome, category: 'Интернет' },
  { id: 'terminal', name: 'Терминал', icon: Terminal, category: 'Разработка' },
  { id: 'settings', name: 'Настройки', icon: Settings, category: 'Система' },
  { id: 'profile', name: 'Профиль', icon: User, category: 'Пользователь' },
  { id: 'documents', name: 'Документы', icon: FileText, category: 'Офис' },
  { id: 'gallery', name: 'Галерея', icon: Image, category: 'Медиа' },
  { id: 'music', name: 'Музыка', icon: Music, category: 'Медиа' },
  { id: 'video', name: 'Видео', icon: Video, category: 'Медиа' },
  { id: 'files', name: 'Файлы', icon: Folder, category: 'Система' },
  { id: 'browser', name: 'Браузер', icon: Chrome, category: 'Интернет' },
  { id: 'terminal', name: 'Терминал', icon: Terminal, category: 'Разработка' },
  { id: 'settings', name: 'Настройки', icon: Settings, category: 'Система' },
  { id: 'profile', name: 'Профиль', icon: User, category: 'Пользователь' },
  { id: 'documents', name: 'Документы', icon: FileText, category: 'Офис' },
  { id: 'gallery', name: 'Галерея', icon: Image, category: 'Медиа' },
  { id: 'music', name: 'Музыка', icon: Music, category: 'Медиа' },
  { id: 'video', name: 'Видео', icon: Video, category: 'Медиа' },
];
