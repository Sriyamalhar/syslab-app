import { useEffect, useRef } from 'react';
import { useLocation, useParams } from 'wouter';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useGetProject, getGetProjectQueryKey } from '@workspace/api-client-react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { useSimulationStore } from '@/store/useSimulationStore';
import { runSimulationTick } from '@/simulation/engine';
import { Toolbar } from '@/components/canvas/Toolbar';
import { NodePalette } from '@/components/canvas/NodePalette';
import { RightPanel } from '@/components/canvas/RightPanel';
import { MonitoringPanel } from '@/components/canvas/MonitoringPanel';
import { ChaosPanel } from '@/components/canvas/ChaosPanel';
import { CanvasEditor } from '@/components/canvas/CanvasEditor';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAutosave } from '@/hooks/useAutosave';
import { Loader2 } from 'lucide-react';

export default function Editor() {
  const { isAuthenticated } = useAuthGuard();
  const params = useParams();
  const projectId = params.projectId || null;
  
  const { data: project, isLoading } = useGetProject(projectId!, {
    query: { enabled: !!projectId && isAuthenticated, queryKey: getGetProjectQueryKey(projectId!) }
  });

  const { loadCanvasData, nodes, edges } = useCanvasStore();
  const { running } = useSimulationStore();
  
  // Simulation loop
  const simulationRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    if (running) {
      simulationRef.current = setInterval(() => {
        // Need to grab latest nodes/edges from store inside interval
        const currentNodes = useCanvasStore.getState().nodes;
        const currentEdges = useCanvasStore.getState().edges;
        runSimulationTick(currentNodes, currentEdges);
      }, 500);
    } else if (simulationRef.current) {
      clearInterval(simulationRef.current);
    }
    return () => {
      if (simulationRef.current) clearInterval(simulationRef.current);
    };
  }, [running]);

  // Load project data
  const loadedRef = useRef(false);
  useEffect(() => {
    if (project && !loadedRef.current) {
      if (project.canvasData) {
        loadCanvasData(project.canvasData as any);
      }
      loadedRef.current = true;
    }
  }, [project, loadCanvasData]);

  // Hooks
  useKeyboardShortcuts();
  useAutosave(projectId, { nodes, edges });

  if (!isAuthenticated) return null;

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-background overflow-hidden relative">
      <Toolbar projectId={projectId!} projectTitle={project?.title || 'Untitled Project'} />
      <div className="flex-1 flex relative overflow-hidden">
        <NodePalette />
        <CanvasEditor />
        <RightPanel />
        <ChaosPanel />
        <MonitoringPanel />
      </div>
    </div>
  );
}
