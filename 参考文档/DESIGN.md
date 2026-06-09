# DESIGN.md — 同学录 · AI 自我介绍 POC 设计系统

> **版本**：v1.3 | 2026-06-08
> **产品**：二代同学录 AI Profile POC — 用 AI 把「写个人主页」变成「跟 AI 聊天」
> **平台**：桌面端 Web 应用（≥1024px，不支持移动端）
> **设计继承**：实验中学 2006 届校友「基地」设计系统 v1.0（DESIGN-第一代产品参考设计.md）
> **品牌参考**：Apple（极简留白）× Stripe（编辑式排版品质）× Airbnb（温暖人文底色）
>
> **v1.3 变更**：(1) Admin 左侧改为三场景沙盒控制台视觉规格（场景标签页、沙盒输入区、结果审核区）；(2) 新增模板管理区域视觉规格（下拉选择、保存对话框、导入/导出按钮组）；(3) 新增 ResultRenderer 统一组件视觉规格（标签删除、简介编辑、delta 操作按钮）；(4) 更新 AI Lab 后台布局说明（左侧从只读预览改为可交互沙盒）
>
> **v1.2 变更**：(1) 补充 draft 态提示条视觉规格（灰底边框，区别于 dirty 态琥珀金）；(2) 补充 SSE 断线恢复状态提示条规格（琥珀金重连中 / 错误红中断）；(3) 补充 interview 草稿恢复 banner 规格（琥珀金虚线边框）；(4) 已设计组件清单更新（标记已开发组件）

---

## 1. Visual Theme & Atmosphere（视觉主题与氛围）

**设计哲学**：第二代产品是第一代「基地」的聚焦演进——将「AI 自我介绍」嫁接在基地的克制怀旧基因之上。这不是一个新 App，是基地的新能力。视觉语言一脉相承：**Digital Yearbook × Professional Network**，数字纪念册的怀旧质感与精英网络的专业体面，再加上 AI 的「灵性」。

**核心关键词**：克制、体面、包浆感、高级校刊、数字纪念册

**AI 视觉新维度**：
- AI 不是冷冰冰的机器，也不是拟人化的助手。它是「记忆档案馆的整理员」——安静、精准、尊重你的每一段过去
- AI 交互状态使用**琥珀金**（`#C49A6C`）作为专属色——不刺眼、不科技感，更像旧书页边缘的鎏金
- 增量内容的「暂存」态与用户「确认」态有清晰的视觉边界，让用户永远是 Boss

**视觉基调**：
- 参考《Monocle》与《Kinfolk》的排版比例——大留白、重字体层级、图片与文字的诗意穿插
- 色彩带有「包浆感」——所有颜色经过灰度调和，呈现莫兰迪色系的褪色质感
- 以微弱悬浮阴影表现卡片质感，禁止弥散阴影

**光影与质感倾向**：
- 微弱悬浮阴影表现卡片层叠质感
- AI 增量内容以琥珀金浅底 + 虚线边框呈现「暂存」语义
- 输入舱在 AI 解析时出现琥珀金跑马灯流光，替代传统菊花转圈
- POC 阶段不做暗色模式，不做毛玻璃效果

---

## 2. Color Palette & Roles（调色板与角色）

### Primary Colors

| 色彩名称 | HEX | CSS 变量 | 使用场景 |
|---------|-----|---------|---------|
| 档案红 | `#9B4D4D` | `--color-primary` | 核心操作按钮、重要标记、AI 操作确认 |
| 档案红悬浮 | `#8A4343` | `--color-primary-hover` | 按钮悬浮态 |
| 档案红按下 | `#7A3A3A` | `--color-primary-active` | 按钮按下态 |
| 档案红浅底 | `#F5EAEA` | `--color-primary-surface` | 按钮所在卡片淡底色、采访用户气泡底 |

### Brand & Dark

| 色彩名称 | HEX | CSS 变量 | 使用场景 |
|---------|-----|---------|---------|
| 旧黑板青 | `#4A6670` | `--color-brand-dark` | 二级标题、品牌标识、页面标题 |
| 深夜蓝 | `#2C3E50` | `--color-text-primary` | 主文本色、标题色 |
| 墨色 | `#1A1A2E` | `--color-text-heading` | 大标题、profile 姓名 |

### Accent / Interactive（AI 交互专属色系）

| 色彩名称 | HEX | CSS 变量 | 使用场景 |
|---------|-----|---------|---------|
| 琥珀金 | `#C49A6C` | `--color-accent` | AI 解析高亮、Parsing 态跑马灯、增量标签虚线框边框 |
| 琥珀金浅底 | `rgba(196, 154, 108, 0.15)` | `--color-accent-bg` | AI 增量段落/标签的高辨识度高亮背景 |
| 琥珀金深底 | `#FDF6EC` | `--color-accent-surface` | AI 解析骨架屏底色、字段填充淡底 |
| 褪色相纸黄 | `#D4C5A0` | `--color-accent-warm` | 辅助装饰色、温暖点缀 |
| 爬山虎绿 | `#7A8B6F` | `--color-accent-green` | 成功状态、公开可见标识 |

### Neutral / Gray Scale

| 色彩名称 | HEX | CSS 变量 | 使用场景 |
|---------|-----|---------|---------|
| 主文本 | `#2C3E50` | `--color-text-primary` | 正文、标题 |
| 次文本 | `#546E7A` | `--color-text-secondary` | 辅助说明、标签描述（WCAG AA 修正值） |
| 占位文本 | `#7F8C8D` | `--color-text-placeholder` | placeholder、空状态文案（WCAG AA 达标修正值） |
| 禁用文本 | `#A3B1B2` | `--color-text-disabled` | 禁用态文字 |
| 分割线 | `#E8E4DE` | `--color-border` | 列表分割线、卡片边框 |
| 浅分割线 | `#F0ECE6` | `--color-border-light` | 更轻量的内部分割 |

### Surface & Borders

| 色彩名称 | HEX | CSS 变量 | 使用场景 |
|---------|-----|---------|---------|
| 纸张白 | `#FAFAF7` | `--color-bg` | 全局主背景色，带纸张温度的米白 |
| 纯白 | `#FFFFFF` | `--color-surface` | 卡片底色、弹窗底色、输入框底 |
| 浮层白 | `#F7F5F0` | `--color-elevated` | 二级浮层、抽屉内背景 |

### Content Block Category Colors

