# 同学录 · AI 自我介绍 POC — 界面设计方案（Design Handoff）

> **版本**：v1.1 | 2026-06-08
> **文档类型**：UI 设计交付文档 — 面向开发者的像素级设计规格
> **设计继承**：DESIGN.md v1.3 + DESIGN-第一代产品参考设计.md v1.0
> **原型文件**：`mockups/*.html`

---

## 设计系统速查卡片

```
产品：同学录 AI 自我介绍 POC
平台：桌面端 Web（Next.js 14 + Tailwind CSS + shadcn/ui）
风格：克制怀旧、莫兰迪色系、高级校刊排版、数字纪念册
字体：衬线标题(Noto Serif SC) + 无衬线正文(PingFang SC)
主色：档案红 #9B4D4D / 旧黑板青 #4A6670
AI色：琥珀金 #C49A6C / 琥珀金浅底 rgba(196,154,108,0.15)
背景：纸张白 #FAFAF7
圆角：卡片6px / 按钮4px / 标签3px
间距：8px基数，大留白
阴影：极微弱 rgba(44,62,80,0.06)
动画：物理阻尼 cubic-bezier(0.34,1.56,0.64,1)
```

---

## 页面清单与原型对应

| # | 页面 | 路由 | 布局 | 原型文件 | 状态 |
|---|------|------|------|---------|------|
| 0 | 首页 | `/` | 居中单栏(720px) | `landing.html` | ✅ 已设计 |
| 1 | 创建方式选择 | `/create` | 居中双卡+顶部导航 | `create-method.html` | ✅ 已设计 |
| 2 | 快速创建 | `/create/quick` | 上输入+下预览+Review+Published | `quick-create.html` | ✅ 已设计 |
| 3 | AI 采访 | `/create/interview` | 左右分栏(60/40)+Summary | `interview.html` | ✅ 已设计 |
| 4 | 个人主页 | `/profile/[id]` | 居中单栏(720px)+状态提示 | `profile-page.html` | ✅ 已设计 |
| 5 | AI Lab 后台 | `/admin` | 左右分栏(55/45) | `admin.html` | ✅ 已设计 |
| 6 | 移动端引导 | `/mobile` | 全屏居中单卡 | (待开发) | 📋 规范已定义 |
| 7 | 创建审核+发布庆祝 | (内嵌于创建流程) | 原位替换 | `creation-review.html` | ✅ 已设计 |

---

## 页面一：创建方式选择页（/create）

### 设计要点

- **居中布局**：两张等大卡片水平排列，max-width 640px each
- **卡片交互**：hover 态阴影加深（shadow-sm → shadow-lg）+ translateY(-2px) + border-color → 琥珀金
- **视觉层级**：品牌名 → 标题(衬线24px) → 描述文案 → 双卡 → 底部说明(占位灰)

### 关键色值

| 元素 | 色值 | 说明 |
|------|------|------|
| 卡片背景 | `#FFFFFF` | 纯白底 |
| 卡片边框 | `#E8E4DE` | 分割线色 |
| Hover 边框 | `#C49A6C` | 琥珀金呼应 AI 气质 |
| 快速创建图标底 | `#F5EAEA` | 档案红浅底 |
| AI采访图标底 | `rgba(196,154,108,0.12)` | 琥珀金浅底 |
| 底部说明文 | `#7F8C8D` | 占位灰 |

### 排版

| 元素 | 字体 | 字号 | 字重 |
|------|------|------|------|
| 品牌名 | Serif | 20px | 600 |
| 页面标题 | Serif | 24px | 600 |
| 副标题 | Sans | 16px | 400 |
| 卡片标题 | Sans | 20px | 600 |
| 卡片描述 | Sans | 14px | 400 |
| 底部说明 | Sans | 14px | 400 |

---

## 页面二：快速创建页（/create/quick）

### 设计要点

- **核心交互**：上输入区（自动撑高 textarea）+ 下预览区
- **输入框行为**：`overflow: hidden` + `resize: none` + `height: auto` 随内容撑高
- **AI 意图舱 4 态状态机**：Idle → Parsing → Field_Filling → Error
- **sticky 底栏**：position:sticky; bottom:0; 含渐隐遮罩

