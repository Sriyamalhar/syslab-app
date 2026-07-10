import { useCallback, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  ReactFlowProvider,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useCanvasStore } from '@/store/useCanvasStore';
import { CustomNode } from './NodeTypes';
import { AnimatedEdge } from './EdgeTypes';
import { getDefaultNodeData } from '@/simulation/nodeDefaults';

const nodeTypes = { customNode: CustomNode };
const edgeTypes = { customEdge: AnimatedEdge };

export function CanvasEditorCore() {
  const { 
    nodes: storeNodes, 
    edges: storeEdges, 
    setNodes: setStoreNodes, 
    setEdges: setStoreEdges,
    addNode,
    selectNode,
    selectEdge,
    pushHistory
  } = useCanvasStore();

  const [nodes, setNodes, onNodesChange] = useNodesState(storeNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(storeEdges);

  // Sync internal ReactFlow state with Zustand when needed
  useEffect(() => { setNodes(storeNodes); }, [storeNodes, setNodes]);
  useEffect(() => { setEdges(storeEdges); }, [storeEdges, setEdges]);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      const newEdge = { 
        ...params, 
        type: 'customEdge',
        markerEnd: { type: MarkerType.ArrowClosed, color: 'hsl(var(--muted-foreground))' },
      };
      const updatedEdges = addEdge(newEdge, edges);
      setEdges(updatedEdges);
      setStoreEdges(updatedEdges);
      pushHistory();
    },
    [edges, setEdges, setStoreEdges, pushHistory],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      
      const type = event.dataTransfer.getData('application/reactflow');
      if (typeof type === 'undefined' || !type) return;

      const position = { x: event.clientX - 250, y: event.clientY - 100 }; // rough offset compensation
      const newNode: Node = {
        id: `${type.replace(/\s+/g, '')}-${Date.now()}`,
        type: 'customNode',
        position,
        data: getDefaultNodeData(type, type),
      };

      addNode(newNode);
    },
    [addNode],
  );

  const onNodeDragStop = () => {
    setStoreNodes(nodes);
    pushHistory();
  };

  const onSelectionChange = ({ nodes, edges }: { nodes: Node[], edges: Edge[] }) => {
    if (nodes.length === 1) selectNode(nodes[0].id);
    else if (nodes.length === 0) selectNode(null);
    
    if (edges.length === 1) selectEdge(edges[0].id);
    else if (edges.length === 0) selectEdge(null);
  };

  return (
    <div className="flex-1 w-full h-full relative" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodeDragStop={onNodeDragStop}
        onSelectionChange={onSelectionChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        className="bg-background"
      >
        <Background gap={16} size={1} color="hsl(var(--border))" />
        <Controls className="bg-card border-border fill-foreground" />
      </ReactFlow>
    </div>
  );
}

export function CanvasEditor() {
  return (
    <ReactFlowProvider>
      <CanvasEditorCore />
    </ReactFlowProvider>
  );
}
