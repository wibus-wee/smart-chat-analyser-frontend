import type { ChatlogApiClient } from './client';
import type {
  ChatlogMessage,
  Contact,
  Chatroom,
  Session,
  GetChatlogParams,
} from './types';
import { ChatlogMessageSchema, ChatroomSchema, ContactSchema, SessionSchema, validateChatlogResponse } from './types';
import { z } from 'zod';

/**
 * 聊天记录相关 API
 */
export class ChatlogEndpoints {
  constructor(private client: ChatlogApiClient) {}

  /**
   * 获取聊天记录
   */
  async getChatlog(params: GetChatlogParams = {}): Promise<ChatlogMessage[]> {
    const response = await this.client.get<ChatlogMessage[]>('/api/v1/chatlog', params);
    return validateChatlogResponse(
      response.data,
      z.array(ChatlogMessageSchema),
      'getChatlog'
    );
  }

  /**
   * 按日期范围获取聊天记录
   */
  async getChatlogByDateRange(
    startDate: string,
    endDate: string,
    talker?: string,
    limit?: number
  ): Promise<ChatlogMessage[]> {
    const timeRange = `${startDate}~${endDate}`;
    return this.getChatlog({
      time: timeRange,
      talker,
      limit,
    });
  }

  /**
   * 获取指定聊天对象的聊天记录
   */
  async getChatlogByTalker(
    talker: string,
    days: number = 30,
    limit?: number
  ): Promise<ChatlogMessage[]> {
    const endDate = new Date().toISOString().split('T')[0];
    const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0];

    return this.getChatlogByDateRange(startDate, endDate, talker, limit);
  }
}

/**
 * 联系人相关 API
 */
export class ContactEndpoints {
  constructor(private client: ChatlogApiClient) {}

  /**
   * 获取联系人列表
   */
  async getContacts(): Promise<Contact[]> {
    const response = await this.client.get<Contact[]>('/api/v1/contact');
    return validateChatlogResponse(
      response.data,
      z.array(ContactSchema),
      'getContacts'
    );
  }

  /**
   * 根据用户名查找联系人
   */
  async findContactByUserName(userName: string): Promise<Contact | null> {
    const contacts = await this.getContacts();
    return contacts.find(contact => contact.userName === userName) || null;
  }

  /**
   * 搜索联系人（按昵称或备注）
   */
  async searchContacts(query: string): Promise<Contact[]> {
    const contacts = await this.getContacts();
    const lowerQuery = query.toLowerCase();
    
    return contacts.filter(contact => 
      contact.nickName?.toLowerCase().includes(lowerQuery) ||
      contact.alias?.toLowerCase().includes(lowerQuery) ||
      contact.remark?.toLowerCase().includes(lowerQuery) ||
      contact.userName.toLowerCase().includes(lowerQuery)
    );
  }
}

/**
 * 群聊相关 API
 */
export class ChatroomEndpoints {
  constructor(private client: ChatlogApiClient) {}

  /**
   * 获取群聊列表
   */
  async getChatrooms(): Promise<Chatroom[]> {
    const response = await this.client.get<Chatroom[]>('/api/v1/chatroom');
    return validateChatlogResponse(
      response.data,
      z.array(ChatroomSchema),
      'getChatrooms'
    );
  }

  /**
   * 根据群名查找群聊
   */
  async findChatroomByName(name: string): Promise<Chatroom | null> {
    const chatrooms = await this.getChatrooms();
    return chatrooms.find(chatroom => chatroom.name === name) || null;
  }

  /**
   * 搜索群聊
   */
  async searchChatrooms(query: string): Promise<Chatroom[]> {
    const chatrooms = await this.getChatrooms();
    const lowerQuery = query.toLowerCase();
    
    return chatrooms.filter(chatroom => 
      chatroom.name.toLowerCase().includes(lowerQuery) ||
      chatroom.nickName?.toLowerCase().includes(lowerQuery) ||
      chatroom.remark?.toLowerCase().includes(lowerQuery)
    );
  }
}

/**
 * 会话相关 API
 */
export class SessionEndpoints {
  constructor(private client: ChatlogApiClient) {}

  /**
   * 获取会话列表
   */
  async getSessions(): Promise<Session[]> {
    const response = await this.client.get<Session[]>('/api/v1/session');
    return validateChatlogResponse(
      response.data,
      z.array(SessionSchema),
      'getSessions'
    );
  }

  /**
   * 根据用户名查找会话
   */
  async findSessionByUserName(userName: string): Promise<Session | null> {
    const sessions = await this.getSessions();
    return sessions.find(session => session.userName === userName) || null;
  }

  /**
   * 获取最近的会话列表（按时间排序）
   */
  async getRecentSessions(limit: number = 10): Promise<Session[]> {
    const sessions = await this.getSessions();
    
    // 按 nOrder 或 nTime 排序
    return sessions
      .sort((a, b) => {
        if (a.nOrder !== undefined && b.nOrder !== undefined) {
          return b.nOrder - a.nOrder;
        }
        if (a.nTime && b.nTime) {
          return new Date(b.nTime).getTime() - new Date(a.nTime).getTime();
        }
        return 0;
      })
      .slice(0, limit);
  }
}
