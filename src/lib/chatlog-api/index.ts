// 导出所有类型
export * from './types';

// 导出客户端
export { ChatlogApiClient } from './client';

// 导出各个 API 端点
export { 
  ChatlogEndpoints, 
  ContactEndpoints, 
  ChatroomEndpoints, 
  SessionEndpoints 
} from './endpoints';

// 主要的 SDK 类
import { ChatlogApiClient } from './client';
import { 
  ChatlogEndpoints, 
  ContactEndpoints, 
  ChatroomEndpoints, 
  SessionEndpoints 
} from './endpoints';
import type { ChatlogApiConfig } from './types';

/**
 * 聊天记录 API SDK
 * 提供完整的聊天记录数据访问功能
 */
export class ChatlogApiSDK {
  private readonly client: ChatlogApiClient;

  // API 端点实例
  public readonly chatlog: ChatlogEndpoints;
  public readonly contacts: ContactEndpoints;
  public readonly chatrooms: ChatroomEndpoints;
  public readonly sessions: SessionEndpoints;

  constructor(config: ChatlogApiConfig = {}) {
    this.client = new ChatlogApiClient(config);

    // 初始化各个 API 端点
    this.chatlog = new ChatlogEndpoints(this.client);
    this.contacts = new ContactEndpoints(this.client);
    this.chatrooms = new ChatroomEndpoints(this.client);
    this.sessions = new SessionEndpoints(this.client);
  }

  /**
   * 获取底层客户端实例（用于高级用法）
   */
  getClient(): ChatlogApiClient {
    return this.client;
  }

  /**
   * 测试 API 连接
   */
  async testConnection(): Promise<boolean> {
    return this.client.testConnection();
  }

  /**
   * 获取所有聊天对象（联系人 + 群聊）
   * 用于 TaskCreator 组件的下拉选择
   */
  async getAllChatTargets(): Promise<Array<{
    id: string;
    name: string;
    type: 'contact' | 'chatroom';
    displayName: string;
  }>> {
    try {
      const [contacts, chatrooms] = await Promise.all([
        this.contacts.getContacts(),
        this.chatrooms.getChatrooms(),
      ]);

      const targets = [];

      // 添加联系人
      for (const contact of contacts) {
        targets.push({
          id: contact.userName,
          name: contact.userName,
          type: 'contact' as const,
          displayName: contact.nickName || contact.alias || contact.remark || contact.userName,
        });
      }

      // 添加群聊
      for (const chatroom of chatrooms) {
        targets.push({
          id: chatroom.name,
          name: chatroom.name,
          type: 'chatroom' as const,
          displayName: chatroom.nickName || chatroom.remark || chatroom.name,
        });
      }

      return targets;
    } catch (error) {
      console.error('获取聊天对象失败:', error);
      return [];
    }
  }

  /**
   * 根据会话列表获取最近聊天的对象
   */
  async getRecentChatTargets(limit: number = 10): Promise<Array<{
    id: string;
    name: string;
    displayName: string;
    lastContent?: string;
    lastTime?: string;
  }>> {
    try {
      const sessions = await this.sessions.getRecentSessions(limit);
      const [contacts, chatrooms] = await Promise.all([
        this.contacts.getContacts(),
        this.chatrooms.getChatrooms(),
      ]);

      // 创建查找映射
      const contactMap = new Map(contacts.map(c => [c.userName, c]));
      const chatroomMap = new Map(chatrooms.map(c => [c.name, c]));

      return sessions.map(session => {
        const contact = contactMap.get(session.userName);
        const chatroom = chatroomMap.get(session.userName);
        
        let displayName = session.nickName || session.userName;
        if (contact) {
          displayName = contact.nickName || contact.alias || contact.remark || contact.userName;
        } else if (chatroom) {
          displayName = chatroom.nickName || chatroom.remark || chatroom.name;
        }

        return {
          id: session.userName,
          name: session.userName,
          displayName,
          lastContent: session.content,
          lastTime: session.nTime,
        };
      });
    } catch (error) {
      console.error('获取最近聊天对象失败:', error);
      return [];
    }
  }
}
