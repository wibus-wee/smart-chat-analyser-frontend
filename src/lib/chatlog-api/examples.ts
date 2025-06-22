import { ChatlogApiSDK } from './index';

/**
 * 聊天记录 API SDK 使用示例
 */

// 创建 SDK 实例
const chatlogApi = new ChatlogApiSDK({
  baseUrl: 'http://127.0.0.1:5030',
  timeout: 30000,
});

/**
 * 示例 1: 测试 API 连接
 */
export async function exampleTestConnection() {
  try {
    const isConnected = await chatlogApi.testConnection();
    console.log('聊天记录 API 连接状态:', isConnected ? '✅ 连接成功' : '❌ 连接失败');
    return isConnected;
  } catch (error) {
    console.error('连接测试失败:', error);
    return false;
  }
}

/**
 * 示例 2: 获取联系人列表
 */
export async function exampleGetContacts() {
  try {
    const contacts = await chatlogApi.contacts.getContacts();
    console.log(`✅ 获取到 ${contacts.length} 个联系人`);
    
    if (contacts.length > 0) {
      console.log('📝 联系人示例:');
      console.log(JSON.stringify(contacts[0], null, 2));
    }
    
    return contacts;
  } catch (error) {
    console.error('❌ 获取联系人列表失败:', error);
    return [];
  }
}

/**
 * 示例 3: 获取群聊列表
 */
export async function exampleGetChatrooms() {
  try {
    const chatrooms = await chatlogApi.chatrooms.getChatrooms();
    console.log(`✅ 获取到 ${chatrooms.length} 个群聊`);
    
    if (chatrooms.length > 0) {
      console.log('📝 群聊示例:');
      console.log(JSON.stringify(chatrooms[0], null, 2));
    }
    
    return chatrooms;
  } catch (error) {
    console.error('❌ 获取群聊列表失败:', error);
    return [];
  }
}

/**
 * 示例 4: 获取会话列表
 */
export async function exampleGetSessions() {
  try {
    const sessions = await chatlogApi.sessions.getSessions();
    console.log(`✅ 获取到 ${sessions.length} 个会话`);
    
    if (sessions.length > 0) {
      console.log('📝 会话示例:');
      console.log(JSON.stringify(sessions[0], null, 2));
    }
    
    return sessions;
  } catch (error) {
    console.error('❌ 获取会话列表失败:', error);
    return [];
  }
}

/**
 * 示例 5: 获取所有聊天对象
 */
export async function exampleGetAllChatTargets() {
  try {
    const targets = await chatlogApi.getAllChatTargets();
    console.log(`✅ 获取到 ${targets.length} 个聊天对象`);
    
    const contacts = targets.filter(t => t.type === 'contact');
    const chatrooms = targets.filter(t => t.type === 'chatroom');
    
    console.log(`📊 统计: ${contacts.length} 个联系人, ${chatrooms.length} 个群聊`);
    
    if (targets.length > 0) {
      console.log('📝 聊天对象示例:');
      console.log(JSON.stringify(targets.slice(0, 3), null, 2));
    }
    
    return targets;
  } catch (error) {
    console.error('❌ 获取聊天对象失败:', error);
    return [];
  }
}

/**
 * 示例 6: 获取最近聊天对象
 */
export async function exampleGetRecentChatTargets() {
  try {
    const recentTargets = await chatlogApi.getRecentChatTargets(5);
    console.log(`✅ 获取到 ${recentTargets.length} 个最近聊天对象`);
    
    if (recentTargets.length > 0) {
      console.log('📝 最近聊天对象:');
      recentTargets.forEach((target, index) => {
        console.log(`${index + 1}. ${target.displayName} (${target.name})`);
        if (target.lastContent) {
          console.log(`   最后消息: ${target.lastContent.substring(0, 50)}...`);
        }
        if (target.lastTime) {
          console.log(`   时间: ${target.lastTime}`);
        }
      });
    }
    
    return recentTargets;
  } catch (error) {
    console.error('❌ 获取最近聊天对象失败:', error);
    return [];
  }
}

/**
 * 示例 7: 获取特定聊天对象的聊天记录
 */
export async function exampleGetChatlogByTalker(talker: string, days: number = 7) {
  try {
    console.log(`🔍 获取 "${talker}" 最近 ${days} 天的聊天记录...`);
    
    const messages = await chatlogApi.chatlog.getChatlogByTalker(talker, days, 10);
    console.log(`✅ 获取到 ${messages.length} 条聊天记录`);
    
    if (messages.length > 0) {
      console.log('📝 聊天记录示例:');
      messages.slice(0, 3).forEach((msg, index) => {
        console.log(`${index + 1}. [${msg.timestamp}] ${msg.talker}: ${msg.content.substring(0, 100)}...`);
      });
    }
    
    return messages;
  } catch (error) {
    console.error('❌ 获取聊天记录失败:', error);
    return [];
  }
}

/**
 * 运行所有示例
 */
export async function runAllExamples() {
  console.log('🚀 开始运行聊天记录 API 示例...\n');
  
  // 1. 测试连接
  console.log('1️⃣ 测试 API 连接');
  const isConnected = await exampleTestConnection();
  console.log('');
  
  if (!isConnected) {
    console.log('❌ API 连接失败，请检查服务器是否运行');
    return;
  }
  
  // 2. 获取联系人
  console.log('2️⃣ 获取联系人列表');
  await exampleGetContacts();
  console.log('');
  
  // 3. 获取群聊
  console.log('3️⃣ 获取群聊列表');
  await exampleGetChatrooms();
  console.log('');
  
  // 4. 获取会话
  console.log('4️⃣ 获取会话列表');
  const sessions = await exampleGetSessions();
  console.log('');
  
  // 5. 获取所有聊天对象
  console.log('5️⃣ 获取所有聊天对象');
  await exampleGetAllChatTargets();
  console.log('');
  
  // 6. 获取最近聊天对象
  console.log('6️⃣ 获取最近聊天对象');
  // const recentTargets = await exampleGetRecentChatTargets();
  console.log('');
  
  // 7. 获取聊天记录（使用第一个会话）
  if (sessions.length > 0 && sessions[0].userName) {
    console.log('7️⃣ 获取聊天记录示例');
    await exampleGetChatlogByTalker(sessions[0].userName);
    console.log('');
  }
  
  console.log('✅ 所有示例运行完成！');
}

// 如果直接运行此文件，执行所有示例
if (typeof window === 'undefined') {
  // Node.js 环境
  runAllExamples().catch(console.error);
}
