
export enum AppType {
  NOTES = 'Notes',
  FILES = 'Files',
  BROWSER = 'Browser',
  AI_ASSISTANT = 'Gemini AI',
  CALENDAR = 'Calendar',
  SETTINGS = 'Settings',
  BILIBILI = '哔哩哔哩',
  XIAOHONGSHU = '小红书',
  CALCULATOR = '计算器',
  ALIPAY = '支付宝'
}

export type WindowState = 'floating' | 'split-left' | 'split-middle' | 'split-right' | 'split-left-top' | 'split-left-bottom' | 'split-right-top' | 'split-right-bottom' | 'maximized' | 'minimized';

export interface AppInstance {
  id: string;
  type: AppType;
  title: string;
  state: WindowState;
  zIndex: number;
  position: { x: number; y: number };
  size: { width: number | string; height: number | string };
}

export interface SystemState {
  isControlCenterOpen: boolean;
  activeAppId: string | null;
  volume: number;
  brightness: number;
  battery: number;
  time: string;
}
