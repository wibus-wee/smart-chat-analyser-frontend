import { z } from 'zod';

// 聊天记录相关类型
export const ChatlogMessageSchema = z.object({
  id: z.string().optional(),
  talker: z.string(),
  content: z.string(),
  timestamp: z.string(),
  type: z.string().optional(),
  isSelf: z.boolean().optional(),
});

export type ChatlogMessage = z.infer<typeof ChatlogMessageSchema>;

// 联系人类型
export const ContactSchema = z.object({
  userName: z.string(),
  alias: z.string().optional(),
  remark: z.string().optional(),
  nickName: z.string().optional(),
  isFriend: z.boolean().optional(),
});

export type Contact = z.infer<typeof ContactSchema>;

// 群聊用户类型
export const ChatroomUserSchema = z.object({
  userName: z.string(),
  nickName: z.string().optional(),
  displayName: z.string().optional(),
});

export type ChatroomUser = z.infer<typeof ChatroomUserSchema>;

// 群聊类型
export const ChatroomSchema = z.object({
  name: z.string(),
  owner: z.string().optional(),
  users: z.array(ChatroomUserSchema).optional(),
  remark: z.string().optional(),
  nickName: z.string().optional(),
});

export type Chatroom = z.infer<typeof ChatroomSchema>;

// 会话类型
export const SessionSchema = z.object({
  userName: z.string(),
  nOrder: z.number().optional(),
  nickName: z.string().optional(),
  content: z.string().optional(),
  nTime: z.string().optional(),
});

export type Session = z.infer<typeof SessionSchema>;

// API 请求参数类型
export interface GetChatlogParams {
  time?: string; // YYYY-MM-DD 或 YYYY-MM-DD~YYYY-MM-DD
  talker?: string;
  limit?: number;
  offset?: number;
  format?: 'json' | 'csv' | 'text';
}

// API 客户端配置
export interface ChatlogApiConfig {
  baseUrl?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

// API 响应包装类型
export interface ChatlogApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
}

// API 错误类型
export class ChatlogApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown
  ) {
    super(message);
    this.name = 'ChatlogApiError';
  }
}

// 响应验证函数
export function validateChatlogResponse<T>(
  data: unknown,
  schema: z.ZodSchema<T>,
  context: string
): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ChatlogApiError(
        `Invalid response format in ${context}: ${error.message}`,
        400,
        data
      );
    }
    throw error;
  }
}
