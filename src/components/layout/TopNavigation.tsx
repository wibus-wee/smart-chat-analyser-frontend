import { motion } from 'framer-motion';
import { Link, useLocation } from '@tanstack/react-router';
import { Home, BarChart3, History, Settings } from 'lucide-react';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../ui/theme-toggle';

const navigationItems = [
  {
    to: '/',
    label: '首页',
    icon: Home,
  },
  {
    to: '/analysis',
    label: '分析',
    icon: BarChart3,
  },
  {
    to: '/history',
    label: '历史',
    icon: History,
  },
  {
    to: '/settings',
    label: '设置',
    icon: Settings,
  },
];

export function TopNavigation() {
  const location = useLocation();

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between ml-[-70px]"
    >
      <div className="flex items-center gap-1">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.to;
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'text-foreground bg-muted'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
              
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-muted rounded-lg -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30
                  }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
      </div>
    </motion.nav>
  );
}
