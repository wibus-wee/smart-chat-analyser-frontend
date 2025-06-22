import { ChatlogApiSDK } from './chatlog-api';

// 创建聊天记录 API 客户端实例
export const chatlogClient = new ChatlogApiSDK({
  baseUrl: 'http://127.0.0.1:6142/api/v1/chatlog',
  timeout: 30000,
});

// 导出 SDK 实例供全局使用
export default chatlogClient;