### AI 意图舱 4 态详情

```
┌─────────────────────────────────────────────────┐
│ State 1: Idle                                    │
│ border: #E8E4DE                                  │
│ placeholder 呼吸闪烁(3s)                          │
│ cursor: text                                     │
├─────────────────────────────────────────────────┤
│ State 2: Parsing (AI 解析中)                      │
│ border: #C49A6C (琥珀金)                          │
│ bg: 琥珀金扫光跑马灯(1.5s)                        │
│ pointer-events: none (禁止输入)                    │
├─────────────────────────────────────────────────┤
│ State 3: Field_Filling (字段逐个填充)              │
│ 预览区字段逐个亮起琥珀金浅底 #FDF6EC               │
│ 0.5s 淡出回透明                                   │
│ 字段内容打字机效果(0.2s/字)                        │
├─────────────────────────────────────────────────┤
│ State 4: Error (异常)                             │
│ border: #B85C5C (错误红)                          │
│ 左右抖动 0.4s (fieldShake)                        │
│ placeholder 变错误红                               │
└─────────────────────────────────────────────────┘
```

### 预览区骨架屏

AI 解析中时，预览区显示琥珀金虚线边框骨架屏：
- 标签：`skeleton--ai-field`，琥珀金虚线框 + 琥珀金 shimmer
- 内容块：`skeleton--ai-field`，56px 高度
- 简介：标准 `skeleton--text`，90%/80%/70% 渐短

**重要行为**：当 `simulateParsing()` 被调用（AI 开始分析），页面必须自动 `scrollIntoView({ behavior: 'smooth', block: 'start' })` 到 `.preview-area`，确保长文本输入将预览区挤出视口后，用户仍能第一眼看到骨架屏生成进度。

### sticky 底栏

```css
.quick-create__submit-bar {
  position: sticky; bottom: 0;
  background: #FAFAF7;
  padding: 16px 24px;
  border-top: 1px solid #F0ECE6;
}
.quick-create__submit-bar::before {
  /* 32px 渐变遮罩，从透明到纸张白 */
  content: ''; position: absolute; top: -32px; left: 0; right: 0;
  height: 32px;
  background: linear-gradient(to top, #FAFAF7, transparent);
}
```

---

## 页面三：AI 采访页（/create/interview）

### 设计要点

- **左右分栏**：左 60%（对话面板）/ 右 40%（实时预览）
- **对话顶部常驻栏**：sticky，含退出按钮 + 维度进度
- **气泡区分**：AI 白底+分类色标圆点(左下角微收) / 用户档案红淡底(右下角微收)
- **SSE 打字指示器**：3 个琥珀金圆点跳动

### 对话气泡规格

| 气泡类型 | 背景 | 边框 | 圆角 | 最大宽度 | 对齐 |
|---------|------|------|------|---------|------|
| AI 提问 | `#FFFFFF` | `1px solid #F0ECE6` | 6px 6px 6px 2px | 80% | 左 |
| 用户回答 | `#F5EAEA` | 无 | 6px 6px 2px 6px | 75% | 右 |

### AI 提问分类色标

| 分类 | 色值 | 尺寸 |
|------|------|------|
| 自我介绍 | `#9B4D4D` (档案红) | 8px 圆点 |
| 历史背景 | `#B8A9C9` (藕紫) | 8px 圆点 |
| 能提供的 | `#A8BF9A` (鼠尾草绿) | 8px 圆点 |
| 具体需求 | `#C9A882` (尘土橘) | 8px 圆点 |

### 维度覆盖进度

```
已覆盖 2 / 4 维度
●●○○
```

进度点：20×3px，未完成 `#F0ECE6`，已完成 `#4A6670`，当前进行中 `#C49A6C`(加宽至28px)

---

## 页面四：个人主页（/profile/[id]）

### 设计要点

