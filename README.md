# Smart Chat Analyser前端

基于 React + TypeScript + Vite 构建的现代化Smart Chat Analyser前端应用。

## 🚀 功能特性

- **现代化设计**: 扁平化设计风格，避免过度阴影效果
- **流畅动画**: 使用 Framer Motion 实现丝滑的页面过渡和交互动画
- **响应式布局**: 避免传统侧边栏布局，采用全屏流式设计
- **实时监控**: 任务状态实时更新和进度监控
- **类型安全**: 完整的 TypeScript 类型定义和 SDK 集成

## 🛠️ 技术栈

- **前端框架**: React 19 + TypeScript
- **构建工具**: Vite
- **路由**: TanStack Router
- **UI 组件**: shadcn/ui (避免使用 Card 组件)
- **动画**: Framer Motion
- **数据获取**: SWR + ofetch
- **图表**: Recharts (待实现)
- **模态框**: vaul Drawer

## 📁 项目结构

```
src/
├── components/
│   ├── layout/           # 布局组件
│   │   ├── AppLayout.tsx
│   │   ├── StatusBar.tsx
│   │   └── TopNavigation.tsx
│   ├── analysis/         # 分析相关组件
│   │   ├── TaskCreator.tsx
│   │   └── TaskMonitor.tsx
│   ├── pages/           # 页面组件
│   │   ├── HomePage.tsx
│   │   ├── AnalysisPage.tsx
│   │   ├── HistoryPage.tsx
│   │   └── SettingsPage.tsx
│   └── ui/              # shadcn/ui 组件
├── hooks/               # 自定义 Hooks
│   ├── useSystemHealth.ts
│   ├── useAnalyzers.ts
│   └── useAnalysisTask.ts
├── lib/
│   ├── sdk-client.ts    # SDK 客户端实例
│   └── utils.ts
├── routes/              # 路由定义
└── sdk/                 # 完整的 TypeScript SDK
```

## 🎨 设计理念

### 避免传统 Dashboard 布局
- 不使用侧边栏 + 主内容区域的传统布局
- 采用顶部导航 + 全屏内容的现代化设计
- 参考 Linear、GitHub 等优秀产品的设计理念

### 扁平化视觉风格
- 减少阴影的使用，避免虚假的立体感
- 使用简洁的线条和分隔符
- 通过色彩和动画来区分不同状态

### 流畅的用户体验
- 使用 vaul Drawer 实现任务创建界面
- Framer Motion 提供页面切换和状态变化动画
- 实时的任务状态更新和进度显示

## 🚀 快速开始

### 安装依赖
```bash
pnpm install
```

### 启动开发服务器
```bash
pnpm dev
```

### 构建生产版本
```bash
pnpm build
```

## 📋 当前实现状态

### ✅ 已完成
- [x] 基础布局和导航系统
- [x] 系统健康状态监控 (Popover 显示)
- [x] 任务创建界面 (Drawer 形式)
- [x] 任务状态监控和进度显示
- [x] 响应式设计和动画效果
- [x] SDK 集成和数据获取

### 🚧 开发中
- [ ] 图表组件实现 (使用 Recharts)
- [ ] 历史记录管理
- [ ] 设置页面
- [ ] 错误处理优化

### 📝 待实现
- [ ] 结果详情展示
- [ ] 数据导出功能
- [ ] 主题切换
- [ ] 国际化支持

## 🔧 开发说明

### 数据获取
- 使用 SWR 进行数据缓存和自动重新验证
- 任务状态自动轮询更新
- 完整的错误处理和重试机制

### 动画实现
- 页面切换使用 Framer Motion 的 AnimatePresence
- 组件状态变化的微动画
- 避免在 className 中使用 transition 类，防止与 Framer Motion 冲突

### 组件设计
- 避免使用 shadcn/ui 的 Card 组件
- 使用 vaul Drawer 替代传统模态框
- 所有图标使用 lucide-react，避免 emoji

## 📖 API 文档

详细的 SDK 使用说明请参考 [README_SDK.md](./README_SDK.md)。