| 分类 | 色彩名称 | HEX | CSS 变量 | 使用场景 |
|------|---------|-----|---------|---------|
| 自我介绍 | 档案红 | `#9B4D4D` | `--color-block-self_intro` | 内容块左侧色条、分类标识 |
| 历史背景 | 藕紫 | `#B8A9C9` | `--color-block-background` | 内容块左侧色条 |
| 能提供的 | 鼠尾草绿 | `#A8BF9A` | `--color-block-offer` | 内容块左侧色条 |
| 具体需求 | 尘土橘 | `#C9A882` | `--color-block-need` | 内容块左侧色条 |
| 自定义 | 雾蓝 | `#9BB5C4` | `--color-block-custom` | 内容块左侧色条 |

### Visibility Toggle Colors

| 可见性 | 标识色 HEX | 使用场景 |
|--------|----------|---------|
| 公开 | `#7A8B6F`（爬山虎绿） | 公开可见标识 |
| 仅搜索可见 | `#C49A6C`（琥珀金） | search_only 标识，虚线框 |
| 仅自己可见 | `#A3B1B2`（禁用文本） | private 标识 |

### Semantic Colors

| 语义 | HEX | CSS 变量 | 使用场景 |
|------|-----|---------|---------|
| 成功 | `#7A8B6F` | `--color-success` | 操作成功、Toast 成功 |
| 成功底 | `#EDF2E8` | `--color-success-surface` | 成功状态淡底色 |
| 警告 | `#C49A6C` | `--color-warning` | 需要注意的信息 |
| 警告底 | `#FDF6EC` | `--color-warning-surface` | 警告状态淡底色 |
| 错误 | `#B85C5C` | `--color-error` | 操作失败、Error 态边框 |
| 错误底 | `#F8EDED` | `--color-error-surface` | 错误状态淡底色 |
| 信息 | `#4A6670` | `--color-info` | 提示性信息 |
| 信息底 | `#EBF0F2` | `--color-info-surface` | 信息状态淡底色 |

### Shadow Colors

| 用途 | 值 | CSS 变量 |
|------|-----|---------|
| 卡片阴影色 | `rgba(44, 62, 80, 0.06)` | `--shadow-color` |
| 深层阴影色 | `rgba(44, 62, 80, 0.12)` | `--shadow-color-deep` |
| 遮罩层 | `rgba(26, 26, 46, 0.45)` | `--overlay-color` |

---

## 3. Typography Rules（排版规则）

### Font Family

```css
--font-serif: 'Noto Serif SC', 'Source Han Serif SC', 'STSong', 'SimSun', serif;
--font-sans: 'PingFang SC', -apple-system, 'Helvetica Neue', 'Microsoft YaHei', sans-serif;
--font-mono: 'SF Mono', 'Menlo', 'Monaco', 'Consolas', monospace;
```

**使用原则**：
- **衬线体**：页面主标题、简介区域占位文案、Profile 姓名。拉升文化底蕴与怀旧感
- **无衬线体**：正文、数据、标签、按钮、辅助信息。确保阅读效率
- **等宽字体**：仅用于移动端引导页的 URL 展示

### Type Scale

| 层级 | 字号(px) | 字号(rem) | 字重 | 行高 | 字距 | 字体 | 使用场景 |
|------|---------|----------|------|------|------|------|---------|
| Display | 24 | 1.5 | 600 | 1.4 | 0.01em | Serif | 页面主标题（如 Profile 姓名） |
| Heading 1 | 20 | 1.25 | 600 | 1.4 | 0.01em | Sans | 创建方式选择页标题、移动端引导页标题 |
| Heading 2 | 17 | 1.0625 | 600 | 1.45 | 0 | Sans | 卡片标题、模块名（如「简介」「标签」） |
| Heading 3 | 15 | 0.9375 | 600 | 1.45 | 0 | Sans | 内容块标题、对话气泡发送者名 |
| Body Large | 16 | 1 | 400 | 1.7 | 0 | Sans | AI 意图输入舱文字、简介正文 |
| Body | 14 | 0.875 | 400 | 1.6 | 0 | Sans | 正文、内容块文字、对话气泡正文 |
| Body Small | 13 | 0.8125 | 400 | 1.55 | 0 | Sans | 辅助说明、可见性标签文字 |
| Caption | 12 | 0.75 | 500 | 1.5 | 0.01em | Sans | 标签、时间戳、Toast 文字、`[保留]` `[抹除]` 按钮 |
| Nano | 10 | 0.625 | 500 | 1.4 | 0.02em | Sans | AI 角标、增量标识、图片过期提示条 |

**设计哲学**：
- 字重只使用 400（Regular）、500（Medium）、600（SemiBold）三档。正文 400，Caption/标签 500，标题 600
- 标题字距微宽（0.01em），正文零字距
- 行高偏大（1.55-1.7），营造呼吸感
- 衬线标题与无衬线正文形成文理对比，如同校刊的排版传统
- AI 增量内容按钮（`[保留]` `[抹除]`）使用 Caption 字号，保持低调不抢眼

---

## 4. Component Stylings（组件样式）

### 4.1 Buttons

```css
/* Primary Button — 档案红 */
.btn-primary {
  background: var(--color-primary);          /* #9B4D4D */
  color: #FFFAF5;                            /* 暖白，对比度 ~5.0:1 */
  border: none;
  border-radius: 4px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-sans);
  letter-spacing: 0.02em;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
}
.btn-primary:hover { background: var(--color-primary-hover); }   /* #8A4343 */
.btn-primary:active { background: var(--color-primary-active); transform: scale(0.98); }

/* Secondary Button — 描边 */
.btn-secondary {
  background: transparent;
  color: var(--color-primary);               /* #9B4D4D */
  border: 1px solid var(--color-primary);
  border-radius: 4px;
  padding: 9px 23px;
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: background 0.2s ease;
}
.btn-secondary:hover { background: var(--color-primary-surface); } /* #F5EAEA */

/* Ghost Button — 文字按钮 */
.btn-ghost {
  background: transparent;
  color: var(--color-brand-dark);            /* #4A6670 */
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  font-family: var(--font-sans);
  cursor: pointer;
}
.btn-ghost:hover { background: var(--color-elevated); }

/* Danger Button — 删除确认 */
.btn-danger {
  background: var(--color-error);            /* #B85C5C */
  color: #FFFAF5;
  border: none;
  border-radius: 4px;
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
}

/* AI 增量操作按钮 — 琥珀金描边，极简 */
.btn-delta {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 500;
  font-family: var(--font-sans);
  color: var(--color-accent);                /* #C49A6C */
  background: transparent;
  border: 1px solid var(--color-accent);
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-delta:hover {
  background: var(--color-accent-bg);        /* rgba(196,154,108,0.15) */
  color: var(--color-primary);               /* 悬浮时变为档案红，暗示确认 */
}
.btn-delta--reject {
  color: var(--color-text-secondary);
  border-color: var(--color-border);
}
.btn-delta--reject:hover {
  color: var(--color-error);
  border-color: var(--color-error);
  background: var(--color-error-surface);
}
```

