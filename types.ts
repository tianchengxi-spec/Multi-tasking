
export enum AppType {
  NOTES = '笔记',
  FILES = '文件',
  BROWSER = '浏览器',
  AI_ASSISTANT = 'AI 助手',
  CALENDAR = '日历',
  SETTINGS = '设置',
  XIAOHONGSHU = '小红书',
  CALCULATOR = '计算器',
  CLOUD_DRIVE = '网盘',
  WHITEBOARD = '无界白板',
  DICTIONARY = '词典'
}

export type WindowState = 'floating' | 'floating-icon' | 'split-left' | 'split-middle' | 'split-right' | 'split-left-top' | 'split-left-bottom' | 'split-right-top' | 'split-right-bottom' | 'maximized' | 'minimized' | 'split-sidebar-left' | 'split-sidebar-right';

export interface AppInstance {
  id: string;
  type: AppType;
  title: string;
  state: WindowState;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
  initialData?: any;
  isPinned?: boolean;
  isTopmost?: boolean;
}

export interface TaskCombination {
  id: string;
  name?: string;
  mode?: 'board' | 'toolring';
  color?: string;
  apps: { type: AppType; state: WindowState }[];
  splitRatios: number[];
  timestamp: number;
}

export interface SystemState {
  isControlCenterOpen: boolean;
  activeAppId: string | null;
  volume: number;
  brightness: number;
  battery: number;
  time: string;
}
