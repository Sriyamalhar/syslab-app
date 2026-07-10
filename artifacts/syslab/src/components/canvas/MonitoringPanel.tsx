import { useSimulationStore } from '@/store/useSimulationStore';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Server, Zap, ShieldAlert, Clock } from 'lucide-react';

export function MonitoringPanel() {
  const { trafficLog, nodeMetrics, running } = useSimulationStore();
  
  if (!running) return null;

  const latestLog = trafficLog[trafficLog.length - 1] || { req: 0, success: 0, latency: 0 };
  const successRate = latestLog.req > 0 ? (latestLog.success / latestLog.req) * 100 : 100;
  
  const nodes = Object.values(nodeMetrics);
  const failedNodes = nodes.filter(n => n.failed || n.health === 0).length;

  return (
    <div className="absolute bottom-0 left-0 right-0 h-64 bg-card/95 backdrop-blur border-t border-border z-40 flex shadow-[0_-10px_40px_-10px_rgba(0,0,0,0.3)]">
      
      {/* KPI Cards */}
      <div className="w-64 border-r border-border p-4 flex flex-col gap-2 overflow-y-auto">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">System Status</h3>
        
        <div className="bg-background rounded border border-border p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Throughput</span>
          </div>
          <span className="font-mono font-semibold">{Math.round(latestLog.req)}/s</span>
        </div>

        <div className="bg-background rounded border border-border p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-orange-500">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Avg Latency</span>
          </div>
          <span className="font-mono font-semibold">{Math.round(latestLog.latency)}ms</span>
        </div>

        <div className="bg-background rounded border border-border p-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-green-500">
            <Server className="h-4 w-4" />
            <span className="text-sm font-medium">Success Rate</span>
          </div>
          <span className="font-mono font-semibold">{successRate.toFixed(1)}%</span>
        </div>

        {failedNodes > 0 && (
          <div className="bg-destructive/10 text-destructive rounded border border-destructive/20 p-3 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span className="text-sm font-medium">Failed Nodes</span>
            </div>
            <span className="font-mono font-semibold">{failedNodes}</span>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="flex-1 flex flex-col p-4 border-r border-border">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Traffic & Latency</h3>
        <div className="flex-1 min-h-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trafficLog} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="timestamp" hide />
              <YAxis yAxisId="left" stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={(v) => `${v}/s`} />
              <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--muted-foreground))" fontSize={10} tickFormatter={(v) => `${v}ms`} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
                labelStyle={{ display: 'none' }}
              />
              <Area yAxisId="left" type="monotone" dataKey="req" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorReq)" isAnimationActive={false} name="Requests" />
              <Line yAxisId="right" type="monotone" dataKey="latency" stroke="hsl(var(--orange-500))" dot={false} strokeWidth={2} isAnimationActive={false} name="Latency" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Node Table */}
      <div className="w-[400px] flex flex-col p-4">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Node Health</h3>
        <div className="flex-1 overflow-auto pr-2">
          <div className="space-y-2">
            {nodes.map(n => (
              <div key={n.nodeId} className="flex items-center justify-between text-sm p-2 rounded bg-background border border-border">
                <div className="flex items-center gap-2 truncate w-1/3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${n.failed ? 'bg-destructive' : n.health < 80 ? 'bg-yellow-500' : 'bg-green-500'}`} />
                  <span className="truncate">{n.nodeId.split('-')[0]}</span>
                </div>
                <div className="flex items-center gap-4 w-2/3 justify-end font-mono text-xs">
                  <div className="flex flex-col items-end w-12">
                    <span className="text-[10px] text-muted-foreground">CPU</span>
                    <span className={n.cpu > 80 ? 'text-destructive' : ''}>{Math.round(n.cpu)}%</span>
                  </div>
                  <div className="flex flex-col items-end w-16">
                    <span className="text-[10px] text-muted-foreground">LATENCY</span>
                    <span>{Math.round(n.latency)}ms</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