### 4.2 Cards

```css
/* 基础卡片 */
.card {
  background: var(--color-surface);          /* #FFFFFF */
  border: 1px solid var(--color-card-border); /* #E8E4DE */
  border-radius: 6px;
  padding: 16px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.25s ease;
}
.card:hover {
  box-shadow: var(--shadow-md);
}

/* 内容块卡片 — 左侧分类色条 */
.card--content-block {
  position: relative;
  padding-left: 20px;                        /* 16px + 4px 色条间距 */
}
.card--content-block::before {
  content: '';
  position: absolute;
  left: 4px;
  top: 16px;
  bottom: 16px;
  width: 3px;
  border-radius: 1.5px;
}
.card--content-block.self_intro::before  { background: var(--color-block-self_intro); }
.card--content-block.background::before  { background: var(--color-block-background); }
.card--content-block.offer::before        { background: var(--color-block-offer); }
.card--content-block.need::before         { background: var(--color-block-need); }
.card--content-block.custom::before       { background: var(--color-block-custom); }

/* AI 增量内容块 — 琥珀金高亮底 */
.card--delta {
  background: var(--color-accent-bg);        /* rgba(196,154,108,0.15) */
  border: 1px dashed var(--color-accent);
  position: relative;
}
.card--delta-actions {
  display: flex;
  gap: 8px;
  margin-top: 10px;
  justify-content: flex-end;
}

/* 虚线占位卡片 — 空状态 */
.card--placeholder {
  border: 1px dashed var(--color-border);
  background: transparent;
  text-align: center;
  padding: 32px 16px;
}
.card--placeholder .placeholder-text {
  font-size: 14px;
  color: var(--color-text-placeholder);      /* #7F8C8D */
  margin-bottom: 16px;
}
```

### 4.3 Inputs

```css
/* 基础输入框 */
.input {
  border: 1px solid var(--color-border);     /* #E8E4DE */
  border-radius: 4px;
  padding: 10px 14px;
  font-size: 14px;
  font-family: var(--font-sans);
  color: var(--color-text-primary);
  background: var(--color-surface);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.input::placeholder {
  color: var(--color-text-placeholder);      /* #7F8C8D */
  font-style: normal;
}
.input:focus {
  outline: none;
  border-color: var(--color-brand-dark);     /* #4A6670 */
  box-shadow: 0 0 0 2px rgba(74, 102, 112, 0.12);
}

/* AI 意图输入舱 — 大面积文本输入 */
.input-intent {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 16px;
  font-size: 16px;
  font-family: var(--font-sans);
  color: var(--color-text-primary);
  background: var(--color-surface);
  line-height: 1.7;
  min-height: 120px;
  width: 100%;
  resize: none;                              /* 禁止手动拖拽 resize */
  overflow: hidden;                          /* 禁止内部滚动条 */
  transition: border-color 0.25s ease, height 0.15s ease;
}
.input-intent:focus {
  outline: none;
  border-color: var(--color-accent);         /* 琥珀金——AI 交互的专属聚焦色 */
  box-shadow: 0 0 0 2px rgba(196, 154, 108, 0.15);
}
.input-intent::placeholder {
  color: var(--color-text-placeholder);
  font-size: 16px;
  line-height: 1.7;
}

/* 语音输入引导图标 — 非录音按钮，仅提示 */
.input-voice-hint {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  font-size: 12px;
  color: var(--color-text-secondary);        /* #546E7A */
  background: var(--color-elevated);         /* #F7F5F0 */
  border-radius: 4px;
  cursor: default;                           /* 非点击态 */
  user-select: none;
}
```

### 4.4 AI Intent Cabin — 4-State Visual State Machine

```css
/* === State 1: Idle（初始态）=== */
.input-intent--idle {
  border-color: var(--color-border);         /* #E8E4DE */
}
/* Placeholder 呼吸闪烁 */
.input-intent--idle::placeholder {
  animation: placeholderPulse 3s ease-in-out infinite;
}
@keyframes placeholderPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* === State 2: Parsing（AI 解析中）=== */
/* 边框出现琥珀金跑马灯流光 */
.input-intent--parsing {
  border-color: var(--color-accent);         /* #C49A6C */
  background-image: linear-gradient(90deg,
    transparent 0%,
    rgba(196, 154, 108, 0.06) 50%,
    transparent 100%);
  background-size: 200% 100%;
  animation: parsingGlow 1.5s ease-in-out infinite;
  pointer-events: none;                      /* 解析中禁止输入 */
}
@keyframes parsingGlow {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* === State 3: Field_Filling（字段逐个填充）=== */
/* 预览区字段逐个闪烁琥珀金浅底 */
.field--filling {
  background-color: var(--color-accent-surface); /* #FDF6EC */
  transition: background-color 0.5s ease-out;
}
.field--filled {
  background-color: transparent;
}
.field--filling .field-value {
  animation: typewriterReveal 0.2s ease-out forwards;
}
@keyframes typewriterReveal {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* === State 4: Error（缺失或错误）=== */
.input-intent--error {
  border-color: var(--color-error);          /* #B85C5C */
  animation: fieldShake 0.4s ease-out;
}
@keyframes fieldShake {
  0%, 100% { transform: translateX(0); }
  20% { transform: translateX(-4px); }
  40% { transform: translateX(4px); }
  60% { transform: translateX(-2px); }
  80% { transform: translateX(2px); }
}
```

**状态转换规则**：

| 从 | 到 | 触发条件 | 视觉表现 |
|----|----|---------|---------|
| Idle | Parsing | 用户提交文本 | 边框变琥珀金 + 跑马灯流光 |
| Parsing | Field_Filling | AI 首个解析结果到达 | 字段逐一亮起琥珀金浅底 |
| Field_Filling | Field_Filling | 后续字段逐个完成 | 200ms/字段间隔 |
| Field_Filling / Parsing | Error | AI 返回异常 | 边框变档案红 + 抖动 |
| 任意 | Idle | 用户清空输入框 | 恢复初始态 |

### 4.5 AI Interview Chat

