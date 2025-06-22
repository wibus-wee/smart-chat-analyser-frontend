import { motion } from 'framer-motion';

export function HistoryPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold">历史记录</h1>
        <p className="text-muted-foreground">
          查看和管理你的分析历史
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center py-12"
      >
        <p className="text-muted-foreground">
          历史记录功能正在开发中...
        </p>
      </motion.div>
    </div>
  );
}