- **居中单栏**：max-width 720px，container--narrow
- **Hero 区**：AI 生成图片(16:9) + 姓名(衬线24px) + 班级
- **简介区**：用户确认文字 + AI 增量段落(琥珀金高亮)
- **标签云**：4 色莫兰迪 + AI 增量标签(琥珀金虚线框)
- **内容块**：左侧 3px 分类色条 + AI 角标 + 可点击的可见性徽章（唤起底部抽屉切换）
- **可见性抽屉**：底部升起抽屉 `.drawer-visibility`，含公开/仅搜索两个选项，物理阻尼动画，单选+确认
- **浮动按钮**：右下角「+ 新增内容块」，档案红
- **删除确认**：中心弹窗(Modal)，非左侧栏抽屉

### AI 增量内容交互（核心创新）

**增量段落**：
```
┌─ 琥珀金浅底 rgba(196,154,108,0.15) ─────────────┐
│ 虚线边框 1px dashed #C49A6C                       │
│                                                    │
│ 增量文字...                                        │
│                              [保留]  [抹除]         │
│                          琥珀金描边  灰色描边       │
│                          hover→档案红 hover→错误红  │
└────────────────────────────────────────────────────┘
```

**增量标签**：
```
┌── 琥珀金虚线框 ───┐
│ 标签文字      [×] │  ← 右上角关闭按钮
│                   │     hover: 错误红背景
└───────────────────┘
```

**交互规则**：
- `[保留]`：增量内容融入正文，高亮消失，来源标为 `user_edited`
- `[抹除]`：瞬间消失，无二次确认（用户是 Boss）
- `[×]` (标签)：标签收缩消失（max-width→0, padding→0），周围标签平滑聚拢
- 点击增量标签文字：变为正式标签，虚线框消失

### 简介区间距

- `.intro-text`（用户原文）与 `.intro-delta`（AI 增量段落）之间：`margin-bottom: 24px`
- 目的：为"确认领地"和"增量建议"之间建立明确的物理距离，增强呼吸感

### 内容块卡片规格

| 分类 | 左侧色条 | CSS 类 |
|------|---------|--------|
| 自我介绍 | `#9B4D4D` | `content-block--self_intro` |
| 历史背景 | `#B8A9C9` | `content-block--background` |
| 能提供的 | `#A8BF9A` | `content-block--offer` |
| 具体需求 | `#C9A882` | `content-block--need` |
| 自定义 | `#9BB5C4` | `content-block--custom` |

色条规格：`width: 3px; border-radius: 1.5px;`，位于 `left: 4px; top: 16px; bottom: 16px`

### 标签云颜色系统

| 类型 | 背景色 | 文字色 | CSS 类 | 示例 |
|------|--------|--------|--------|------|
| 属于 | `#B8A9C9` | `#4A3F5C` | `tag--belong` | 实验中学 2006 |
| 提供 | `#A8BF9A` | `#3D5A2F` | `tag--offer` | AI 创业 |
| 需要 | `#C9A882` | `#6B5234` | `tag--need` | 天使投资 |
| 关注 | `#9BB5C4` | `#3A5A6B` | `tag--follow` | 独立音乐 |
| AI增量 | `rgba(196,154,108,0.15)` | 正文色 | `tag--delta` | 虚线框 |
| 仅搜索 | 透明 | 正文色(opacity:0.7) | `tag--search-only` | 虚线框 |
| 用户确认 | 原色 | 原色 | `tag--user-edited` | 实线微边框 |

### 空状态定义

| 区域 | 空状态 UI |
|------|----------|
| 简介 | 衬线体占位文案「你的故事，将由 AI 与你一起书写」#7F8C8D + 琥珀金装饰线 |
| 标签云 | 4 色虚线占位标签（藕紫/鼠尾草绿/尘土橘/雾蓝） |
| 内容块 | 虚线卡片「点击下方按钮，开始添加你的第一个内容块」+ 档案红按钮 |
| 图片 | 莫兰迪色调几何纹理占位，16:9 |

### 可见性切换抽屉（`drawer-visibility`）

- **触发**：内容块头部可见性徽章（公开/仅搜索），`cursor: pointer`，hover 时 `filter: brightness(0.92)`
- **组件**：底部升起抽屉，`position: fixed; bottom: 0`，max-width 720px 居中
- **动画**：`drawerSlideUp` 使用物理阻尼 `cubic-bezier(0.34,1.56,0.64,1)`
- **选项**：两个单选项「公开」（所有校友可见）「仅搜索」（关键词匹配时出现），当前选中项高亮为档案红边框 + 填充圆点
- **操作**：取消按钮关闭抽屉，确认按钮保存并更新徽章文字与样式
- **遮罩**：`rgba(26,26,46,0.45)` + 0.2s 淡入，点击遮罩关闭抽屉

