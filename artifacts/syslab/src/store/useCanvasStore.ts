import { create } from 'zustand';
import type { Node, Edge } from '@xyflow/react';
import type { NodeData } from '../types/canvas';

interface CanvasState {
  nodes: Node[];
  edges: Edge[];
  snapToGrid: boolean;
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  history: { nodes: Node[]; edges: Edge[] }[];
  historyIndex: number;
  clipboard: { nodes: Node[]; edges: Edge[] } | null;
  
  setNodes: (nodes: Node[] | ((val: Node[]) => Node[])) => void;
  setEdges: (edges: Edge[] | ((val: Edge[]) => Edge[])) => void;
  addNode: (node: Node) => void;
  updateNode: (id: string, data: Partial<NodeData>) => void;
  removeSelected: () => void;
  copySelected: () => void;
  pasteClipboard: () => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  toggleSnapToGrid: () => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  loadCanvasData: (data: { nodes: Node[]; edges: Edge[] }) => void;
  exportJSON: () => string;
  importJSON: (json: string) => void;
}

export const useCanvasStore = create<CanvasState>((set, get) => ({
  nodes: [],
  edges: [],
  snapToGrid: true,
  selectedNodeId: null,
  selectedEdgeId: null,
  history: [],
  historyIndex: -1,
  clipboard: null,

  setNodes: (nodesOrUpdater) => {
    set((state) => ({
      nodes: typeof nodesOrUpdater === 'function' ? nodesOrUpdater(state.nodes) : nodesOrUpdater
    }));
  },
  
  setEdges: (edgesOrUpdater) => {
    set((state) => ({
      edges: typeof edgesOrUpdater === 'function' ? edgesOrUpdater(state.edges) : edgesOrUpdater
    }));
  },

  addNode: (node) => set((state) => {
    const newNodes = [...state.nodes, node];
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push({ nodes: newNodes, edges: state.edges });
    return {
      nodes: newNodes,
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  }),

  updateNode: (id, data) => set((state) => {
    const newNodes = state.nodes.map(n => 
      n.id === id ? { ...n, data: { ...n.data, ...data } } : n
    );
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push({ nodes: newNodes, edges: state.edges });
    return {
      nodes: newNodes,
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  }),

  removeSelected: () => set((state) => {
    if (!state.selectedNodeId && !state.selectedEdgeId) return state;
    
    let newNodes = state.nodes;
    let newEdges = state.edges;

    if (state.selectedNodeId) {
      newNodes = state.nodes.filter(n => n.id !== state.selectedNodeId);
      newEdges = state.edges.filter(e => e.source !== state.selectedNodeId && e.target !== state.selectedNodeId);
    } else if (state.selectedEdgeId) {
      newEdges = state.edges.filter(e => e.id !== state.selectedEdgeId);
    }

    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push({ nodes: newNodes, edges: newEdges });

    return {
      nodes: newNodes,
      edges: newEdges,
      selectedNodeId: null,
      selectedEdgeId: null,
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  }),

  copySelected: () => set((state) => {
    if (!state.selectedNodeId) return state;
    const node = state.nodes.find(n => n.id === state.selectedNodeId);
    if (node) {
      return { clipboard: { nodes: [node], edges: [] } };
    }
    return state;
  }),

  pasteClipboard: () => set((state) => {
    if (!state.clipboard || state.clipboard.nodes.length === 0) return state;
    const node = state.clipboard.nodes[0];
    const newNode = {
      ...node,
      id: `${node.type}-${Date.now()}`,
      position: { x: node.position.x + 20, y: node.position.y + 20 }
    };
    const newNodes = [...state.nodes, newNode];
    
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push({ nodes: newNodes, edges: state.edges });

    return {
      nodes: newNodes,
      history: newHistory,
      historyIndex: newHistory.length - 1,
      selectedNodeId: newNode.id
    };
  }),

  undo: () => set((state) => {
    if (state.historyIndex > 0) {
      const prevIndex = state.historyIndex - 1;
      const { nodes, edges } = state.history[prevIndex];
      return { nodes, edges, historyIndex: prevIndex };
    }
    return state;
  }),

  redo: () => set((state) => {
    if (state.historyIndex < state.history.length - 1) {
      const nextIndex = state.historyIndex + 1;
      const { nodes, edges } = state.history[nextIndex];
      return { nodes, edges, historyIndex: nextIndex };
    }
    return state;
  }),

  pushHistory: () => set((state) => {
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push({ nodes: state.nodes, edges: state.edges });
    return {
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  }),

  toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),
  
  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  loadCanvasData: (data) => set({
    nodes: data.nodes || [],
    edges: data.edges || [],
    history: [data],
    historyIndex: 0,
    selectedNodeId: null,
    selectedEdgeId: null
  }),

  exportJSON: () => {
    const state = get();
    return JSON.stringify({ nodes: state.nodes, edges: state.edges }, null, 2);
  },

  importJSON: (json) => {
    try {
      const data = JSON.parse(json);
      if (Array.isArray(data.nodes) && Array.isArray(data.edges)) {
        get().loadCanvasData(data);
      }
    } catch (e) {
      console.error("Failed to parse JSON");
    }
  }
}));
