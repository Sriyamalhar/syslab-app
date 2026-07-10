import { Button } from '@/components/ui/button';
import { useCanvasStore } from '@/store/useCanvasStore';
import { useSimulationStore } from '@/store/useSimulationStore';
import { 
  Play, Square, ShieldAlert, Download, Upload, 
  Undo, Redo, ZoomIn, ZoomOut, CheckCircle2, ChevronLeft 
} from 'lucide-react';
import { useLocation } from 'wouter';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { useUpdateProject } from '@workspace/api-client-react';
import { useToast } from '@/hooks/use-toast';

interface ToolbarProps {
  projectId: string;
  projectTitle: string;
}

export function Toolbar({ projectId, projectTitle }: ToolbarProps) {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const updateProject = useUpdateProject();
  
  const { undo, redo, exportJSON, importJSON, nodes, edges } = useCanvasStore();
  const { running, startSimulation, stopSimulation } = useSimulationStore();
  
  const [title, setTitle] = useState(projectTitle);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Sync title prop changes
  useEffect(() => { setTitle(projectTitle); }, [projectTitle]);

  const handleTitleBlur = () => {
    if (title === projectTitle) return;
    setSaveStatus('saving');
    updateProject.mutate(
      { id: projectId, data: { title } },
      {
        onSuccess: () => setSaveStatus('saved'),
        onError: () => {
          setSaveStatus('error');
          toast({ title: "Failed to save title", variant: "destructive" });
        }
      }
    );
  };

  const handleExport = () => {
    const json = exportJSON();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.toLowerCase().replace(/\s+/g, '-')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <header className="h-14 border-b border-border bg-card/95 backdrop-blur flex items-center justify-between px-4 z-50">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setLocation('/dashboard')} className="text-muted-foreground">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <div className="flex flex-col">
          <Input 
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={handleTitleBlur}
            className="h-7 bg-transparent border-transparent hover:border-border focus:border-primary px-2 font-semibold text-base w-[200px]"
          />
          <div className="px-2 text-[10px] text-muted-foreground flex items-center gap-1 h-3">
            {saveStatus === 'saved' && <><CheckCircle2 className="h-3 w-3 text-green-500" /> Saved to cloud</>}
            {saveStatus === 'saving' && 'Saving...'}
            {saveStatus === 'error' && <span className="text-destructive">Failed to save</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center border border-border rounded-md bg-background/50 p-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} title="Undo (Ctrl+Z)">
            <Undo className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} title="Redo (Ctrl+Y)">
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        <Button 
          variant={running ? "destructive" : "default"}
          className="h-9"
          onClick={() => running ? stopSimulation() : startSimulation(nodes, edges)}
        >
          {running ? <Square className="mr-2 h-4 w-4 fill-current" /> : <Play className="mr-2 h-4 w-4 fill-current" />}
          {running ? 'Stop Simulation' : 'Run Simulation'}
        </Button>

        <Button 
          variant="outline" 
          className={`h-9 transition-colors ${useSimulationStore(s => s.isChaosPanelOpen) ? 'bg-destructive/10 text-destructive border-destructive/20' : 'border-primary/20 hover:bg-primary/10 hover:text-primary'}`}
          onClick={() => useSimulationStore.getState().toggleChaosPanel()}
        >
          <ShieldAlert className={`mr-2 h-4 w-4 ${useSimulationStore(s => s.isChaosPanelOpen) ? 'text-destructive' : 'text-primary'}`} />
          Chaos Mode
        </Button>

        <div className="w-px h-6 bg-border mx-1" />

        <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleExport} title="Export JSON">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
