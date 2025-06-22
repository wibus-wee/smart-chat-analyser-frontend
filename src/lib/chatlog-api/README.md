# 聊天记录 API 客户端

这是一个用于连接聊天记录后端服务的 TypeScript 客户端库，提供完整的聊天记录数据访问功能。

## 功能特性

- 🔗 **完整的 API 覆盖**: 支持所有聊天记录后端 API 端点
- 📝 **TypeScript 支持**: 完整的类型定义和 Zod 验证
- 🚀 **现代化设计**: 使用 ofetch 进行 HTTP 请求
- 🔄 **自动重试**: 内置错误处理和重试机制
- 🎯 **React 集成**: 提供专用的 React Hooks
- 📊 **数据验证**: 使用 Zod 进行响应数据验证

## 快速开始

### 基础用法

```typescript
import { ChatlogApiSDK } from './lib/chatlog-api';

// 创建 SDK 实例
const chatlogApi = new ChatlogApiSDK({
  baseUrl: 'http://127.0.0.1:5030',
  timeout: 30000,
});

// 测试连接
const isConnected = await chatlogApi.testConnection();

// 获取联系人列表
const contacts = await chatlogApi.contacts.getContacts();

// 获取群聊列表
const chatrooms = await chatlogApi.chatrooms.getChatrooms();

// 获取会话列表
const sessions = await chatlogApi.sessions.getSessions();
```

### 在 React 组件中使用

```typescript
import { useChatTargets, useRecentChatTargets } from '../hooks/useChatlogApi';

function MyComponent() {
  const { targets, isLoading, error } = useChatTargets();
  const { recentTargets } = useRecentChatTargets(10);

  if (isLoading) return <div>加载中...</div>;
  if (error) return <div>加载失败: {error.message}</div>;

  return (
    <div>
      <h2>所有聊天对象 ({targets.length})</h2>
      {targets.map(target => (
        <div key={target.id}>
          {target.displayName} ({target.type})
        </div>
      ))}
    </div>
  );
}
```

## API 端点

### 聊天记录 (Chatlog)

```typescript
// 获取聊天记录
const messages = await chatlogApi.chatlog.getChatlog({
  talker: 'friend_name',
  days: 30,
  limit: 100
});

// 按日期范围获取
const messages = await chatlogApi.chatlog.getChatlogByDateRange(
  '2024-01-01',
  '2024-01-31',
  'friend_name'
);

// 获取最近聊天记录
const messages = await chatlogApi.chatlog.getChatlogByTalker('friend_name', 7);
```

### 联系人 (Contacts)

```typescript
// 获取所有联系人
const contacts = await chatlogApi.contacts.getContacts();

// 查找特定联系人
const contact = await chatlogApi.contacts.findContactByUserName('username');

// 搜索联系人
const results = await chatlogApi.contacts.searchContacts('搜索关键词');
```

### 群聊 (Chatrooms)

```typescript
// 获取所有群聊
const chatrooms = await chatlogApi.chatrooms.getChatrooms();

// 查找特定群聊
const chatroom = await chatlogApi.chatrooms.findChatroomByName('群名');

// 搜索群聊
const results = await chatlogApi.chatrooms.searchChatrooms('搜索关键词');
```

### 会话 (Sessions)

```typescript
// 获取所有会话
const sessions = await chatlogApi.sessions.getSessions();

// 获取最近会话
const recentSessions = await chatlogApi.sessions.getRecentSessions(10);

// 查找特定会话
const session = await chatlogApi.sessions.findSessionByUserName('username');
```

## React Hooks

### useChatTargets

获取所有聊天对象（联系人 + 群聊）

```typescript
const { targets, isLoading, error, refresh } = useChatTargets();
```

### useRecentChatTargets

获取最近聊天对象

```typescript
const { recentTargets, isLoading, error, refresh } = useRecentChatTargets(10);
```

### useContacts

获取联系人列表

```typescript
const { contacts, isLoading, error, refresh } = useContacts();
```

### useChatrooms

获取群聊列表

```typescript
const { chatrooms, isLoading, error, refresh } = useChatrooms();
```

### useSessions

获取会话列表

```typescript
const { sessions, isLoading, error, refresh } = useSessions();
```

### useSearchChatTargets

搜索聊天对象

```typescript
const { query, results, isSearching, search, clearSearch } = useSearchChatTargets();

// 执行搜索
await search('搜索关键词');
```

### useChatlogConnection

测试 API 连接状态

```typescript
const { isConnected, isChecking, checkConnection } = useChatlogConnection();
```

## 高级功能

### 获取所有聊天对象

```typescript
// 获取格式化的聊天对象列表（用于下拉选择等）
const targets = await chatlogApi.getAllChatTargets();
// 返回格式: { id, name, type, displayName }[]
```

### 获取最近聊天对象

```typescript
// 获取最近有聊天记录的对象
const recentTargets = await chatlogApi.getRecentChatTargets(10);
// 返回格式: { id, name, displayName, lastContent, lastTime }[]
```

## 错误处理

```typescript
import { ChatlogApiError } from './lib/chatlog-api';

try {
  const contacts = await chatlogApi.contacts.getContacts();
} catch (error) {
  if (error instanceof ChatlogApiError) {
    console.error(`API 错误 ${error.status}: ${error.message}`);
  } else {
    console.error('未知错误:', error);
  }
}
```

## 配置选项

```typescript
const chatlogApi = new ChatlogApiSDK({
  baseUrl: 'http://127.0.0.1:5030',  // API 服务器地址
  timeout: 30000,                    // 请求超时时间（毫秒）
  headers: {                         // 自定义请求头
    'Custom-Header': 'value'
  }
});
```

## 调试和测试

项目包含一个调试组件 `ChatlogApiTest`，可以用来测试 API 连接和查看数据：

```typescript
import { ChatlogApiTest } from '../components/debug/ChatlogApiTest';

function DebugPage() {
  return <ChatlogApiTest />;
}
```

## 示例代码

查看 `examples.ts` 文件获取完整的使用示例：

```typescript
import { runAllExamples } from './lib/chatlog-api/examples';

// 运行所有示例
await runAllExamples();
```
