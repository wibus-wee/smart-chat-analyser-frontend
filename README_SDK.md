# 聊天记录分析器前端项目

基于 React + TypeScript + Vite 构建的聊天记录分析器前端应用，包含完整的 TypeScript SDK。

## 功能特性

- 🚀 **现代化技术栈**: React 19 + TypeScript + Vite
- 📦 **类型安全的 SDK**: 基于 OpenAPI schema 生成的完整 TypeScript 类型定义
- 🔧 **HTTP 客户端**: 使用 ofetch 进行 API 调用
- ✅ **运行时验证**: 使用 Zod 进行请求/响应验证
- 🎨 **UI 组件库**: Chakra UI 提供美观的用户界面
- 🛠️ **模块化设计**: 清晰的代码结构和易于维护的架构

## 项目结构

```
src/
├── sdk/                    # 聊天记录分析器 SDK
│   ├── types.ts           # TypeScript 类型定义和 Zod schemas
│   ├── client.ts          # HTTP 客户端基类
│   ├── endpoints/         # API 端点实现
│   │   ├── health.ts      # 健康检查 API
│   │   ├── tasks.ts       # 任务管理 API
│   │   ├── analyzers.ts   # 分析器 API
│   │   ├── models.ts      # 模型管理 API
│   │   └── system.ts      # 系统统计 API
│   ├── utils/             # 工具函数
│   │   ├── errors.ts      # 错误处理
│   │   └── validation.ts  # 响应验证
│   ├── examples.ts        # 使用示例
│   └── index.ts           # SDK 主入口
├── App.tsx                # 主应用组件
└── main.tsx              # 应用入口
```

## 快速开始

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

## SDK 使用指南

### 基础用法

```typescript
import { ChatlogAnalyserSDK } from './sdk';

// 创建 SDK 实例
const sdk = new ChatlogAnalyserSDK({
  baseUrl: 'http://localhost:6142/api/v1',
  timeout: 30000,
});

// 检查服务健康状态
const isHealthy = await sdk.isHealthy();

// 获取可用分析器
const analyzers = await sdk.analyzers.getAvailableAnalyzers();

// 提交分析任务
const task = await sdk.tasks.createTask({
  talker: 'friend_name',
  days: 30,
  analyzers: ['word_frequency', 'sentiment']
});

// 等待任务完成并获取结果
const result = await sdk.tasks.waitForTaskCompletion(task.task_id);
```

### 高级用法

```typescript
// 快速分析（一步完成）
const result = await sdk.analyzeAndWait({
  talker: 'friend_name',
  days: 7,
  analyzers: ['word_frequency', 'sentiment']
});

// 获取系统状态概览
const overview = await sdk.getSystemOverview();

// 模型管理
const modelInfo = await sdk.models.getModelInfo();
await sdk.models.clearModelCache('specific_model');
```

## API 端点说明

### 健康检查 (Health)
- `getHealth()` - 获取服务健康状态
- `isHealthy()` - 检查服务是否健康
- `isServiceAvailable(serviceName)` - 检查特定服务是否可用

### 任务管理 (Tasks)
- `createTask(taskData)` - 提交分析任务
- `getTaskStatus(taskId)` - 获取任务状态
- `getTaskResult(taskId)` - 获取任务结果
- `cancelTask(taskId)` - 取消任务
- `waitForTaskCompletion(taskId)` - 等待任务完成

### 分析器管理 (Analyzers)
- `getAnalyzers()` - 获取所有可用分析器
- `getAnalyzerInfo(analyzerName)` - 获取特定分析器信息
- `searchAnalyzers(keyword)` - 搜索分析器

### 模型管理 (Models)
- `getModelInfo()` - 获取模型信息
- `clearModelCache(modelKey?)` - 清除模型缓存
- `getLoadedModels()` - 获取已加载模型列表
- `getMemoryUsage()` - 获取内存使用情况
- `getModelCount()` - 获取已加载模型数量
- `getModelStats()` - 获取模型统计信息

### 系统统计 (System)
- `getSystemStats()` - 获取系统统计信息
- `getQueueStats()` - 获取队列统计信息

## 类型安全

SDK 提供完整的 TypeScript 类型定义，包括：

- 请求/响应类型
- 枚举类型（TaskStatus, AnalyzerType 等）
- 运行时验证 schemas（基于 Zod）
- 错误类型定义

## 错误处理

SDK 提供统一的错误处理机制：

```typescript
import { ApiError } from './sdk';

try {
  const result = await sdk.tasks.getTaskStatus('invalid-id');
} catch (error) {
  if (error instanceof ApiError) {
    console.log('API Error:', error.message);
    console.log('Status Code:', error.status);
  }
}
```