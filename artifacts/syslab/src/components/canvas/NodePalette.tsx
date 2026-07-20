import { NodeCategory } from '@/types/canvas';
import { getDefaultNodeData } from '@/simulation/nodeDefaults';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Users, Network, Shield, Server,
  Database, Zap
} from 'lucide-react';
import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useCanvasStore } from '@/store/useCanvasStore';
import type { Node } from '@xyflow/react';

const categories = [
  { id: NodeCategory.CLIENT_LAYER, label: 'Client Layer', icon: Users, nodes: ['User', 'Browser', 'Mobile Client'] },
  { id: NodeCategory.NETWORKING, label: 'Networking', icon: Network, nodes: ['DNS', 'Load Balancer', 'API Gateway', 'CDN'] },
  { id: NodeCategory.SERVICES, label: 'Services', icon: Server, nodes: ['Microservice', 'REST API'] },
  { id: NodeCategory.DATA, label: 'Database', icon: Database, nodes: ['PostgreSQL', 'Redis Cache', 'MongoDB'] },
  { id: NodeCategory.MESSAGING, label: 'Messaging', icon: Zap, nodes: ['Message Queue', 'Kafka'] },
  { id: NodeCategory.AUTH, label: 'Authentication', icon: Shield, nodes: ['Authentication Service'] },
];

export function NodePalette() {
  const { addNode } = useCanvasStore();
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    [NodeCategory.CLIENT_LAYER]: true,
    [NodeCategory.SERVICES]: true,
    [NodeCategory.DATA]: true,
  });

  const toggle = (id: string) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onClick = (nodeType: string) => {
    const id = `${nodeType.replace(/\s+/g, '')}-${Date.now()}`;
    const x = 250 + Math.random() * 300;
    const y = 150 + Math.random() * 200;
    const node: Node = {
      id,
      type: 'customNode',
      position: { x, y },
      data: getDefaultNodeData(nodeType, nodeType),
    };
    addNode(node);
  };

  return (
    <aside className="w-64 border-r border-border bg-card/30 flex flex-col h-full z-10 relative">
      <div className="p-4 border-b border-border bg-card">
        <h2 className="font-semibold text-sm">Components</h2>
        <p className="text-xs text-muted-foreground">Click or drag to add</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {categories.map((cat) => (
            <div key={cat.id} className="mb-2">
              <button 
                onClick={() => toggle(cat.id)}
                className="w-full flex items-center justify-between p-2 rounded-md hover:bg-secondary/50 text-sm font-medium transition-colors"
              >
                <div className="flex items-center gap-2">
                  <cat.icon className="w-4 h-4 text-muted-foreground" />
                  {cat.label}
                </div>
                {expanded[cat.id] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              
              {expanded[cat.id] && (
                <div className="mt-1 pl-2 space-y-1">
                  {cat.nodes.map(type => (
                    <div 
                      key={type}
                      className="p-2 text-xs border border-border/50 bg-card rounded cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors select-none"
                      draggable
                      onDragStart={(e) => onDragStart(e, type)}
                      onClick={() => onClick(type)}
                    >
                      {type}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
