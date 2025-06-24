import { motion } from 'framer-motion';
import {
  Github,
  Heart,
  Code,
  Zap,
  Globe,
  Mail,
  ExternalLink,
  BookOpen,
  Bug,
  MessageSquare
} from 'lucide-react';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Separator } from '../ui/separator';
import packageJson from '../../../package.json';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const version = packageJson.version;

  const links = [
    {
      label: '项目主页',
      icon: Github,
      href: 'https://github.com/wibus-wee/chatlog-analyser-frontend',
      external: true
    },
    {
      label: '文档',
      icon: BookOpen,
      href: '/docs',
      external: false
    },
    {
      label: '反馈',
      icon: Bug,
      href: 'https://github.com/wibus-wee/chatlog-analyser-frontend/issues',
      external: true
    },
    {
      label: '联系我们',
      icon: Mail,
      href: 'mailto:contact@example.com',
      external: true
    }
  ];

  const techStack = [
    { name: 'React', version: packageJson.dependencies.react.replace('^', '') },
    { name: 'TypeScript', version: packageJson.devDependencies.typescript.replace('~', '') },
    { name: 'Vite', version: packageJson.devDependencies.vite.replace('^', '') },
    { name: 'TanStack Router', version: packageJson.dependencies['@tanstack/react-router'].replace('^', '') },
    { name: 'Framer Motion', version: packageJson.dependencies['framer-motion'].replace('^', '') },
    { name: 'Tailwind CSS', version: packageJson.dependencies.tailwindcss.replace('^', '') }
  ];

  const handleLinkClick = (href: string, external: boolean) => {
    if (external) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else {
      // 使用 TanStack Router 进行内部导航
      window.location.href = href;
    }
  };

  return (
    <motion.footer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 mt-10"
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* 左侧：项目信息 */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Smart Chat Analyser</span>
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                v{version}
              </span>
            </div>
            
            <Separator orientation="vertical" className="h-4" />
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Heart className="h-3 w-3 text-red-500" />
              <span>Made with</span>
              <Code className="h-3 w-3" />
              <span>by Wibus</span>
            </div>
          </div>

          {/* 中间：快速链接 */}
          <div className="flex items-center gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Button
                  key={link.label}
                  variant="ghost"
                  size="sm"
                  className="gap-1 h-8 px-2 text-xs text-muted-foreground"
                  onClick={() => handleLinkClick(link.href, link.external)}
                  title={link.label}
                >
                  <Icon className="h-3 w-3" />
                  <span className="hidden sm:inline">{link.label}</span>
                  {link.external && <ExternalLink className="h-1 w-1 opacity-50" />}
                </Button>
              );
            })}
          </div>

          {/* 右侧：技术栈信息和版权 */}
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 h-8 px-2 text-xs">
                  <Zap className="h-3 w-3" />
                  <span className="hidden sm:inline">技术栈</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64" align="end">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    <h3 className="font-medium">技术栈</h3>
                  </div>
                  
                  <div className="space-y-2">
                    {techStack.map((tech) => (
                      <div key={tech.name} className="flex justify-between text-sm">
                        <span className="text-muted-foreground">{tech.name}</span>
                        <span className="font-mono text-xs">{tech.version}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Globe className="h-3 w-3" />
                    <span>构建时间: {new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Separator orientation="vertical" className="h-4" />

            <div className="text-xs text-muted-foreground">
              © {currentYear} Smart Chat Analyser
            </div>
          </div>
        </div>

        {/* 移动端适配：在小屏幕上显示简化版本 */}
        <div className="sm:hidden mt-3 pt-3 border-t">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span>v{version}</span>
              <Separator orientation="vertical" className="h-3" />
              <span>© {currentYear}</span>
            </div>
            
            <div className="flex items-center gap-1">
              {links.slice(0, 2).map((link) => {
                const Icon = link.icon;
                return (
                  <Button
                    key={link.label}
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0"
                    onClick={() => handleLinkClick(link.href, link.external)}
                    title={link.label}
                  >
                    <Icon className="h-3 w-3" />
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}
