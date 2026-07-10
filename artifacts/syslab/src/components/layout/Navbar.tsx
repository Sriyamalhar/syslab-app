import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { SysLabLogo } from '@/components/ui/syslab-logo';
import { useTheme } from '@/components/theme-provider';
import { Moon, Sun } from 'lucide-react';
import { useAuthStore } from '@/store/useAuthStore';

export function Navbar() {
  const [, setLocation] = useLocation();
  const { theme, setTheme } = useTheme();
  const { token, logout } = useAuthStore();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex" onClick={() => setLocation('/')} style={{cursor: 'pointer'}}>
          <SysLabLogo className="h-6 w-6 mr-2" />
          <span className="font-bold text-lg tracking-tight">SysLab</span>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* search or nav links could go here */}
          </div>
          <nav className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            {token ? (
              <>
                <Button variant="ghost" onClick={() => setLocation('/dashboard')}>Dashboard</Button>
                <Button variant="outline" onClick={() => { logout(); setLocation('/'); }}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => setLocation('/login')}>Log in</Button>
                <Button onClick={() => setLocation('/register')}>Get Started</Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
