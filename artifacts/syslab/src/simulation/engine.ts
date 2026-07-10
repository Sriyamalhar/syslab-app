import { useSimulationStore } from '../store/useSimulationStore';
import type { Node, Edge } from '@xyflow/react';
import { NodeCategory, type NodeData } from '../types/canvas';

export function runSimulationTick(nodes: Node[], edges: Edge[]) {
  const store = useSimulationStore.getState();
  if (!store.running) return;

  const currentMetrics = { ...store.nodeMetrics };
  const activeChaos = store.activeChaos;

  // Initialize requests at source nodes
  const sources = nodes.filter(n => {
    const data = n.data as unknown as NodeData;
    return data.category === NodeCategory.CLIENT_LAYER;
  });

  const nodeQueue = [...sources];
  const requestsAtNode: Record<string, number> = {};
  
  sources.forEach(s => {
    requestsAtNode[s.id] = store.requestRate / sources.length; // distribute requests evenly among sources
  });

  // Simple BFS for traffic propagation
  const visited = new Set<string>();
  const adjacencyList: Record<string, string[]> = {};
  edges.forEach(e => {
    if (!adjacencyList[e.source]) adjacencyList[e.source] = [];
    adjacencyList[e.source].push(e.target);
  });

  let totalReq = 0;
  let successReq = 0;
  let sumLatency = 0;

  nodes.forEach(n => {
    if (!currentMetrics[n.id]) return;
    const metrics = currentMetrics[n.id];
    const data = n.data as unknown as NodeData;
    
    let incomingRequests = requestsAtNode[n.id] || 0;
    
    // Apply Chaos Effects
    let isFailed: boolean = metrics.failed || !!data.failed;
    let baseLatency = data.processingTime || 10;
    let isDropped = false;
    let isTimeout = false;

    activeChaos.forEach(chaos => {
      if (!chaos.targetNodeId || chaos.targetNodeId === n.id) {
        if (chaos.type === 'kill_server') isFailed = true;
        if (chaos.type === 'high_latency') baseLatency *= 8;
        if (chaos.type === 'api_timeout') isTimeout = true;
      }
      
      // Auto-targets
      if (chaos.type === 'crash_db' && data.category === NodeCategory.DATA) isFailed = true;
      if (chaos.type === 'cache_failure' && (data.type === 'Redis Cache' || data.type === 'Cache')) isFailed = true;
      if (chaos.type === 'dns_failure' && data.type === 'DNS') isFailed = true;
      if (chaos.type === 'auth_failure' && data.category === NodeCategory.AUTH) isFailed = true;
    });

    metrics.failed = isFailed;

    if (isFailed) {
      metrics.health = 0;
      metrics.errorRate = 100;
      metrics.cpu = 0;
      metrics.queueLength = 0;
      metrics.latency = 0;
      metrics.currentRequests = incomingRequests;
      metrics.requestsPerSec = 0;
      totalReq += incomingRequests;
    } else {
      // Process normally
      const capacity = data.capacity || 100;
      const jitter = (Math.random() * 0.4) - 0.2; // -20% to +20%
      
      let processed = incomingRequests;
      let errorRate = 0;
      let latency = baseLatency * (1 + jitter);

      if (incomingRequests > capacity) {
        metrics.queueLength += (incomingRequests - capacity);
        processed = capacity;
        latency *= 2;
        errorRate = 5 + (metrics.queueLength / capacity) * 5;
      } else {
        metrics.queueLength = Math.max(0, metrics.queueLength - (capacity - incomingRequests));
      }

      if (metrics.queueLength > capacity * 2) {
        metrics.health = Math.max(60, metrics.health - 5);
      } else if (metrics.health < 100) {
        metrics.health = Math.min(100, metrics.health + 2);
      }

      if (isTimeout) {
        latency = 30000;
        errorRate = 100;
      }

      metrics.cpu = Math.min(100, (processed / capacity) * 80 + Math.random() * 20);
      metrics.memory = Math.min(95, 30 + (metrics.queueLength / 10) * 40);
      metrics.latency = latency;
      metrics.errorRate = Math.min(100, errorRate);
      metrics.currentRequests = incomingRequests;
      metrics.requestsPerSec = processed;

      // propagate to targets
      const targets = adjacencyList[n.id] || [];
      if (targets.length > 0 && !isTimeout) {
        let packetLoss = 0;
        activeChaos.forEach(c => {
          if (c.type === 'packet_loss' && (c.targetNodeId === n.id || !c.targetNodeId)) packetLoss = 0.3;
          if (c.type === 'disconnect_network' && (c.targetNodeId === n.id || targets.includes(c.targetNodeId || ''))) packetLoss = 1.0;
        });

        const sent = processed * (1 - packetLoss) * (1 - (metrics.errorRate/100));
        targets.forEach(t => {
          requestsAtNode[t] = (requestsAtNode[t] || 0) + (sent / targets.length);
        });
      } else if (targets.length === 0) {
        // End of line node
        totalReq += incomingRequests;
        successReq += processed * (1 - (metrics.errorRate/100));
        sumLatency += latency * processed;
      }
    }
  });

  const avgLatency = successReq > 0 ? sumLatency / successReq : 0;

  store.tick(currentMetrics, {
    timestamp: Date.now(),
    req: totalReq || store.requestRate,
    success: successReq,
    latency: avgLatency
  });
}
