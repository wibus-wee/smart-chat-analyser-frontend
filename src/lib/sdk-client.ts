import { ChatlogAnalyserSDK } from '../sdk';

// 创建 SDK 客户端实例
export const sdkClient = new ChatlogAnalyserSDK({
  baseUrl: 'http://localhost:6142/api/v1',
  timeout: 30000,
});

// 导出 SDK 实例供全局使用
export default sdkClient;
