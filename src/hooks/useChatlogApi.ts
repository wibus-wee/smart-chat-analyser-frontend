import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { chatlogClient } from '../lib/chatlog-client';
// import type { Contact, Chatroom, Session, ChatlogMessage } from '../lib/chatlog-api';

/**
 * 获取所有聊天对象的 Hook
 */
export function useChatTargets() {
  const { data, error, isLoading, mutate } = useSWR(
    'chatlog-targets',
    () => chatlogClient.getAllChatTargets(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1分钟内不重复请求
    }
  );

  return {
    targets: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * 获取最近聊天对象的 Hook
 */
export function useRecentChatTargets(limit: number = 10) {
  const { data, error, isLoading, mutate } = useSWR(
    ['recent-chat-targets', limit],
    ([, limit]) => chatlogClient.getRecentChatTargets(limit),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 30000, // 30秒内不重复请求
    }
  );

  return {
    recentTargets: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * 获取联系人列表的 Hook
 */
export function useContacts() {
  const { data, error, isLoading, mutate } = useSWR(
    'chatlog-contacts',
    () => chatlogClient.contacts.getContacts(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5分钟内不重复请求
    }
  );

  return {
    contacts: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * 获取群聊列表的 Hook
 */
export function useChatrooms() {
  const { data, error, isLoading, mutate } = useSWR(
    'chatlog-chatrooms',
    () => chatlogClient.chatrooms.getChatrooms(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 300000, // 5分钟内不重复请求
    }
  );

  return {
    chatrooms: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * 获取会话列表的 Hook
 */
export function useSessions() {
  const { data, error, isLoading, mutate } = useSWR(
    'chatlog-sessions',
    () => chatlogClient.sessions.getSessions(),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // 1分钟内不重复请求
    }
  );

  return {
    sessions: data || [],
    isLoading,
    error,
    refresh: mutate,
  };
}

/**
 * 搜索聊天对象的 Hook
 */
export function useSearchChatTargets() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Array<{
    id: string;
    name: string;
    type: 'contact' | 'chatroom';
    displayName: string;
  }>>([]);
  const [isSearching, setIsSearching] = useState(false);

  const search = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    setQuery(searchQuery);

    try {
      const [contacts, chatrooms] = await Promise.all([
        chatlogClient.contacts.searchContacts(searchQuery),
        chatlogClient.chatrooms.searchChatrooms(searchQuery),
      ]);

      const searchResults = [];

      // 添加匹配的联系人
      for (const contact of contacts) {
        searchResults.push({
          id: contact.userName,
          name: contact.userName,
          type: 'contact' as const,
          displayName: contact.nickName || contact.alias || contact.remark || contact.userName,
        });
      }

      // 添加匹配的群聊
      for (const chatroom of chatrooms) {
        searchResults.push({
          id: chatroom.name,
          name: chatroom.name,
          type: 'chatroom' as const,
          displayName: chatroom.nickName || chatroom.remark || chatroom.name,
        });
      }

      setResults(searchResults);
    } catch (error) {
      console.error('搜索聊天对象失败:', error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
  };

  return {
    query,
    results,
    isSearching,
    search,
    clearSearch,
  };
}

/**
 * 测试聊天记录 API 连接的 Hook
 */
export function useChatlogConnection() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      const connected = await chatlogClient.testConnection();
      setIsConnected(connected);
      return connected;
    } catch (error) {
      console.error('检查聊天记录 API 连接失败:', error);
      setIsConnected(false);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return {
    isConnected,
    isChecking,
    checkConnection,
  };
}
