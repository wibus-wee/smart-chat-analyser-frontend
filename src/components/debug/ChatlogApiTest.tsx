import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Loader2, CheckCircle, XCircle, Users, MessageSquare, Clock } from 'lucide-react';
import { useChatlogConnection, useChatTargets, useRecentChatTargets } from '../../hooks/useChatlogApi';

/**
 * 聊天记录 API 测试组件
 * 用于调试和验证 API 连接
 */
export function ChatlogApiTest() {
  const { isConnected, isChecking, checkConnection } = useChatlogConnection();
  const { targets, isLoading: isLoadingTargets, error: targetsError, refresh: refreshTargets } = useChatTargets();
  const { recentTargets, isLoading: isLoadingRecent, error: recentError, refresh: refreshRecent } = useRecentChatTargets(5);
  
  const [showDetails, setShowDetails] = useState(false);

  const handleRefreshAll = () => {
    checkConnection();
    refreshTargets();
    refreshRecent();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">聊天记录 API 测试</h2>
          <p className="text-muted-foreground">验证聊天记录后端连接状态</p>
        </div>
        <Button onClick={handleRefreshAll} disabled={isChecking}>
          {isChecking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          刷新状态
        </Button>
      </div>

      {/* 连接状态 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected === null ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : isConnected ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            API 连接状态
          </CardTitle>
          <CardDescription>
            聊天记录后端服务 (http://127.0.0.1:5030)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant={isConnected ? "default" : "destructive"}>
              {isConnected === null ? '检查中...' : isConnected ? '已连接' : '连接失败'}
            </Badge>
            {!isConnected && isConnected !== null && (
              <p className="text-sm text-muted-foreground">
                请确保聊天记录后端服务正在运行
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 数据统计 */}
      {isConnected && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">聊天对象总数</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingTargets ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : targetsError ? (
                  <span className="text-red-500">错误</span>
                ) : (
                  targets.length
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                联系人 + 群聊
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">联系人</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingTargets ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : targetsError ? (
                  <span className="text-red-500">错误</span>
                ) : (
                  targets.filter(t => t.type === 'contact').length
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                个人聊天对象
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">群聊</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingTargets ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : targetsError ? (
                  <span className="text-red-500">错误</span>
                ) : (
                  targets.filter(t => t.type === 'chatroom').length
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                群组聊天对象
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 最近聊天对象 */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              最近聊天对象
            </CardTitle>
            <CardDescription>
              最近有聊天记录的对象列表
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingRecent ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="ml-2">加载中...</span>
              </div>
            ) : recentError ? (
              <div className="text-red-500 py-4">
                加载失败: {recentError.message}
              </div>
            ) : recentTargets.length === 0 ? (
              <div className="text-muted-foreground py-4">
                暂无最近聊天记录
              </div>
            ) : (
              <div className="space-y-2">
                {recentTargets.map((target, index) => (
                  <motion.div
                    key={target.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{target.displayName}</span>
                        <Badge variant="outline" className="text-xs">
                          {target.name}
                        </Badge>
                      </div>
                      {target.lastContent && (
                        <p className="text-sm text-muted-foreground mt-1 truncate">
                          {target.lastContent}
                        </p>
                      )}
                    </div>
                    {target.lastTime && (
                      <div className="text-xs text-muted-foreground">
                        {new Date(target.lastTime).toLocaleString()}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* 详细信息 */}
      {isConnected && (
        <Card>
          <CardHeader>
            <CardTitle>详细信息</CardTitle>
            <CardDescription>
              查看所有聊天对象的详细列表
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => setShowDetails(!showDetails)}
              className="mb-4"
            >
              {showDetails ? '隐藏详情' : '显示详情'}
            </Button>
            
            {showDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-2 max-h-96 overflow-y-auto"
              >
                {targets.map((target) => (
                  <div
                    key={target.id}
                    className="flex items-center justify-between p-2 rounded border text-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant={target.type === 'contact' ? 'default' : 'secondary'}>
                        {target.type === 'contact' ? '联系人' : '群聊'}
                      </Badge>
                      <span className="font-medium">{target.displayName}</span>
                    </div>
                    <span className="text-muted-foreground">{target.name}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
