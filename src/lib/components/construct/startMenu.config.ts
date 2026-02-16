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
  { id: '9', name: 'Файлы', icon: Folder, category: 'Система' },
  { id: '1', name: 'Браузер', icon: Chrome, category: 'Интернет' },
  { id: '2', name: 'Терминал', icon: Terminal, category: 'Разработка' },
  { id: '3', name: 'Настройки', icon: Settings, category: 'Система' },
  { id: '4', name: 'Профиль', icon: User, category: 'Пользователь' },
  { id: '5', name: 'Документы', icon: FileText, category: 'Офис' },
  { id: '6', name: 'Галерея', icon: Image, category: 'Медиа' },
  { id: '7', name: 'Музыка', icon: Music, category: 'Медиа' },
  { id: '8', name: 'Видео', icon: Video, category: 'Медиа' },
];