```css
/* 采访对话面板 */
.interview-chat {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--color-bg);
}

/* 对话顶部常驻栏 */
.interview-chat__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid var(--color-border-light);
  background: var(--color-surface);
  position: sticky;
  top: 0;
  z-index: var(--z-sticky);
}
.interview-chat__progress {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}
.interview-chat__exit-btn {
  /* 档案红描边按钮 */
  font-size: 13px;
  font-weight: 600;
}

/* 对话气泡列表 */
.interview-chat__messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

/* AI 提问气泡 */
.msg-bubble--ai {
  max-width: 80%;
  padding: 12px 16px;
  background: var(--color-surface);          /* #FFFFFF */
  border: 1px solid var(--color-border-light);
  border-radius: 6px 6px 6px 2px;           /* 左下角微收 */
  margin-right: auto;
  margin-bottom: 12px;
}
.msg-bubble--ai .msg-category-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
  flex-shrink: 0;
}
.msg-category-dot--self_intro  { background: #9B4D4D; } /* 档案红 */
.msg-category-dot--background  { background: #B8A9C9; } /* 藕紫 */
.msg-category-dot--offer       { background: #A8BF9A; } /* 鼠尾草绿 */
.msg-category-dot--need        { background: #C9A882; } /* 尘土橘 */

/* 用户回答气泡 */
.msg-bubble--user {
  max-width: 75%;
  padding: 10px 14px;
  background: var(--color-primary-surface);  /* #F5EAEA 档案红淡底 */
  border-radius: 6px 6px 2px 6px;           /* 右下角微收 */
  margin-left: auto;
  margin-bottom: 12px;
  color: var(--color-text-primary);
  font-size: 14px;
  line-height: 1.55;
}

/* AI 打字指示器（SSE 流式输出中）*/
.msg-typing-indicator {
  display: flex;
  gap: 4px;
  padding: 12px 16px;
  margin-bottom: 12px;
}
.msg-typing-indicator span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-accent);           /* 琥珀金，替代传统灰色 */
  animation: typingDot 1.4s ease-in-out infinite;
}
.msg-typing-indicator span:nth-child(2) { animation-delay: 0.2s; }
.msg-typing-indicator span:nth-child(3) { animation-delay: 0.4s; }
@keyframes typingDot {
  0%, 60%, 100% { opacity: 0.3; transform: scale(0.8); }
  30% { opacity: 1; transform: scale(1); }
}

/* 对话输入区 */
.interview-chat__input-area {
  display: flex;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid var(--color-border-light);
  background: var(--color-surface);
}
.interview-chat__input {
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 10px 14px;
  font-size: 14px;
  font-family: var(--font-sans);
  background: var(--color-bg);
  resize: none;
}
.interview-chat__input:focus {
  outline: none;
  border-color: var(--color-brand-dark);
}
.interview-chat__send-btn {
  flex-shrink: 0;
  padding: 8px 16px;
  background: var(--color-primary);
  color: #FFFAF5;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}
.interview-chat__send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
```

### 4.6 Tags（标签云）

```css
/* 基础标签 */
.tag {
  display: inline-flex;
  align-items: center;
  border-radius: 3px;
  padding: 3px 8px;
  font-size: 12px;
  font-weight: 600;
  font-family: var(--font-sans);
  letter-spacing: 0.01em;
  transition: all 0.2s ease;
}

/* 4 色莫兰迪标签 */
.tag--belong { background: #B8A9C9; color: #4A3F5C; }  /* 藕紫 */
.tag--offer  { background: #A8BF9A; color: #3D5A2F; }  /* 鼠尾草绿 */
.tag--need   { background: #C9A882; color: #6B5234; }  /* 尘土橘 */
.tag--follow { background: #9BB5C4; color: #3A5A6B; }  /* 雾蓝 */

/* AI 增量标签 — 琥珀金虚线框 */
.tag--delta {
  background: var(--color-accent-bg);        /* rgba(196,154,108,0.15) */
  border: 1px dashed var(--color-accent);    /* #C49A6C */
  color: var(--color-text-primary);
  position: relative;
  padding-right: 24px;                       /* 给 [×] 留空间 */
}
.tag--delta .tag-delta-close {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: var(--color-accent);
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.15s ease;
}
.tag--delta .tag-delta-close:hover {
  background: var(--color-error);
  color: #FFFAF5;
}

/* search_only 标签 — 虚线圈 + 仅创建者可见 */
.tag--search-only {
  border: 1px dashed var(--color-accent);
  background: transparent;
  opacity: 0.7;
}
.tag--search-only::after {
  content: '🔒';
  font-size: 8px;
  margin-left: 3px;
}

/* 用户已确认标签 — 微弱视觉区分 */
.tag--user-edited {
  border: 1px solid rgba(44, 62, 80, 0.15);
}
```

### 4.7 Modals / Drawers

```css
/* 遮罩层 */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: var(--overlay-color);          /* rgba(26,26,46,0.45) */
  z-index: var(--z-modal);
  animation: overlayFadeIn 0.2s ease-out;
}
@keyframes overlayFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 中心弹窗 */
.modal-content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--color-surface);
  border-radius: 8px;
  padding: 24px;
  min-width: 320px;
  max-width: 480px;
  z-index: calc(var(--z-modal) + 1);
  box-shadow: var(--shadow-lg);
  animation: modalIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes modalIn {
  from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
  to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
}
.modal-content__title {
  font-size: 17px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 12px;
}
.modal-content__body {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}
.modal-content__actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

/* 删除确认抽屉 — 仅用于分栏页面（AI 采访页左侧面板、AI Lab 后台左侧面板）*/
/* 单栏页面（个人主页 /profile/[id]）删除确认使用中心弹窗 .modal-content */
.drawer-delete {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-surface);
  border-radius: 8px 8px 0 0;
  padding: 20px 16px;
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
  animation: slideUpDamped 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
@keyframes slideUpDamped {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.drawer-delete__overlay {
  position: absolute;
  inset: 0;
  background: rgba(26, 26, 46, 0.45);
  z-index: calc(var(--z-dropdown) - 1);
}

/* 删除确认弹窗 — 单栏页面（个人主页）专用 */
/* 复用 .modal-content 组件，标题改为「确认删除」，正文为删除确认文案，
   操作按钮区包含「确认删除」（.btn-danger）+「取消」（.btn-secondary）*/
.modal-content--delete {
  max-width: 400px;
}
.modal-content--delete .modal-content__actions .btn-danger {
  min-width: 100px;
}

/* 可见性选择抽屉 */
.drawer-visibility {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--color-surface);
  border-radius: 8px 8px 0 0;
  padding: 20px 16px;
  z-index: var(--z-modal);
  animation: slideUpDamped 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.drawer-visibility__option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 0;
  cursor: pointer;
  border-bottom: 1px solid var(--color-border-light);
  transition: background 0.15s ease;
}
.drawer-visibility__option:hover {
  background: var(--color-elevated);
}
.drawer-visibility__option:last-child {
  border-bottom: none;
}
```

