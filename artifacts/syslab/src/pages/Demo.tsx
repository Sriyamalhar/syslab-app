import { useEffect } from 'react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { useSimulationStore } from '@/store/useSimulationStore';
import { CanvasEditor } from '@/components/canvas/CanvasEditor';
import { MonitoringPanel } from '@/components/canvas/MonitoringPanel';
import { ChaosPanel } from '@/components/canvas/ChaosPanel';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight, Play, Square } from 'lucide-react';
import { SysLabLogo as Logo } from '@/components/ui/syslab-logo';
import { runSimulationTick } from '@/simulation/engine';
import { useRef } from 'react';

const DEMO_CANVAS = {
  nodes: [
    {
      id: 'user-1', type: 'customNode', position: { x: 40, y: 220 },
      data: { label: 'User', name: 'Web Client', type: 'User', replicas: 1, cpuUsage: 0, memoryUsage: 0, requestRate: 0, errorRate: 0, latency: 0, isHealthy: true, isChaosTarget: false },
    },
    {
      id: 'cdn-1', type: 'customNode', position: { x: 220, y: 100 },
      data: { label: 'CDN', name: 'CloudFront', type: 'CDN', replicas: 1, cpuUsage: 0, memoryUsage: 0, requestRate: 0, errorRate: 0, latency: 0, isHealthy: true, isChaosTarget: false },
    },
    {
      id: 'lb-1', type: 'customNode', position: { x: 220, y: 340 },
      data: { label: 'Load Balancer', name: 'NGINX LB', type: 'Load Balancer', replicas: 2, cpuUsage: 0, memoryUsage: 0, requestRate: 0, errorRate: 0, latency: 0, isHealthy: true, isChaosTarget: false },
    },
    {
      id: 'api-1', type: 'customNode', position: { x: 440, y: 180 },
      data: { label: 'Microservice', name: 'Auth Service', type: 'Microservice', replicas: 2, cpuUsage: 0, memoryUsage: 0, requestRate: 0, errorRate: 0, latency: 0, isHealthy: true, isChaosTarget: false },
    },
    {
      id: 'api-2', type: 'customNode', position: { x: 440, y: 360 },
      data: { label: 'Microservice', name: 'Orders API', type: 'Microservice', replicas: 3, cpuUsage: 0, memoryUsage: 0, requestRate: 0, errorRate: 0, latency: 0, isHealthy: true, isChaosTarget: false },
    },
    {
      id: 'queue-1', type: 'customNode', position: { x: 640, y: 260 },
      data: { label: 'Message Queue', name: 'RabbitMQ', type: 'Message Queue', replicas: 1, cpuUsage: 0, memoryUsage: 0, requestRate: 0, errorRate: 0, latency: 0, isHealthy: true, isChaosTarget: false },
    },
    {
      id: 'db-1', type: 'customNode', position: { x: 840, y: 160 },
      data: { label: 'PostgreSQL', name: 'Primary DB', type: 'PostgreSQL', replicas: 1, cpuUsage: 0, memoryUsage: 0, requestRate: 0, errorRate: 0, latency: 0, isHealthy: true, isChaosTarget: false },
    },
    {
      id: 'cache-1', type: 'customNode', position: { x: 840, y: 360 },
      data: { label: 'Redis Cache', name: 'Redis', type: 'Redis Cache', replicas: 1, cpuUsage: 0, memoryUsage: 0, requestRate: 0, errorRate: 0, latency: 0, isHealthy: true, isChaosTarget: false },
    },
  ],
  edges: [
    { id: 'e1', source: 'user-1', target: 'cdn-1', type: 'customEdge', animated: false },
    { id: 'e2', source: 'user-1', target: 'lb-1', type: 'customEdge', animated: false },
    { id: 'e3', source: 'lb-1', target: 'api-1', type: 'customEdge', animated: false },
    { id: 'e4', source: 'lb-1', target: 'api-2', type: 'customEdge', animated: false },
    { id: 'e5', source: 'api-1', target: 'queue-1', type: 'customEdge', animated: false },
    { id: 'e6', source: 'api-2', target: 'queue-1', type: 'customEdge', animated: false },
    { id: 'e7', source: 'queue-1', target: 'db-1', type: 'customEdge', animated: false },
    { id: 'e8', source: 'queue-1', target: 'cache-1', type: 'customEdge', animated: false },
    { id: 'e9', source: 'cdn-1', target: 'api-1', type: 'customEdge', animated: false },
  ],
};

export default function Demo() {
  const { loadCanvasData, nodes, edges } = useCanvasStore();
  const { running, startSimulation, stopSimulation, isChaosPanelOpen } = useSimulationStore();
  const simulationRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadCanvasData(DEMO_CANVAS as any);
  }, []);

  useEffect(() => {
    if (running) {
      simulationRef.current = setInterval(() => {
        const n = useCanvasStore.getState().nodes;
        const e = useCanvasStore.getState().edges;
        runSimulationTick(n, e);
      }, 500);
    } else if (simulationRef.current) {
      clearInterval(simulationRef.current);
    }
    return () => { if (simulationRef.current) clearInterval(simulationRef.current); };
  }, [running]);

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-background overflow-hidden">
      {/* Demo toolbar */}
      <header className="h-14 border-b border-border bg-card/95 backdrop-blur flex items-center justify-between px-4 z-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <Logo className="w-6 h-6" />
          <span className="font-bold text-base">SysLab</span>
          <span className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 ml-1">Live Demo</span>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant={running ? 'destructive' : 'default'}
            className="h-9"
            onClick={() => running ? stopSimulation() : startSimulation(nodes, edges)}
          >
            {running
              ? <><Square className="mr-2 h-4 w-4 fill-current" />Stop</>
              : <><Play className="mr-2 h-4 w-4 fill-current" />Run Simulation</>}
          </Button>

          <div className="w-px h-6 bg-border" />

          <Link href="/register">
            <Button className="h-9">
              Start Building Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost" className="h-9 text-muted-foreground">Log in</Button>
          </Link>
        </div>
      </header>

      {/* Canvas */}
      <div className="flex-1 flex relative overflow-hidden">
        <CanvasEditor />
        {isChaosPanelOpen && <ChaosPanel />}
        {running && <MonitoringPanel />}
      </div>
    </div>
  );
}