### 标签抹除动画（`rejectDeltaTag`）

- **当前行为**：`opacity: 0; transform: scale(0.8); max-width: 0; padding: 0; margin: 0;` + `overflow: hidden`，0.25s 后 `remove()`
- **目的**：使 Flex 布局中周围标签平滑聚拢，避免弹跳瞬移
- **确认**：无需二次确认，直接抹除 + Toast 通知

---

## 页面五：AI Lab 后台（/admin）

### 设计要点

- **左右分栏**：左 55%（三场景沙盒控制台）/ 右 45%（参数面板，可滚动）
- **左侧顶部**：场景标签页切换（「快速录入」「采访式」「增量更新」），档案红 active 态
- **快速录入沙盒**：
  - 文本输入区（自动撑高，2000字限制 + 字数统计）
  - 「AI 提取标签与内容」按钮（档案红 primary）
  - 结果审核区：标签（可删 ×）、简介（可编辑）、内容块（可删）、delta（保留/抹除）
  - 底部「确认发布（沙盒）」按钮
- **采访式沙盒**：
  - 聊天消息列表（用户右气泡 / AI 左气泡）
  - 维度进度条（4段，琥珀金填充）
  - 输入框（Enter 发送，Shift+Enter 换行）+ 发送/结束按钮
  - 实时提取预览（标签/简介/内容块）
  - 汇总面板（结束采访后显示）
- **增量更新沙盒**：
  - 档案选择下拉（5位测试同学 + 空档案）
  - 当前档案卡片（只读展示已有标签/简介/内容块）
  - 增量输入区
  - 「生成增量更新」按钮
  - delta_tags / delta_intro 审核区（确认 ✓ / 拒绝 ✕）
- **右侧包含**：
  - **模板管理**：下拉选择 + 保存/删除/导出/导入按钮组
  - Prompt 编辑器 × 4（monospace textarea）
  - 图片生成 Prompt 中风格约束前缀**只读展示**（灰色背景）
  - 模型选择器（dropdown）+ Temperature 滑块（0–1）
  - 采访收敛条件配置（目标维度数 + 最大追问轮数）
  - 最近 10 条 AI 日志（含修改类型分类 + 增量抹除率）

---

## 页面六：移动端引导页（/mobile）

### 设计要点

- **全屏居中单卡**：纯白底 + 微阴影
- **检测条件**：`window.innerWidth < 1024` 自动重定向
- **内容**：桌面电脑图标(旧黑板青) → 标题(衬体20px) → 说明 → URL(等宽字体+复制按钮) → 温馨文案

---

## 全局组件复用指南

### 按钮体系

| 按钮类型 | 背景 | 文字色 | 边框 | 用途 |
|---------|------|--------|------|------|
| `.btn-primary` | `#9B4D4D` | `#FFFAF5` | 无 | 主要操作 |
| `.btn-secondary` | 透明 | `#9B4D4D` | `1px solid #9B4D4D` | 次要操作 |
| `.btn-ghost` | 透明 | `#4A6670` | 无 | 文字操作 |
| `.btn-danger` | `#B85C5C` | `#FFFAF5` | 无 | 删除确认 |
| `.btn-delta--keep` | 透明 | `#C49A6C` | `1px solid #C49A6C` | AI 保留 |
| `.btn-delta--reject` | 透明 | `#546E7A` | `1px solid #E8E4DE` | AI 抹除 |

### 动画缓动函数

