import { SDK } from '../sdk';

// 创建完整的 SDK 客户端实例
export const sdkClient = new SDK({
  baseUrl: 'http://localhost:6142/api/v1',
  timeout: 30000,
});

// 导出 SDK 实例供全局使用
export default sdkClient;
