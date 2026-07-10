import { useCanvasStore } from '@/store/useCanvasStore';
import { useSimulationStore } from '@/store/useSimulationStore';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Network, Server } from 'lucide-react';

export function RightPanel() {
  const { nodes, edges, selectedNodeId, selectedEdgeId, updateNode } = useCanvasStore();
  const { running, nodeMetrics } = useSimulationStore();

  const selectedNode = nodes.find(n => n.id === selectedNodeId);
  const selectedEdge = edges.find(e => e.id === selectedEdgeId);

  if (!selectedNode && !selectedEdge) {
    return (
      <aside className="w-80 border-l border-border bg-card/30 flex flex-col h-full z-10 relative">
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6 text-center">
          <Network className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-sm">Select a node or connection to configure its properties.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 border-l border-border bg-card/30 flex flex-col h-full z-10 relative">
      <div className="p-4 border-b border-border bg-card">
        <h2 className="font-semibold text-sm flex items-center gap-2">
          {selectedNode ? <Server className="w-4 h-4" /> : <Network className="w-4 h-4" />}
          {selectedNode ? 'Node Configuration' : 'Connection Properties'}
        </h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {selectedNode && (
            <>
              <div className="space-y-3">
                <Label>Instance Name</Label>
                <Input 
                  value={selectedNode.data.name as string || ''}
                  onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                  className="bg-background"
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Capacity (req/s)</Label>
                  <span className="text-xs text-muted-foreground">{selectedNode.data.capacity as number}</span>
                </div>
                <Slider 
                  value={[selectedNode.data.capacity as number || 100]} 
                  onValueChange={([val]) => updateNode(selectedNode.id, { capacity: val })}
                  max={10000} 
                  step={10} 
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Processing Time (ms)</Label>
                  <span className="text-xs text-muted-foreground">{selectedNode.data.processingTime as number} ms</span>
                </div>
                <Slider 
                  value={[selectedNode.data.processingTime as number || 10]} 
                  onValueChange={([val]) => updateNode(selectedNode.id, { processingTime: val })}
                  max={1000} 
                  step={5} 
                />
              </div>

              {running && nodeMetrics[selectedNode.id] && (
                <div className="mt-8 p-4 bg-background border border-border rounded-lg shadow-sm">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Live Metrics</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status</span>
                      <span className={nodeMetrics[selectedNode.id].failed ? "text-destructive font-medium" : "text-green-500 font-medium"}>
                        {nodeMetrics[selectedNode.id].failed ? 'FAILED' : 'ONLINE'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Requests</span>
                      <span className="font-mono">{Math.round(nodeMetrics[selectedNode.id].requestsPerSec)}/s</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Latency</span>
                      <span className="font-mono">{Math.round(nodeMetrics[selectedNode.id].latency)}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CPU</span>
                      <span className="font-mono">{Math.round(nodeMetrics[selectedNode.id].cpu)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Queue</span>
                      <span className="font-mono">{Math.round(nodeMetrics[selectedNode.id].queueLength)}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {selectedEdge && (
            <div className="text-sm text-muted-foreground">
              Edge properties coming soon.
            </div>
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