### 4.8 Toast & Feedback

```css
/* Toast 通知 */
.toast {
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  padding: 10px 20px;
  background: var(--color-text-primary);     /* #2C3E50 */
  color: #FFFAF5;
  font-size: 13px;
  font-weight: 500;
  font-family: var(--font-sans);
  border-radius: 6px;
  z-index: var(--z-toast);
  box-shadow: var(--shadow-md);
  animation: toastIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}
@keyframes toastIn {
  from { opacity: 0; transform: translateX(-50%) translateY(-8px); }
  to { opacity: 1; transform: translateX(-50%) translateY(0); }
}
.toast--success {
  background: var(--color-text-primary);
}
.toast--warning {
  background: #6B5234;                       /* 尘土橘深色 */
}

/* AI 处理进度提示 */
.ai-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  font-size: 12px;
  color: var(--color-accent);                /* 琥珀金文字 */
  background: var(--color-accent-surface);   /* #FDF6EC */
  border-radius: 4px;
  margin: 8px 0;
}
```

### 4.9 Skeleton / Loading

```css
/* 骨架屏基类 */
.skeleton {
  background: var(--color-border-light);     /* #F0ECE6 */
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}
.skeleton::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: skeletonShimmer 1.8s ease-in-out infinite;
}
@keyframes skeletonShimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

/* AI 解析骨架屏 — 琥珀金虚线边框 + 琥珀金 shimmer */
.skeleton--ai-field {
  height: 40px;
  background: var(--color-accent-surface);   /* #FDF6EC */
  border: 1px dashed var(--color-accent);
  border-radius: 4px;
  margin-bottom: 8px;
}
.skeleton--ai-field::after {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(196, 154, 108, 0.15) 50%,
    transparent 100%
  );
}

/* 图片骨架屏 */
.skeleton--image {
  width: 100%;
  aspect-ratio: 16 / 9;
  border-radius: 6px;
  background: var(--color-elevated);
}

.skeleton--text      { height: 14px; margin-bottom: 8px; }
.skeleton--text-short { width: 40%; }
.skeleton--text-medium { width: 70%; }
.skeleton--title     { height: 18px; width: 50%; margin-bottom: 12px; }
```

### 4.10 Mobile Redirect Page

```css
/* 移动端引导页 — 全屏居中单卡 */
.mobile-redirect {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--color-bg);              /* #FAFAF7 */
  padding: 24px;
}
.mobile-redirect__card {
  background: var(--color-surface);          /* #FFFFFF */
  border-radius: 6px;
  padding: 40px 32px;
  text-align: center;
  max-width: 360px;
  width: 100%;
  box-shadow: var(--shadow-sm);
}
.mobile-redirect__icon {
  width: 48px;
  height: 48px;
  color: var(--color-brand-dark);            /* #4A6670 */
  margin: 0 auto 16px;
  opacity: 0.6;
}
.mobile-redirect__title {
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}
.mobile-redirect__desc {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.6;
  margin-bottom: 20px;
}
.mobile-redirect__url {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--color-elevated);
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--color-text-primary);
  word-break: break-all;
  margin-bottom: 20px;
}
.mobile-redirect__footer {
  font-size: 13px;
  color: var(--color-text-placeholder);
  line-height: 1.5;
}
```

---

## 5. Layout Principles（布局原则）

### Spacing System

基数：**8px**（桌面端适配），倍数系统如下：

| Token | 值(px) | CSS 变量 | 使用场景 |
|-------|--------|---------|---------|
| xs | 4 | `--space-xs` | 图标与文字间距、标签内间距 |
| sm | 8 | `--space-sm` | 紧凑元素间距、按钮组间距 |
| md | 12 | `--space-md` | 标准元素间距、卡片间距 |
| lg | 16 | `--space-lg` | 组件内间距、卡片 padding |
| xl | 24 | `--space-xl` | 区块内间距、section header 间距 |
| 2xl | 32 | `--space-2xl` | 区块间距 |
| 3xl | 48 | `--space-3xl` | 大区块间距 |
| 4xl | 64 | `--space-4xl` | 页面级大留白 |

### Page Layout Structure

```
┌──────────────────────────────────────────────────────┐
│  Top Nav / Header                                    │  ← 固定顶部
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌─ container (max-width: 1200px, centered) ───────┐ │
│  │                                                    │ │
│  │  Page Content                                      │ │
│  │  ├── 居中单栏（个人主页、移动端引导页）             │  │
│  │  ├── 左右分栏（AI 采访页: 对话 60% | 预览 40%）   │  │
│  │  └── 左右分栏（AI Lab 后台: 沙盒 55% | 面板 45%） │  │
│  │                                                    │ │
│  └────────────────────────────────────────────────────┘ │
│                                                       │
└──────────────────────────────────────────────────────┘
```

### Container

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}
.container--narrow {
  max-width: 720px;                          /* 单栏页面（个人主页）*/
  margin: 0 auto;
  padding: 0 24px;
}
.container--wide {
  max-width: 1440px;                         /* AI Lab 后台 */
  margin: 0 auto;
  padding: 0 32px;
}
```

### Split Layouts

```css
/* 采访页左右分栏 */
.layout-split--interview {
  display: flex;
  gap: 0;
  height: calc(100vh - 60px);               /* 减去顶部导航高度 */
}
.layout-split--interview .split-left {
  width: 60%;
  min-width: 400px;
  border-right: 1px solid var(--color-border-light);
  display: flex;
  flex-direction: column;
}
.layout-split--interview .split-right {
  flex: 1;
  min-width: 320px;
  overflow-y: auto;
  padding: 24px;
  background: var(--color-bg);
}

