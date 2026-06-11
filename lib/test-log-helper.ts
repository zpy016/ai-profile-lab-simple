import { AppState, TestLog } from './types';

export function createTestLog(
  setState: React.Dispatch<React.SetStateAction<AppState>>,
  partial: Omit<TestLog, 'id' | 'timestamp'>
) {
  const entry: TestLog = {
    id: `tl-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    timestamp: new Date().toISOString(),
    ...partial,
  };
  setState((prev) => ({
    ...prev,
    testLogs: [entry, ...prev.testLogs].slice(0, 100),
  }));
}
