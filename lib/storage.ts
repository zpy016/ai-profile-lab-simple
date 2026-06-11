import { AppState, DEFAULT_CONFIG } from './types';

const STORAGE_KEY = 'ai-profile-poc-state';

export function getInitialState(): AppState {
  return {
    activeTab: 'quick',
    config: DEFAULT_CONFIG,
    quickInput: '',
    quickBlocks: [],
    quickTags: [],
    quickIntro: '',
    interviewMessages: [],
    interviewBlocks: [],
    interviewTags: [],
    interviewIntro: '',
    interviewRound: 0,
    interviewEnded: false,
    profile: {
      intro: '',
      tags: [],
      blocks: [],
    },
    testLogs: [],
  };
}

export function loadState(): AppState {
  if (typeof window === 'undefined') return getInitialState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getInitialState();
    const parsed = JSON.parse(raw) as AppState;
    // 对于 config，如果旧数据缺少新字段，用默认值填充；如果字段为空字符串，也用默认值
    const mergedConfig = { ...DEFAULT_CONFIG };
    if (parsed.config) {
      (Object.keys(DEFAULT_CONFIG) as Array<keyof typeof DEFAULT_CONFIG>).forEach((key) => {
        const val = parsed.config[key];
        if (val !== undefined && val !== '') {
          (mergedConfig as any)[key] = val;
        }
      });
    }
    const state = { ...getInitialState(), ...parsed, config: mergedConfig };
    // 兼容旧数据：testLogs 可能不存在
    if (!Array.isArray(state.testLogs)) {
      state.testLogs = [];
    }
    // 限制日志数量，防止 localStorage 溢出
    if (state.testLogs.length > 100) {
      state.testLogs = state.testLogs.slice(0, 100);
    }
    return state;
  } catch {
    return getInitialState();
  }
}

export function saveState(state: AppState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}
