import { motion } from 'framer-motion';

export function SettingsPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold">设置</h1>
        <p className="text-muted-foreground">
          配置应用程序设置
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center py-12"
      >
        <p className="text-muted-foreground">
          设置功能正在开发中...
        </p>
      </motion.div>
    </div>
  );
}