/* AI Lab 后台左右分栏 */
.layout-split--admin {
  display: flex;
  gap: 0;
  height: calc(100vh - 60px);
}
.layout-split--admin .split-left {
  width: 55%;
  min-width: 480px;
  border-right: 1px solid var(--color-border-light);
  overflow: hidden;                          /* 沙盒组件内部自行管理滚动 */
  display: flex;
  flex-direction: column;
}
.layout-split--admin .split-right {
  flex: 1;
  min-width: 360px;
  overflow-y: auto;
  padding: 24px;
  background: var(--color-bg);
}
```

### Section Spacing

```css
.section { margin-bottom: var(--space-2xl); }        /* 32px */
.section--compact { margin-bottom: var(--space-lg); } /* 16px */
.section--hero { margin-bottom: var(--space-3xl); }   /* 48px */
```

**留白哲学**：
- 留白本身即是设计语言，不依赖分割线区分内容
- 卡片间距 ≥ 12px，区块间距 ≥ 32px
- 首屏标题顶部留白 ≥ 48px
- 内容块列表之间间距 12px
- AI 增量段落与已确认文字之间间距 8px

### Sticky Submit Bar（自动撑高输入框页面的粘性操作区）

对于包含 `.input-intent` 自动撑高输入框的页面（快速创建页 `/create/quick`），底部核心操作按钮区必须采用粘性定位吸附在屏幕底部，确保无论输入框撑多高，用户始终能看到操作按钮：

```css
/* 快速创建页底部操作栏 — sticky 吸底 */
.quick-create__submit-bar {
  position: sticky;
  bottom: 0;
  background: var(--color-bg);               /* #FAFAF7 */
  padding: 16px 24px;
  border-top: 1px solid var(--color-border-light);
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  z-index: var(--z-sticky);                  /* 10 */
}
.quick-create__submit-bar::before {
  content: '';
  position: absolute;
  top: -32px;
  left: 0;
  right: 0;
  height: 32px;
  background: linear-gradient(to top, var(--color-bg), transparent);
  pointer-events: none;
}
```

> **设计理由**：输入框禁止内部滚动 + 自动撑高的组合意味着输入框可以变得极长。如果用户粘贴 3000 字长文，底部按钮会被推到视口之外。sticky 吸底 + 渐隐遮罩确保操作入口始终在视野内。

### Profile Page Layout

```
┌─ container--narrow ──────────────────────────────────┐
│                                                        │
│  ┌─ Profile Header Card ───────────────────────────┐  │
│  │  AI 生成图片 (16:9, rounded 6px)                 │  │
│  │  姓名（衬线体 24px）                              │  │
│  │  班级                                              │  │
│  └────────────────────────────────────────────────────┘  │
│                                                        │
│  ┌─ 简介区域 ───────────────────────────────────────┐  │
│  │  用户已确认简介文字                                │  │
│  │  ┌─ AI 增量段落 (琥珀金高亮) ───────────────┐    │  │
│  │  │  ... 增量文字 ...          [保留] [抹除]   │    │  │
│  │  └──────────────────────────────────────────┘    │  │
│  └────────────────────────────────────────────────────┘  │
│                                                        │
│  ┌─ 标签云 ─────────────────────────────────────────┐  │
│  │  [标签] [标签] [增量标签] [search_only标签]      │  │
│  └────────────────────────────────────────────────────┘  │
│                                                        │
│  ┌─ 内容块列表 ─────────────────────────────────────┐  │
│  │  ┌─ 自我介绍 ─────────────────────────────┐     │  │
│  │  │  内容文字...                  [编辑] [删除] │     │  │
│  │  └──────────────────────────────────────────┘     │  │
│  │  ┌─ 历史背景 ─────────────────────────────┐     │  │
│  │  │  内容文字...                              │     │  │
│  │  └──────────────────────────────────────────┘     │  │
│  └────────────────────────────────────────────────────┘  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 6. Depth & Elevation（深度与层级）

### Shadow System

```css
--shadow-xs: 0 1px 2px rgba(44, 62, 80, 0.04);
--shadow-sm: 0 1px 3px rgba(44, 62, 80, 0.06);
--shadow-md: 0 2px 6px rgba(44, 62, 80, 0.06), 0 4px 12px rgba(44, 62, 80, 0.04);
--shadow-lg: 0 4px 12px rgba(44, 62, 80, 0.08), 0 8px 24px rgba(44, 62, 80, 0.06);
--shadow-xl: 0 8px 20px rgba(44, 62, 80, 0.1), 0 16px 40px rgba(44, 62, 80, 0.08);
```

### Surface Layers

| 层级 | 背景 | CSS 变量 | 使用场景 |
|------|------|---------|---------|
| Background | `#FAFAF7` | `--color-bg` | 页面底色 |
| Surface | `#FFFFFF` | `--color-surface` | 卡片、弹窗、输入框 |
| Elevated | `#F7F5F0` | `--color-elevated` | 二级浮层、抽屉内背景 |
| Overlay | `rgba(26, 26, 46, 0.45)` | `--overlay-color` | 遮罩层 |

### Z-index Scale

| Token | 值 | 使用场景 |
|-------|-----|---------|
| `--z-base` | 0 | 正常内容流 |
| `--z-sticky` | 10 | 吸顶导航、采访页顶部栏 |
| `--z-card-hover` | 20 | 卡片悬浮 |
| `--z-dropdown` | 100 | 删除确认抽屉、可见性选择抽屉 |
| `--z-modal` | 200 | 弹窗/对话框 |
| `--z-toast` | 300 | 全局 Toast 提示 |

---

## 7. Do's and Don'ts（设计规范与禁忌）

### Do's

1. **用大留白建立呼吸感** — 卡片间距 ≥ 12px，区块间距 ≥ 32px
2. **用字重和字号建立信息层级** — 400 vs 600，24px vs 14px，而非依赖颜色或边框
3. **色彩带灰度** — 所有色彩必须经过莫兰迪式灰度调和，呈现「包浆感」
4. **衬线标题 + 无衬线正文** — 大标题用宋体拉升人文底蕴，正文用黑体保证阅读效率
5. **物理阻尼动画** — 弹窗、抽屉用 cubic-bezier(0.34, 1.56, 0.64, 1)
6. **AI 交互用琥珀金** — Parsing 态、增量内容高亮、AI 标识统一使用琥珀金色系
7. **增量内容高辨识度** — AI 新内容以琥珀金浅底高亮 + 虚线边框呈现，与用户已确认内容形成清晰视觉边界
8. **「用户是 Boss」原则可视化** — `user_edited` 内容有微弱保护标记，增量内容可一键抹除无需二次确认
9. **WCAG AA 对比度** — 正文 ≥ 4.5:1，标签 ≥ 3:1，占位文本 ≥ 3:1
10. **空状态有灵魂** — 用衬线体占位文案 + 琥珀金装饰线替代「暂无数据」
11. **桌面端优先** — POC 所有布局以 ≥ 1024px 宽度为基准设计，输入框、按钮、热区尺寸适配桌面鼠标操作

