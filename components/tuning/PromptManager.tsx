'use client';

import React, { useState, useRef } from 'react';
import { AppConfig, PromptDocument } from '@/lib/types';
import Button from '@/components/shared/Button';

interface PromptManagerProps {
  config: AppConfig;
  onLoad: (config: AppConfig) => void;
}

export default function PromptManager({ config, onLoad }: PromptManagerProps) {
  const [showSave, setShowSave] = useState(false);
  const [showLoad, setShowLoad] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [saveAuthor, setSaveAuthor] = useState('');
  const [saveDesc, setSaveDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cloudList, setCloudList] = useState<Omit<PromptDocument, 'config'>[]>([]);
  const [message, setMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!saveName.trim()) return;
    setSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/prompts/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: saveName,
          author: saveAuthor,
          description: saveDesc,
          config,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('✅ 保存成功！');
        setSaveName('');
        setSaveAuthor('');
        setSaveDesc('');
        setTimeout(() => {
          setShowSave(false);
          setMessage('');
        }, 1200);
      } else {
        setMessage(`❌ ${data.error || '保存失败'}`);
      }
    } catch {
      setMessage('❌ 网络错误，保存失败');
    } finally {
      setSaving(false);
    }
  };

  const openLoad = async () => {
    setShowLoad(true);
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/prompts/list');
      const data = await res.json();
      setCloudList(data.prompts || []);
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
      const res = await fetch(`/api/prompts/load?id=${id}`);
      const data = await res.json();
      if (data.doc) {
        onLoad(data.doc.config);
        setMessage('✅ 加载成功！');
        setTimeout(() => {
          setShowLoad(false);
          setMessage('');
        }, 800);
      } else {
        setMessage(`❌ ${data.error || '加载失败'}`);
      }
    } catch {
      setMessage('❌ 网络错误，加载失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const payload = {
      name: '提示词配置',
      author: '',
      description: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      config,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-config-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setMessage('✅ 已下载到本地');
    setTimeout(() => setMessage(''), 2000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (parsed.config && typeof parsed.config === 'object') {
          onLoad(parsed.config);
          setMessage('✅ 本地文件加载成功！');
        } else {
          setMessage('❌ 文件格式错误，缺少 config 字段');
        }
      } catch {
        setMessage('❌ 无法解析 JSON 文件');
      }
      setTimeout(() => setMessage(''), 3000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="border-t border-border pt-4 space-y-3">
      <h3 className="text-sm font-semibold text-text-primary">提示词管理</h3>

      <div className="grid grid-cols-2 gap-2">
        <Button variant="secondary" className="text-xs py-1.5" onClick={() => setShowSave(true)}>
          💾 保存到云端
        </Button>
        <Button variant="secondary" className="text-xs py-1.5" onClick={openLoad}>
          📂 从云端加载
        </Button>
        <Button variant="ghost" className="text-xs py-1.5" onClick={handleDownload}>
          ⬇️ 下载到本地
        </Button>
        <Button variant="ghost" className="text-xs py-1.5" onClick={() => fileInputRef.current?.click()}>
          ⬆️ 从本地上传
        </Button>
        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleFileSelect} />
      </div>

      {message && (
        <div className="text-xs text-center py-1 px-2 rounded bg-surface border border-border-light text-text-primary">
          {message}
        </div>
      )}

      {/* Save Modal */}
      {showSave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowSave(false)}>
          <div className="bg-surface border border-border rounded-card p-5 w-full max-w-sm space-y-3" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-semibold text-text-primary">保存到云端</h4>
            <input
              className="input w-full text-sm"
              placeholder="提示词名称（必填）"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
            />
            <input
              className="input w-full text-sm"
              placeholder="作者名称"
              value={saveAuthor}
              onChange={(e) => setSaveAuthor(e.target.value)}
            />
            <input
              className="input w-full text-sm"
              placeholder="描述（可选）"
              value={saveDesc}
              onChange={(e) => setSaveDesc(e.target.value)}
            />
            <div className="flex gap-2 pt-1">
              <Button variant="primary" className="flex-1 text-xs" onClick={handleSave} disabled={saving || !saveName.trim()}>
                {saving ? '保存中…' : '确认保存'}
              </Button>
              <Button variant="secondary" className="text-xs" onClick={() => setShowSave(false)}>
                取消
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Load Modal */}
      {showLoad && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowLoad(false)}>
          <div className="bg-surface border border-border rounded-card p-5 w-full max-w-md space-y-3 max-h-[70vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-semibold text-text-primary">从云端加载</h4>
            <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
              {loading && <p className="text-xs text-text-secondary text-center py-4">加载中…</p>}
              {!loading && cloudList.length === 0 && (
                <p className="text-xs text-text-secondary text-center py-4">还没有人保存过提示词，来当第一个吧！</p>
              )}
              {cloudList.map((item) => (
                <div
                  key={item.id}
                  className="border border-border-light rounded-btn p-3 cursor-pointer hover:bg-elevated transition-colors"
                  onClick={() => handleLoadCloud(item.id)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text-primary">{item.name}</span>
                    <span className="text-[10px] text-text-secondary">{new Date(item.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="text-[11px] text-text-secondary mt-0.5">
                    {item.author} {item.description ? `· ${item.description}` : ''}
                  </div>
                </div>
              ))}
            </div>
            <Button variant="secondary" className="w-full text-xs" onClick={() => setShowLoad(false)}>
              关闭
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
