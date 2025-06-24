import { motion } from "framer-motion";
import { TaskList } from "../analysis/TaskList";

export function AnalysisPage() {
  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h1 className="text-3xl font-bold">分析中心</h1>
        <p className="text-muted-foreground">管理和监控您的分析任务</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <TaskList />
      </motion.div>
    </div>
  );
}