### Don'ts

1. **禁止高饱和度原色** — 大红 #FF0000、纯蓝 #0000FF、翠绿 #00FF00 绝对禁止
2. **禁止活泼渐变和卡通插画** — AI 生成的图片也必须是抽象意境风格，禁止写实人脸
3. **禁止大圆角** — 圆角不超过 8px（卡片 6px，按钮 4px，标签 3px）
4. **禁止生硬弹窗出现/消失** — 所有过渡必须带物理阻尼感
5. **禁止 AI 覆盖用户内容** — AI 只做增量，不做覆盖；增量内容高亮展示，用户可一键抹除
6. **禁止通用互联网文案** — 不使用「提交」「保存成功」，用「已记录」「内容已同步更新」
7. **禁止移动端响应式布局** — POC 不做移动端适配，移动端访问时重定向至引导页
8. **禁止暗色模式** — POC 阶段不做暗色模式
9. **禁止输入框内部滚动** — 大文本输入框自动撑高，`overflow: hidden` + `resize: none`
10. **禁止弹窗确认增量抹除** — 用户对 AI 增量内容点击 `[抹除]` / `[×]` 即瞬间生效，无需二次确认

---

## 8. Responsive Behavior（响应式行为）

### 设备策略

POC **仅支持桌面端**（≥ 1024px 宽度），移动端/平板访问自动重定向至 `/mobile` 引导页。

### Breakpoints

| 断点名称 | 宽度范围 | 支持策略 |
|---------|---------|---------|
| Desktop S | 1024px - 1279px | 标准布局 |
| Desktop M | 1280px - 1599px | 标准布局，容器可更宽 |
| Desktop L | 1600px+ | 大屏优化，更多留白 |
| Tablet / Mobile | < 1024px | 重定向至 `/mobile` 引导页 |

### 桌面端响应式规则

| 断点 | layout-split 行为 | container 宽度 |
|------|------------------|---------------|
| Desktop S (1024-1279px) | split-left min-width 360px; split-right min-width 280px | 100% - 48px padding |
| Desktop M (1280-1599px) | 标准分栏比例 | max-width 1200px |
| Desktop L (1600px+) | 增加左右留白 | max-width 1440px |

### Touch / Click Targets

- **按钮最小尺寸**：高度 ≥ 36px，宽度 ≥ 80px（桌面端鼠标操作）
- **增量操作按钮** `[保留]` `[抹除]`：高度 24px，适配桌面端精确点击
- **标签点选热区**：≥ 24px × 24px

### Font Scaling

- 桌面端使用 rem 单位，基础字号 16px
- 支持用户浏览器字号缩放，但限制最大缩放比 1.5x，避免布局崩塌

---

## 9. Agent Prompt Guide（AI 代理提示指南）

### Quick Reference

```
产品：同学录 AI 自我介绍 POC（二代产品核心能力验证）
平台：桌面端 Web（Next.js 14 + Tailwind CSS + shadcn/ui）
设计继承：实验中学 2006 届校友「基地」设计系统 v1.0
风格：克制怀旧、莫兰迪色系、高级校刊排版、数字纪念册
字体：衬线标题(Noto Serif SC) + 无衬线正文(PingFang SC)
主色：档案红 #9B4D4D / 旧黑板青 #4A6670
AI 交互色：琥珀金 #C49A6C / 琥珀金浅底 rgba(196,154,108,0.15)
背景：纸张白 #FAFAF7
圆角：4-6px（卡片6px，按钮4px，标签3px）
间距：8px 基数，大留白
阴影：极微弱 rgba(44,62,80,0.06)
动画：物理阻尼 cubic-bezier(0.34,1.56,0.64,1)
AI 增量高亮：琥珀金浅底 + 虚线边框 + [保留][抹除] 按钮
AI 意图舱：4 态状态机（Idle / Parsing / Field_Filling / Error）
输入框行为：自动撑高，禁止内部滚动（overflow:hidden）
删除确认：中心弹窗 Modal（单栏页面）；左侧栏底部抽屉（分栏页面，如 AI 采访页、AI Lab 后台）
绝对禁止：高饱和原色、渐变、卡通、大圆角、暗色模式、移动端布局、AI 覆盖用户内容
POC 特例：仅桌面端≥1024px，无移动端适配，无暗色模式，无注册登录
```

### Component Prompts

**1. 快速创建页（/create/quick）**
```
创建桌面端快速创建个人主页页面。页面结构：上方大面积 AI 意图输入舱 + 下方实时预览区。
输入舱：多行文本，min-height 120px，自动撑高(overflow:hidden, resize:none)，边框 #E8E4DE，聚焦变琥珀金 #C49A6C。
Placeholder：「试试用键盘语音输入，口述你的自我介绍」，使用占位灰 #7F8C8D。
输入舱旁显示语音输入引导图标（非录音按钮），点击弹出 tooltip 说明系统键盘语音输入。
AI 意图舱支持 4 种视觉状态：
- Idle: Placeholder 呼吸闪烁(3s cycle)
- Parsing: 边框琥珀金跑马灯流光(1.5s loop)，背景扫过 rgba(196,154,108,0.06)
- Field_Filling: 预览区字段逐个亮起琥珀金浅底 #FDF6EC(0.5s 淡出)
- Error: 边框 #B85C5C + 左右抖动(0.4s)
底部操作栏 sticky 吸底（position:sticky; bottom:0），含渐隐遮罩 + 「生成主页」按钮；无论输入框撑多高，按钮始终可见。
下方预览区：标签云（4色莫兰迪）+ 内容块列表 + 简介文字。标签云和简介在 AI 解析中显示骨架屏（琥珀金虚线边框 + shimmer）。
```

**2. AI 采访页（/create/interview）**
```
创建桌面端 AI 采访页面，左右分栏布局(60%/40%)。
左侧对话面板：
- 顶部常驻栏：「结束采访，生成我的主页」按钮(档案红描边) + 维度覆盖进度(如「已覆盖 2/4」
- 对话列表：AI 提问气泡(白底 + 分类色标圆点，左下角微收) + 用户回答气泡(档案红淡底 #F5EAEA，右下角微收)
- AI 打字指示器：3个琥珀金圆点跳动动画
- 底部输入区：文本输入框 + 发送按钮(档案红)
右侧实时预览：
- 标签云(实时新增标签以缩放动画入场)
- 内容块列表(按分类带左侧色条)
- 简介文字(打字机效果逐字更新)
SSE 流式输出，连接中断显示「重新连接…」提示(最多重试3次，间隔2s)。
```

