import type { Node, Edge } from '@xyflow/react';

export enum NodeCategory {
  CLIENT_LAYER = 'CLIENT_LAYER',
  NETWORKING = 'NETWORKING',
  AUTH = 'AUTH',
  SERVICES = 'SERVICES',
  PROCESSING = 'PROCESSING',
  DATA = 'DATA',
  STORAGE = 'STORAGE',
  MESSAGING = 'MESSAGING',
  INFRASTRUCTURE = 'INFRASTRUCTURE',
  EXTERNAL = 'EXTERNAL',
  OBSERVABILITY = 'OBSERVABILITY'
}

export interface NodeData extends Record<string, unknown> {
  name: string;
  type: string;
  category: NodeCategory;
  description?: string;
  capacity: number;
  processingTime: number;
  failureProbability: number;
  health: number; // 0-100
  failed?: boolean;
}

export interface EdgeData extends Record<string, unknown> {
  label?: string;
  bandwidth?: number;
  latency?: number;
}
