import { useState } from 'react';
import { useLocation } from 'wouter';
import { 
  useListProjects, 
  getListProjectsQueryKey,
  useCreateProject,
  useDeleteProject,
  useDuplicateProject
} from '@workspace/api-client-react';
import { useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { 
  Plus, 
  Search, 
  MoreVertical, 
  Trash, 
  Copy, 
  Edit2, 
  Network
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const { isAuthenticated } = useAuthGuard();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [search, setSearch] = useState('');
  const [newProjectName, setNewProjectName] = useState('');
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  const { data: projects, isLoading } = useListProjects({
    query: { enabled: isAuthenticated, queryKey: getListProjectsQueryKey() }
  });

  const createProject = useCreateProject();
  const deleteProject = useDeleteProject();
  const duplicateProject = useDuplicateProject();

  if (!isAuthenticated) return null;

  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    
    createProject.mutate({
      data: { title: newProjectName.trim(), description: 'A new distributed system architecture.' }
    }, {
      onSuccess: (proj) => {
        setIsNewProjectOpen(false);
        setNewProjectName('');
        queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() });
        setLocation(`/editor/${proj.id}`);
      },
      onError: (err) => {
        toast({ title: "Failed to create project", variant: "destructive" });
      }
    });
  };

  const handleDelete = (id: string) => {
    deleteProject.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() })
    });
  };

  const handleDuplicate = (id: string) => {
    duplicateProject.mutate({ id }, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getListProjectsQueryKey() })
    });
  };

  const filteredProjects = projects?.filter(p => p.title.toLowerCase().includes(search.toLowerCase())) || [];

  return (
    <div className="flex h-[100dvh] bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-card/30">
          <h1 className="text-xl font-semibold">Projects</h1>
          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search projects..." 
                className="pl-9 h-9 bg-background" 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            
            <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
              <DialogTrigger asChild>
                <Button className="h-9">
                  <Plus className="mr-2 h-4 w-4" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                  <DialogDescription>
                    Give your architecture a name to get started.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <Label htmlFor="name" className="text-right">
                    Project Name
                  </Label>
                  <Input 
                    id="name" 
                    value={newProjectName} 
                    onChange={(e) => setNewProjectName(e.target.value)} 
                    className="mt-2"
                    placeholder="e.g. Production Cluster"
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateProject()}
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsNewProjectOpen(false)}>Cancel</Button>
                  <Button onClick={handleCreateProject} disabled={createProject.isPending}>
                    {createProject.isPending ? 'Creating...' : 'Create'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6">
          <div className="mb-10">
            <h2 className="text-lg font-medium mb-4 text-muted-foreground">Recent Architectures</h2>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1,2,3].map(i => <div key={i} className="h-48 rounded-xl bg-card border border-border animate-pulse" />)}
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-border rounded-xl bg-card/20">
                <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No projects found</h3>
                <p className="text-muted-foreground mb-4">Get started by creating a new architecture.</p>
                <Button onClick={() => setIsNewProjectOpen(true)}>Create Project</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="group flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-colors shadow-sm">
                    <div 
                      className="h-32 bg-secondary/50 border-b border-border cursor-pointer relative"
                      onClick={() => setLocation(`/editor/${project.id}`)}
                    >
                      {project.thumbnail ? (
                        <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-blue-500/10 flex items-center justify-center">
                          <Network className="h-10 w-10 text-primary/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start mb-2">
                        <h3 
                          className="font-medium text-base truncate pr-2 cursor-pointer hover:text-primary"
                          onClick={() => setLocation(`/editor/${project.id}`)}
                        >
                          {project.title}
                        </h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setLocation(`/editor/${project.id}`)}>
                              <Edit2 className="mr-2 h-4 w-4" /> Open
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(project.id)}>
                              <Copy className="mr-2 h-4 w-4" /> Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(project.id)}>
                              <Trash className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span>{project.nodeCount || 0} nodes</span>
                        <span>Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