**3. 个人主页页（/profile/[id]）**
```
创建桌面端个人主页页面，居中单栏(max-width:720px)。
顶部：AI 生成图片(16:9，圆角6px) + 姓名(衬线体24px) + 班级。图片底部半透明提示条「内容已更新，图片可能需要刷新」+ 琥珀金「更新图片」按钮。
简介区：用户已确认文字正常展示。AI 增量段落以琥珀金浅底 rgba(196,154,108,0.15) 高亮，右侧 [保留] [抹除] 按钮。[保留]融入正文，[抹除]瞬间消失无二次确认。
标签云：4色莫兰迪标签平铺。AI 增量标签以琥珀金虚线框展示 + [×]按钮。search_only 标签以虚线框半透明展示（仅创建者可见）。
内容块列表：每块左侧3px分类色条，右上角琥珀金角标(AI生成标识)，底部可见性标识。删除操作触发中心弹窗确认（Modal，复用 .modal-content，含「确认删除」档案红按钮 + 「取消」描边按钮）。
右下角浮动「新增内容块」按钮(档案红)。
空状态：衬线体占位文案「你的故事，将由 AI 与你一起书写」(#7F8C8D) + 琥珀金装饰线 + 4色虚线占位标签 + 虚线占位卡片「点击下方按钮，开始添加你的第一个内容块」。
```

**4. 创建方式选择页（/create）**
```
创建桌面端创建方式选择页。居中两列大卡片(max-width: 640px each)。
左卡「快速创建」：图标 + 标题 + 描述「口述或键入自我介绍，AI 一键生成主页」。
右卡「AI 采访模式」：图标 + 标题 + 描述「跟 AI 聊天，逐步完善你的主页」。
底部文字「两种方式都能创建你的个人主页」(#7F8C8D 占位灰)。
卡片 hover 态：阴影加深 + 微上浮(translateY(-2px))。
```

**5. AI Lab 后台（/admin）**
```
创建桌面端 AI Lab 后台页面，左右分栏(55%/45%)。
左侧：三场景沙盒控制台(可交互)。
  - 顶部场景标签页：「快速录入」「采访式」「增量更新」(档案红 active 态)
  - 快速录入沙盒：文本输入区(自动撑高) + AI 提取按钮 + 结果审核区
  - 采访式沙盒：聊天消息列表 + 维度进度条 + 输入框 + 实时预览
  - 增量更新沙盒：档案选择下拉 + 当前档案卡片 + 增量输入 + delta 审核
右侧参数面板(可滚动)：
  - 模板管理：下拉选择 + 保存/删除/导出/导入按钮组
  - Prompt 编辑器 ×4（标签提取/简介生成/图片生成/采访引导），monospace 字体 textarea
  - 图片生成 Prompt 编辑器中风格约束前缀只读展示(灰色背景不可编辑)
  - 模型选择器(下拉菜单) + Temperature 滑块(0-1)
  - 采访收敛条件配置（目标维度数 + 最大追问轮数）
  - 最近 10 条 AI 处理日志(含修改类型分类 + 增量抹除率统计)
```

**6. 移动端引导页（/mobile）**
```
创建移动端引导页。全屏居中单卡(纯白底 #FFFFFF + 微阴影)。
顶部：桌面电脑图标(旧黑板青 #4A6670，线描风格 SVG)。
标题：「请使用电脑访问」(衬线体 20px)。
说明：「这是一个桌面端应用，请在电脑浏览器中打开以下地址」。
URL 展示：等宽字体显示当前网址 + 「复制链接」按钮(档案红描边)。
底部温馨文案：「大屏幕体验更好，AI 和你都需要舒适的空间」(#7F8C8D)。
背景：纸张白 #FAFAF7 + 极淡几何纹理。
通过 navigator.userAgent 或 window.innerWidth < 1024 检测，自动重定向。
```

**7. 增量内容操作组件**
```
创建 AI 增量内容操作组件。增量段落以琥珀金浅底 rgba(196,154,108,0.15) 高亮 + 虚线边框。
段落右侧 [保留] 按钮(琥珀金描边，hover变档案红) 和 [抹除] 按钮(灰色描边，hover变错误红)。
增量标签以琥珀金虚线框 + 右上角 [×] 按钮展示。
[×] 按钮 hover 变错误红背景 + 白色 ×。
所有操作瞬间生效，无二次确认弹窗。
```

### Iteration Guide

1. **色彩一致性检查**：所有新增色值必须通过灰度测试——在黑白模式下应呈现清晰的明度层级
2. **AI 琥珀金使用边界**：琥珀金仅用于 AI 交互状态（Parsing、增量高亮、AI 标识），不得用于常规 UI 元素
3. **增量内容视觉边界**：AI 增量的琥珀金高亮与用户已确认内容的正常展示必须有清晰视觉区分，两者间距 ≥ 8px
4. **动画阻尼微调**：cubic-bezier(0.34,1.56,0.64,1) 是起点，弹窗用更强弹性，标签切换用更弱弹性
5. **输入框撑高测试**：大文本输入框在不同内容量下（空/1行/5行/20行/长文粘贴）验证自动撑高 + overflow:hidden 行为正确，同时验证 sticky 吸底按钮在极端长文下始终可见且渐隐遮罩自然过渡
6. **左右分栏最小宽度**：采访页 split-left ≥ 400px、split-right ≥ 320px；低于阈值自动切换为上下布局或提示窗口太小
7. **WCAG 对比度自检**：每新增文字+背景组合必须验证：正文 ≥ 4.5:1，标签 ≥ 3:1
8. **桌面端操作体验**：所有可交互元素需要有明确的 hover 态反馈；按钮最小点击区域 36×36px
9. **Toast 文案一致性**：不用「保存成功」「提交成功」，用「已记录」「内容已同步更新」「AI 已补充新内容，请查看」
10. **空状态覆盖**：个人主页、标签云、内容块列表、AI 生成图片四个区域均有空状态定义，不允许出现空白区域
11. **[保留][抹除] 按钮可发现性**：增量内容的高亮 + 操作按钮需足够醒目，首次用户应在 3 秒内理解操作方式
12. **删除确认弹窗/抽屉选择**：单栏居中页面（个人主页）删除确认必须使用中心弹窗 `.modal-content`；左侧栏底部抽屉 `.drawer-delete` 仅用于确实存在左侧面板的分栏页面（AI 采访页左侧、AI Lab 后台左侧）
