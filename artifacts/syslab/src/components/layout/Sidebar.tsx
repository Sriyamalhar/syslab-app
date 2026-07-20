import { useLocation } from 'wouter';
import { useAuthStore } from '@/store/useAuthStore';
import { SysLabLogo } from '@/components/ui/syslab-logo';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Library, Settings, LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function Sidebar() {
  const { user, logout } = useAuthStore();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    setLocation('/login');
  };

  const handleComingSoon = (feature: string) => {
    toast({ title: `${feature} coming soon`, description: 'This feature is on the roadmap.' });
  };

  return (
    <aside className="w-64 border-r border-border bg-card/30 flex flex-col h-[100dvh] flex-shrink-0 hidden md:flex">
      <div className="h-14 flex items-center px-6 border-b border-border">
        <SysLabLogo className="w-6 h-6 mr-2" />
        <span className="font-bold text-lg">SysLab</span>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <Button 
          variant={location === '/dashboard' ? 'secondary' : 'ghost'} 
          className="w-full justify-start"
          onClick={() => setLocation('/dashboard')}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => handleComingSoon('Templates')}
        >
          <Library className="mr-2 h-4 w-4" />
          Templates
        </Button>
        <Button 
          variant="ghost" 
          className="w-full justify-start text-muted-foreground hover:text-foreground"
          onClick={() => handleComingSoon('Settings')}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </Button>
      </div>
    </aside>
  );
}
