'use client';

import React, { useState } from 'react';
import { AppState, TestLog } from '@/lib/types';
import Button from '@/components/shared/Button';

interface TestLogManagerProps {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
}

export default function TestLogManager({ state, setState }: TestLogManagerProps) {
  const [showSave, setShowSave] = useState(false);
  const [showLoad, setShowLoad] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveAuthor, setSaveAuthor] = useState('');
  const [saveDesc, setSaveDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cloudList, setCloudList] = useState<any[]>([]);
  const [message, setMessage] = useState('');

  const logs = state.testLogs;

  const handleSaveCloud = async () => {
    if (!saveName.trim() || logs.length === 0) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/logs/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: saveName, author: saveAuthor, description: saveDesc, logs }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ 保存成功！');
        setSaveName('');
        setSaveAuthor('');
        setSaveDesc('');
        setTimeout(() => { setShowSave(false); setMessage(''); }, 1200);
      } else {
        setMessage(`❌ ${data.error || '保存失败'}`);
      }
    } catch {
      setMessage('❌ 网络错误');
    } finally {
      setSaving(false);
    }
  };

  const openLoad = async () => {
    setShowLoad(true);
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/logs/list');
      const data = await res.json();
      setCloudList(data.logs || []);
    } catch {
      setMessage('❌ 获取列表失败');
      setCloudList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadCloud = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/logs/load?id=${id}`);
      const data = await res.json();
      if (data.doc) {
        setState((prev) => ({ ...prev, testLogs: data.doc.logs }));
        setMessage('✅ 加载成功！');
        setTimeout(() => { setShowLoad(false); setMessage(''); }, 800);
      } else {
        setMessage(`❌ ${data.error || '加载失败'}`);
      }
    } catch {
      setMessage('❌ 网络错误');
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (logs.length === 0) return;
    const headers = ['timestamp', 'workflow', 'model', 'temperature', 'success', 'latencyMs', 'prompt_tokens', 'completion_tokens', 'total_tokens', 'userPrompt_snippet', 'systemPrompt_snippet', 'rawOutput_snippet', 'errorMessage'];
    const rows = logs.map((log) => [
      log.timestamp,
      log.workflow,
      log.model,
      log.temperature,
      log.success ? '1' : '0',
      log.latencyMs,
      log.usage?.prompt_tokens ?? '',
      log.usage?.completion_tokens ?? '',
      log.usage?.total_tokens ?? '',
      log.userPrompt.slice(0, 80).replace(/\n/g, ' '),
      log.systemPrompt.slice(0, 80).replace(/\n/g, ' '),
      log.rawOutput.slice(0, 80).replace(/\n/g, ' '),
      log.errorMessage || '',
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-logs-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('✅ CSV 已下载');
    setTimeout(() => setMessage(''), 2000);
  };

  const downloadMarkdown = () => {
    if (logs.length === 0) return;
    const md = logs.map((log, idx) => {
      const usage = log.usage ? `Prompt: ${log.usage.prompt_tokens} | Completion: ${log.usage.completion_tokens} | Total: ${log.usage.total_tokens}` : 'N/A';
      return `## 测试记录 #${idx + 1} | ${new Date(log.timestamp).toLocaleString()} | ${log.workflow} | ${log.success ? '✅ 成功' : '❌ 失败'} | ${log.latencyMs}ms

### 配置快照
- Model: ${log.configSnapshot.model}
- Temperature: ${log.configSnapshot.temperature}

### 输入
**System Prompt:**
\`\`\`
${log.systemPrompt}
\`\`\`

**User Prompt:**
\`\`\`
${log.userPrompt}
\`\`\`

### 输出
\`\`\`
${log.rawOutput}
\`\`\`

### Token 用量
${usage}

${log.errorMessage ? `**错误:** ${log.errorMessage}` : ''}
---
`;
    }).join('\n');
    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-logs-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('✅ Markdown 已下载');
    setTimeout(() => setMessage(''), 2000);
  };

  const clearLogs = () => {
    if (!window.confirm(`确定清空全部 ${logs.length} 条本地测试日志吗？`)) return;
    setState((prev) => ({ ...prev, testLogs: [] }));
    setMessage('✅ 已清空');
    setTimeout(() => setMessage(''), 2000);
  };

  return (
    <div className="border-t border-border pt-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-text-primary">📊 测试日志 ({logs.length})</h3>
        {logs.length > 0 && (
          <button onClick={() => setExpanded(!expanded)} className="text-[11px] text-text-secondary hover:text-text-primary">
            {expanded ? '收起' : '展开'}
          </button>
        )}
      </div>

      {expanded && (
        <div className="space-y-1.5 max-h-48 overflow-y-auto">
          {logs.slice(0, 10).map((log) => (
            <div key={log.id} className="text-[11px] border border-border-light rounded-btn px-2 py-1.5 flex items-center justify-between">
              <span className={`${log.success ? 'text-green-700' : 'text-error'} font-medium`}>
                {log.success ? '✓' : '✗'}
              </span>
              <span className="text-text-secondary truncate flex-1 mx-2">{log.workflow}</span>
              <span className="text-text-placeholder">{log.latencyMs}ms</span>
            </div>
          ))}
          {logs.length > 10 && (
            <p className="text-[10px] text-text-secondary text-center">还有 {logs.length - 10} 条…</p>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" className="text-xs py-1.5" onClick={() => setShowSave(true)} disabled={logs.length === 0}>
          💾 保存到云端
        </Button>
        <Button variant="secondary" className="text-xs py-1.5" onClick={openLoad}>
          📂 从云端加载
        </Button>
        <Button variant="ghost" className="text-xs py-1.5" onClick={downloadCSV} disabled={logs.length === 0}>
          📥 下载 CSV
        </Button>
        <Button variant="ghost" className="text-xs py-1.5" onClick={downloadMarkdown} disabled={logs.length === 0}>
          📄 下载 Markdown
        </Button>
      </div>

      {logs.length > 0 && (
        <Button variant="danger" className="w-full text-xs py-1.5" onClick={clearLogs}>
          🗑️ 清空本地日志
        </Button>
      )}

      {message && (
        <div className="text-xs text-center py-1 px-2 rounded bg-surface border border-border-light text-text-primary">
          {message}
        </div>
      )}

      {/* Save Modal */}
      {showSave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowSave(false)}>
          <div className="bg-surface border border-border rounded-card p-5 w-full max-w-sm space-y-3" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-semibold text-text-primary">保存日志到云端</h4>
            <input className="input w-full text-sm" placeholder="记录名称（必填）" value={saveName} onChange={(e) => setSaveName(e.target.value)} />
            <input className="input w-full text-sm" placeholder="作者名称" value={saveAuthor} onChange={(e) => setSaveAuthor(e.target.value)} />
            <input className="input w-full text-sm" placeholder="描述（可选）" value={saveDesc} onChange={(e) => setSaveDesc(e.target.value)} />
            <div className="flex gap-2 pt-1">
              <Button variant="primary" className="flex-1 text-xs" onClick={handleSaveCloud} disabled={saving || !saveName.trim()}>
                {saving ? '保存中…' : '确认保存'}
              </Button>
              <Button variant="secondary" className="text-xs" onClick={() => setShowSave(false)}>取消</Button>
            </div>
          </div>
        </div>
      )}

      {/* Load Modal */}
      {showLoad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowLoad(false)}>
          <div className="bg-surface border border-border rounded-card p-5 w-full max-w-md space-y-3 max-h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-semibold text-text-primary">从云端加载日志</h4>
            <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
              {loading && <p className="text-xs text-text-secondary text-center py-4">加载中…</p>}
              {!loading && cloudList.length === 0 && <p className="text-xs text-text-secondary text-center py-4">还没有云端日志记录</p>}
              {cloudList.map((item) => (
                <div key={item.id} className="border border-border-light rounded-btn p-3 cursor-pointer hover:bg-elevated transition-colors" onClick={() => handleLoadCloud(item.id)}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">{item.name}</span>
                    <span className="text-[10px] text-text-secondary">{new Date(item.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-[11px] text-text-secondary mt-0.5">{item.author} {item.description ? `· ${item.description}` : ''}</div>
                </div>
              ))}
            </div>
            <Button variant="secondary" className="w-full text-xs" onClick={() => setShowLoad(false)}>关闭</Button>
          </div>
        </div>
      )}
    </div>
  );
}
