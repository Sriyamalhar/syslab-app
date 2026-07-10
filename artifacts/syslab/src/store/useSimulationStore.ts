import { create } from 'zustand';
import type { Node, Edge } from '@xyflow/react';
import type { NodeData } from '../types/canvas';

export interface NodeMetrics {
  nodeId: string;
  health: number;           // 0-100
  cpu: number;              // 0-100
  memory: number;           // 0-100
  requestsPerSec: number;
  queueLength: number;
  latency: number;          // ms
  errorRate: number;        // 0-100
  currentRequests: number;
  failed: boolean;
  chaosEffect: string | null;  // description of active chaos
}

interface ChaosEffect {
  id: string;
  name: string;
  description: string;
  targetNodeId?: string;
  type: string;
}

interface SimulationState {
  running: boolean;
  tickCount: number;
  requestRate: number;      // requests per second (default 100)
  nodeMetrics: Record<string, NodeMetrics>;
  trafficLog: { timestamp: number; req: number; success: number; latency: number }[];
  activeChaos: ChaosEffect[];
  isChaosPanelOpen: boolean;
  
  startSimulation: (nodes: Node[], edges: Edge[]) => void;
  stopSimulation: () => void;
  tick: (metrics: Record<string, NodeMetrics>, logEntry: { timestamp: number; req: number; success: number; latency: number }) => void;
  applyChaos: (effect: ChaosEffect) => void;
  recoverNode: (nodeId: string) => void;
  recoverAll: () => void;
  toggleChaosPanel: () => void;
}

export const useSimulationStore = create<SimulationState>((set, get) => ({
  running: false,
  tickCount: 0,
  requestRate: 100,
  nodeMetrics: {},
  trafficLog: [],
  activeChaos: [],
  isChaosPanelOpen: false,

  startSimulation: (nodes) => {
    const initialMetrics: Record<string, NodeMetrics> = {};
    nodes.forEach(n => {
      const data = n.data as unknown as NodeData;
      initialMetrics[n.id] = {
        nodeId: n.id,
        health: data.health ?? 100,
        cpu: 0,
        memory: 0,
        requestsPerSec: 0,
        queueLength: 0,
        latency: data.processingTime ?? 10,
        errorRate: 0,
        currentRequests: 0,
        failed: false,
        chaosEffect: null
      };
    });
    set({
      running: true,
      tickCount: 0,
      nodeMetrics: initialMetrics,
      trafficLog: [],
      activeChaos: []
    });
  },

  stopSimulation: () => set({ running: false }),

  tick: (metrics, logEntry) => set((state) => {
    const newLog = [...state.trafficLog, logEntry];
    if (newLog.length > 60) newLog.shift();
    return {
      tickCount: state.tickCount + 1,
      nodeMetrics: { ...state.nodeMetrics, ...metrics },
      trafficLog: newLog
    };
  }),

  applyChaos: (effect) => set((state) => ({
    activeChaos: [...state.activeChaos, effect]
  })),

  recoverNode: (nodeId) => set((state) => ({
    activeChaos: state.activeChaos.filter(c => c.targetNodeId !== nodeId)
  })),

  recoverAll: () => set({ activeChaos: [] }),
  
  toggleChaosPanel: () => set(state => ({ isChaosPanelOpen: !state.isChaosPanelOpen }))
}));
