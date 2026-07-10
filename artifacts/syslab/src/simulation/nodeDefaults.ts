import { NodeCategory } from '../types/canvas';

export const nodeTypeDefaults: Record<string, { category: NodeCategory, capacity: number, processingTime: number, failureProbability: number, description: string }> = {
  // CLIENT
  'User': { category: NodeCategory.CLIENT_LAYER, capacity: 1000, processingTime: 5, failureProbability: 0, description: 'End user traffic' },
  'Browser': { category: NodeCategory.CLIENT_LAYER, capacity: 1000, processingTime: 10, failureProbability: 0, description: 'Web browser client' },
  'Mobile Client': { category: NodeCategory.CLIENT_LAYER, capacity: 1000, processingTime: 20, failureProbability: 0.01, description: 'Mobile app client' },
  
  // NETWORKING
  'DNS': { category: NodeCategory.NETWORKING, capacity: 5000, processingTime: 15, failureProbability: 0.001, description: 'Domain Name System' },
  'Load Balancer': { category: NodeCategory.NETWORKING, capacity: 2000, processingTime: 5, failureProbability: 0.005, description: 'Distributes traffic across servers' },
  'API Gateway': { category: NodeCategory.NETWORKING, capacity: 1500, processingTime: 15, failureProbability: 0.01, description: 'Entry point for APIs' },
  'CDN': { category: NodeCategory.NETWORKING, capacity: 10000, processingTime: 5, failureProbability: 0.001, description: 'Content Delivery Network' },
  
  // SERVICES
  'Microservice': { category: NodeCategory.SERVICES, capacity: 200, processingTime: 40, failureProbability: 0.02, description: 'Generic microservice' },
  'REST API': { category: NodeCategory.SERVICES, capacity: 300, processingTime: 30, failureProbability: 0.02, description: 'RESTful API server' },
  
  // DATA
  'PostgreSQL': { category: NodeCategory.DATA, capacity: 500, processingTime: 50, failureProbability: 0.01, description: 'Relational Database' },
  'Redis Cache': { category: NodeCategory.DATA, capacity: 3000, processingTime: 5, failureProbability: 0.005, description: 'In-memory data store' },
  'MongoDB': { category: NodeCategory.DATA, capacity: 800, processingTime: 45, failureProbability: 0.01, description: 'NoSQL Database' },
  
  // MESSAGING
  'Message Queue': { category: NodeCategory.MESSAGING, capacity: 1000, processingTime: 10, failureProbability: 0.01, description: 'Async message broker' },
  'Kafka': { category: NodeCategory.MESSAGING, capacity: 2000, processingTime: 15, failureProbability: 0.005, description: 'Event streaming platform' },
  
  // AUTH
  'Authentication Service': { category: NodeCategory.AUTH, capacity: 300, processingTime: 60, failureProbability: 0.01, description: 'Handles login and tokens' },
};

export function getDefaultNodeData(type: string, name: string) {
  const defaults = nodeTypeDefaults[type] || {
    category: NodeCategory.SERVICES,
    capacity: 100,
    processingTime: 50,
    failureProbability: 0.05,
    description: 'Generic component'
  };

  return {
    name,
    type,
    ...defaults,
    health: 100,
    failed: false
  };
}
