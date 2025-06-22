import { motion } from 'framer-motion';
import { TaskCreator } from '../analysis/TaskCreator';
import { ChatlogApiTest } from './ChatlogApiTest';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

/**
 * TaskCreator 测试组件
 * 用于测试新的聊天对象选择功能
 */
export function TaskCreatorTest() {
  const handleTaskCreated = (taskId: string) => {
    console.log('任务创建成功:', taskId);
    // 这里可以添加更多的处理逻辑，比如跳转到任务详情页
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">TaskCreator 测试页面</h1>
        <p className="text-muted-foreground">测试新的聊天对象选择功能</p>
      </div>

      <Tabs defaultValue="creator" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="creator">任务创建器</TabsTrigger>
          <TabsTrigger value="api-test">API 测试</TabsTrigger>
        </TabsList>

        <TabsContent value="creator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>新建分析任务</CardTitle>
              <CardDescription>
                测试使用聊天记录 API 获取聊天对象的功能
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <TaskCreator onTaskCreated={handleTaskCreated} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>功能说明</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 rounded-lg border"
                >
                  <h3 className="font-semibold mb-2">🔍 智能搜索</h3>
                  <p className="text-sm text-muted-foreground">
                    支持按名称、昵称、备注搜索聊天对象，提供实时搜索结果
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="p-4 rounded-lg border"
                >
                  <h3 className="font-semibold mb-2">⏰ 最近聊天</h3>
                  <p className="text-sm text-muted-foreground">
                    优先显示最近有聊天记录的对象，并显示最后一条消息预览
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="p-4 rounded-lg border"
                >
                  <h3 className="font-semibold mb-2">👥 分组显示</h3>
                  <p className="text-sm text-muted-foreground">
                    按联系人和群聊分组显示，便于快速找到目标对象
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="p-4 rounded-lg border"
                >
                  <h3 className="font-semibold mb-2">🔗 连接状态</h3>
                  <p className="text-sm text-muted-foreground">
                    自动检测聊天记录服务连接状态，提供友好的错误提示
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api-test">
          <ChatlogApiTest />
        </TabsContent>
      </Tabs>
    </div>
  );
}
