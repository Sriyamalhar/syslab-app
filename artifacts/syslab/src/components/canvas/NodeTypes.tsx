import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { NodeCategory, NodeData } from '@/types/canvas';

type SysLabNode = Node<NodeData>;
import { 
  Server, Database, Cloud, Shield, Activity, 
  Settings, Users, Globe, Cpu, Network, Zap 
} from 'lucide-react';

const categoryColors: Record<NodeCategory, string> = {
  [NodeCategory.CLIENT_LAYER]: 'border-blue-500',
  [NodeCategory.NETWORKING]: 'border-purple-500',
  [NodeCategory.AUTH]: 'border-yellow-500',
  [NodeCategory.SERVICES]: 'border-green-500',
  [NodeCategory.PROCESSING]: 'border-orange-500',
  [NodeCategory.DATA]: 'border-red-500',
  [NodeCategory.STORAGE]: 'border-cyan-500',
  [NodeCategory.MESSAGING]: 'border-pink-500',
  [NodeCategory.INFRASTRUCTURE]: 'border-slate-500',
  [NodeCategory.EXTERNAL]: 'border-indigo-500',
  [NodeCategory.OBSERVABILITY]: 'border-teal-500',
};

const categoryIcons: Record<NodeCategory, React.ElementType> = {
  [NodeCategory.CLIENT_LAYER]: Users,
  [NodeCategory.NETWORKING]: Network,
  [NodeCategory.AUTH]: Shield,
  [NodeCategory.SERVICES]: Server,
  [NodeCategory.PROCESSING]: Cpu,
  [NodeCategory.DATA]: Database,
  [NodeCategory.STORAGE]: Cloud,
  [NodeCategory.MESSAGING]: Zap,
  [NodeCategory.INFRASTRUCTURE]: Settings,
  [NodeCategory.EXTERNAL]: Globe,
  [NodeCategory.OBSERVABILITY]: Activity,
};

export function CustomNode({ data, selected }: NodeProps<SysLabNode>) {
  const Icon = categoryIcons[data.category] || Server;
  const borderColor = categoryColors[data.category] || 'border-border';

  // Health indicator
  const health = data.health ?? 100;
  let healthColor = 'bg-green-500';
  if (data.failed || health === 0) healthColor = 'bg-red-500';
  else if (health < 80) healthColor = 'bg-yellow-500';

  return (
    <div className={`w-[180px] rounded-md border-2 bg-card shadow-sm transition-shadow ${selected ? 'border-primary shadow-md' : 'border-border'}`}>
      <div className={`h-1 w-full rounded-t-sm border-t-2 ${borderColor}`} />
      
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 overflow-hidden">
            <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            <span className="text-xs font-medium text-muted-foreground truncate">{data.type}</span>
          </div>
          <div className={`w-2 h-2 rounded-full ${healthColor} flex-shrink-0 shadow-sm`} />
        </div>
        
        <div className="font-semibold text-sm truncate">{data.name}</div>
        
        {/* Simulation metrics sparkline (if running) */}
        {data.failed && (
          <div className="mt-2 text-[10px] text-destructive flex items-center font-medium bg-destructive/10 px-1 py-0.5 rounded">
            <Shield className="w-3 h-3 mr-1" /> FAILED
          </div>
        )}
      </div>

      <Handle type="target" position={Position.Left} className="w-2 h-4 rounded-sm bg-muted-foreground/50 border-none" />
      <Handle type="target" position={Position.Top} className="w-4 h-2 rounded-sm bg-muted-foreground/50 border-none" />
      
      <Handle type="source" position={Position.Right} className="w-2 h-4 rounded-sm bg-primary/50 border-none" />
      <Handle type="source" position={Position.Bottom} className="w-4 h-2 rounded-sm bg-primary/50 border-none" />
    </div>
  );
}
