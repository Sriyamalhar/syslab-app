import { useSimulationStore } from '@/store/useSimulationStore';
import { useCanvasStore } from '@/store/useCanvasStore';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { ShieldAlert, ServerCrash, ZapOff, WifiOff, Hourglass, Activity, ShieldX, Ban, PackageX, Database } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useState } from 'react';

const CHAOS_EFFECTS = [
  { id: 'kill_server', name: 'Kill Server', desc: 'Immediately fails the targeted node', icon: ServerCrash, type: 'kill_server', severity: 'Critical', needsTarget: true },
  { id: 'crash_db', name: 'Crash Database', desc: 'Fails all database nodes', icon: Database, type: 'crash_db', severity: 'Critical', needsTarget: false },
  { id: 'disconnect_net', name: 'Disconnect Network', desc: '100% packet loss on target node edges', icon: WifiOff, type: 'disconnect_network', severity: 'High', needsTarget: true },
  { id: 'high_lat', name: 'High Latency', desc: '8x normal processing time', icon: Hourglass, type: 'high_latency', severity: 'Medium', needsTarget: true },
  { id: 'packet_loss', name: 'Packet Loss', desc: 'Drops 30% of requests randomly', icon: PackageX, type: 'packet_loss', severity: 'High', needsTarget: true },
  { id: 'cache_fail', name: 'Cache Failure', desc: 'Redis/Cache returns errors 80% of time', icon: Activity, type: 'cache_failure', severity: 'Medium', needsTarget: false },
  { id: 'dns_fail', name: 'DNS Failure', desc: 'DNS nodes fail all routing', icon: Ban, type: 'dns_failure', severity: 'Critical', needsTarget: false },
  { id: 'auth_fail', name: 'Auth Failure', desc: 'Auth nodes reject all tokens', icon: ShieldX, type: 'auth_failure', severity: 'High', needsTarget: false },
  { id: 'api_timeout', name: 'API Timeout', desc: 'Forces 30s timeout on node', icon: ZapOff, type: 'api_timeout', severity: 'High', needsTarget: true },
];

export function ChaosPanel() {
  const { isChaosPanelOpen, activeChaos, applyChaos, recoverNode, recoverAll } = useSimulationStore();
  const { nodes } = useCanvasStore();
  
  const [selectedTargets, setSelectedTargets] = useState<Record<string, string>>({});

  if (!isChaosPanelOpen) return null;

  const handleApply = (effect: any) => {
    applyChaos({
      id: `${effect.type}-${Date.now()}`,
      name: effect.name,
      description: effect.desc,
      type: effect.type,
      targetNodeId: effect.needsTarget ? selectedTargets[effect.id] : undefined
    });
  };

  return (
    <aside className="w-80 border-l border-destructive/20 bg-card/95 backdrop-blur flex flex-col h-full z-20 absolute right-0 top-0 bottom-0 shadow-[-10px_0_40px_-10px_rgba(220,38,38,0.1)]">
      <div className="p-4 border-b border-destructive/20 bg-destructive/5 flex items-center justify-between">
        <h2 className="font-bold text-destructive flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" />
          Chaos Injection
        </h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          
          {activeChaos.length > 0 && (
            <div className="mb-6 p-4 border border-destructive/30 bg-destructive/10 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-destructive text-sm uppercase tracking-wide">Active Faults</h3>
                <Button variant="outline" size="sm" className="h-6 text-xs border-destructive/30 text-destructive hover:bg-destructive/20" onClick={recoverAll}>
                  Recover All
                </Button>
              </div>
              <div className="space-y-2">
                {activeChaos.map(c => {
                  const targetName = c.targetNodeId ? nodes.find(n => n.id === c.targetNodeId)?.data.name || c.targetNodeId : 'Global/Auto';
                  return (
                    <div key={c.id} className="flex flex-col gap-1 bg-background/50 p-2 rounded border border-destructive/20 text-sm">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-destructive">{c.name}</span>
                        <Button variant="ghost" size="sm" className="h-5 px-2 text-[10px] text-muted-foreground hover:text-foreground" onClick={() => recoverNode(c.targetNodeId || '')}>
                          Recover
                        </Button>
                      </div>
                      <span className="text-xs text-muted-foreground">Target: {targetName as string}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {CHAOS_EFFECTS.map(effect => {
              const Icon = effect.icon;
              const severityColor = effect.severity === 'Critical' ? 'text-red-500' : effect.severity === 'High' ? 'text-orange-500' : 'text-yellow-500';
              
              return (
                <div key={effect.id} className="border border-border rounded-lg p-3 bg-background hover:border-destructive/30 transition-colors">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="mt-0.5"><Icon className={`w-4 h-4 ${severityColor}`} /></div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm flex items-center justify-between">
                        {effect.name}
                        <span className={`text-[10px] uppercase tracking-wider ${severityColor}`}>{effect.severity}</span>
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">{effect.desc}</p>
                    </div>
                  </div>
                  
                  {effect.needsTarget && (
                    <div className="mb-2">
                      <Select value={selectedTargets[effect.id]} onValueChange={(val) => setSelectedTargets(prev => ({ ...prev, [effect.id]: val }))}>
                        <SelectTrigger className="h-8 text-xs bg-card">
                          <SelectValue placeholder="Select target node..." />
                        </SelectTrigger>
                        <SelectContent>
                          {nodes.map(n => (
                            <SelectItem key={n.id} value={n.id} className="text-xs">
                              {n.data.name as string} ({n.data.type as string})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  
                  <Button 
                    variant="outline" 
                    className="w-full h-8 text-xs border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => handleApply(effect)}
                    disabled={effect.needsTarget && !selectedTargets[effect.id]}
                  >
                    Inject Fault
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </ScrollArea>
    </aside>
  );
}
