import { Activity } from 'lucide-react';

export function SysLabLogo({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center text-primary ${className}`}>
      <Activity className="w-full h-full" strokeWidth={2.5} />
    </div>
  );
}