| 场景 | 缓动 | 时长 |
|------|------|------|
| 弹窗入场 | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 0.35s |
| 抽屉滑入 | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 0.35s |
| 标签入场 | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 0.3s |
| 遮罩淡入 | `ease-out` | 0.2s |
| Toast 入场 | `cubic-bezier(0.34, 1.56, 0.64, 1)` | 0.3s |
| 字段抖动 | `ease-out` | 0.4s |
| 骨架屏 shimmer | `ease-in-out` | 1.8s (循环) |
| 跑马灯流光 | `ease-in-out` | 1.5s (循环) |
| 打字点跳动 | `ease-in-out` | 1.4s (循环) |
| Placeholder 呼吸 | `ease-in-out` | 3s (循环) |
| 按钮 hover | `ease` | 0.2s |
| 卡片 hover | `ease` | 0.25s |

### Z-Index 层级

| Token | 值 | 使用场景 |
|-------|-----|---------|
| `--z-sticky` | 10 | 顶部导航、sticky 底栏 |
| `--z-dropdown` | 100 | 删除确认抽屉、可见性选择抽屉 |
| `--z-modal` | 200 | 中心弹窗 |
| `--z-toast` | 300 | 全局 Toast |

---

## 开发者实现检查清单

- [ ] 所有色彩使用 CSS 变量，不硬编码色值
- [ ] 按钮六种类型全部覆盖，hover/active 态正确
- [ ] 输入框 `overflow: hidden` + `resize: none` + `height: auto`
- [ ] AI 意图舱 4 态状态机完整实现
- [ ] 琥珀金仅用于AI交互状态，不用于常规 UI
- [ ] 增量内容琥珀金高亮 + 虚线边框
- [ ] `[保留]`/`[抹除]` 按钮瞬间生效，无二次确认
- [ ] 标签抹除动画：max-width/padding/margin → 0，周围标签平滑聚拢
- [ ] 删除确认使用中心弹窗（单栏页面）
- [ ] 可见性徽章可点击，唤起底部抽屉（`drawer-visibility`）
- [ ] 所有动画使用物理阻尼缓动
- [ ] WCAG AA 对比度：正文 ≥ 4.5:1，标签 ≥ 3:1
- [x] Toast 文案使用「已记录」「内容已同步更新」
- [x] 空状态四个区域全部有占位 UI
- [x] 桌面端专属：≥ 1024px，移动端重定向
- [x] sticky 底栏含渐隐遮罩
- [x] 快速创建页：点击「生成主页」后自动 `scrollIntoView` 到预览区

---

## 补充组件规格（v1.1 新增）

### Interview 草稿恢复 Banner

**触发**：页面 mount 时检测到 `localStorage.draft:interview` 存在且有效。

```
位置：采访面板顶部（维度进度条下方）
样式：mx-4 mb-2 px-3 py-2
      bg-accent-surface (#FDF6EC)
      border border-dashed border-accent (#C49A6C)
      rounded-md
      text-xs text-accent
      flex items-center justify-between
内容左：「你有未完成的采访，已自动恢复」
内容右：[从头开始] — text-xs font-semibold hover:underline
```

### SSE 断线提示条（重连中）

**触发**：SSE 连接中断，自动重试期间。

```
样式：mx-4 mb-2 px-3 py-2
      bg-accent-surface (#FDF6EC)
      border border-accent (#C49A6C)
      rounded-md
      text-xs text-accent
      flex items-center gap-2
内容：⟳ spinner + 「正在重新连接…」
```

### SSE 断线提示条（中断失败）

**触发**：3 次自动重试全部失败。

```
样式：mx-4 mb-2 px-3 py-2
      bg-error-surface
      border border-error
      rounded-md
      text-xs text-error
      flex items-center justify-between
内容左：「连接中断，无法继续对话」
内容右：[重试连接] + [保存并稍后继续] — text-xs font-semibold hover:underline
```

### Profile Draft 态提示条

**触发**：`profile.status === "draft"`。

```
样式：px-4 py-2.5
      bg-elevated (#F5F3EF)
      border border-border (#E8E4DE)
      rounded-md mb-6
      text-sm text-text-primary font-medium
      flex items-center justify-between
内容左：✎ + 「你的主页尚未发布，其他校友暂时看不到」
内容右：[继续创建 →] — text-[13px] font-semibold text-primary
```

> **设计哲学**：把「写个人主页」变成「跟 AI 聊天」。
> **用户是 Boss**：AI 只做增量，不做覆盖。
> **克制而体面**：每像素都为 38 岁校友的审美服务。
