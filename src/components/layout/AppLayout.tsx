import { motion } from 'framer-motion';
import { StatusBar } from './StatusBar';
import { Footer } from './Footer';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <StatusBar />

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="container mx-auto px-6 py-6 mt-10 flex-1"
      >
        {children}
      </motion.main>

      <Footer />
    </div>
  );
}
