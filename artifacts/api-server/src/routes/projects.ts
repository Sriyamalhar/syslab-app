import { Router } from "express";
import { eq, and, desc } from "drizzle-orm";
import { db, projectsTable } from "@workspace/db";
import { requireAuth } from "../middlewares/auth.js";

const router = Router();

function formatProject(p: typeof projectsTable.$inferSelect) {
  return {
    id: p.id,
    title: p.title,
    description: p.description ?? null,
    canvasData: p.canvasData ?? null,
    thumbnail: p.thumbnail ?? null,
    nodeCount: p.nodeCount ?? 0,
    userId: p.userId,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  };
}

// GET /api/projects
router.get("/", requireAuth, async (req, res) => {
  const { userId } = (req as typeof req & { user: { userId: string } }).user;

  const projects = await db
    .select()
    .from(projectsTable)
    .where(eq(projectsTable.userId, userId))
    .orderBy(desc(projectsTable.updatedAt));

  res.json(projects.map(formatProject));
});

// POST /api/projects
router.post("/", requireAuth, async (req, res) => {
  const { userId } = (req as typeof req & { user: { userId: string } }).user;
  const { title, description, canvasData, template } = req.body as {
    title?: string;
    description?: string;
    canvasData?: object;
    template?: string;
  };

  if (!title?.trim()) {
    res.status(400).json({ error: "title is required" });
    return;
  }

  // If template specified, apply preset canvas data
  let initialCanvasData = canvasData;
  if (template && !canvasData) {
    initialCanvasData = getTemplateData(template);
  }

  const nodeCount = countNodes(initialCanvasData);

  const [project] = await db
    .insert(projectsTable)
    .values({
      userId,
      title: title.trim(),
      description: description?.trim() ?? null,
      canvasData: initialCanvasData ?? null,
      nodeCount,
    })
    .returning();

  res.status(201).json(formatProject(project!));
});

// GET /api/projects/:id
router.get("/:id", requireAuth, async (req, res) => {
  const { userId } = (req as typeof req & { user: { userId: string } }).user;
  const { id } = req.params as { id: string };

  const [project] = await db
    .select()
    .from(projectsTable)
    .where(and(eq(projectsTable.id, id), eq(projectsTable.userId, userId)))
    .limit(1);

  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  res.json(formatProject(project));
});

// PUT /api/projects/:id
router.put("/:id", requireAuth, async (req, res) => {
  const { userId } = (req as typeof req & { user: { userId: string } }).user;
  const { id } = req.params as { id: string };

  const [existing] = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(and(eq(projectsTable.id, id), eq(projectsTable.userId, userId)))
    .limit(1);

  if (!existing) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const { title, description, canvasData, thumbnail } = req.body as {
    title?: string;
    description?: string;
    canvasData?: object;
    thumbnail?: string;
  };

  const nodeCount = canvasData ? countNodes(canvasData) : undefined;

  const [updated] = await db
    .update(projectsTable)
    .set({
      ...(title !== undefined ? { title: title.trim() } : {}),
      ...(description !== undefined ? { description: description?.trim() ?? null } : {}),
      ...(canvasData !== undefined ? { canvasData } : {}),
      ...(thumbnail !== undefined ? { thumbnail } : {}),
      ...(nodeCount !== undefined ? { nodeCount } : {}),
      updatedAt: new Date(),
    })
    .where(eq(projectsTable.id, id))
    .returning();

  res.json(formatProject(updated!));
});

// DELETE /api/projects/:id
router.delete("/:id", requireAuth, async (req, res) => {
  const { userId } = (req as typeof req & { user: { userId: string } }).user;
  const { id } = req.params as { id: string };

  const [existing] = await db
    .select({ id: projectsTable.id })
    .from(projectsTable)
    .where(and(eq(projectsTable.id, id), eq(projectsTable.userId, userId)))
    .limit(1);

  if (!existing) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  await db
    .delete(projectsTable)
    .where(eq(projectsTable.id, id));

  res.status(204).send();
});

// POST /api/projects/:id/duplicate
router.post("/:id/duplicate", requireAuth, async (req, res) => {
  const { userId } = (req as typeof req & { user: { userId: string } }).user;
  const { id } = req.params as { id: string };

  const [original] = await db
    .select()
    .from(projectsTable)
    .where(and(eq(projectsTable.id, id), eq(projectsTable.userId, userId)))
    .limit(1);

  if (!original) {
    res.status(404).json({ error: "Project not found" });
    return;
  }

  const [duplicated] = await db
    .insert(projectsTable)
    .values({
      userId,
      title: `${original.title} (Copy)`,
      description: original.description,
      canvasData: original.canvasData,
      nodeCount: original.nodeCount,
    })
    .returning();

  res.status(201).json(formatProject(duplicated!));
});

function countNodes(canvasData: unknown): number {
  if (!canvasData || typeof canvasData !== "object") return 0;
  const data = canvasData as { nodes?: unknown[] };
  return Array.isArray(data.nodes) ? data.nodes.length : 0;
}

function getTemplateData(template: string): object {
  const templates: Record<string, object> = {
    microservices: {
      nodes: [
        { id: "user-1", type: "systemNode", position: { x: 50, y: 200 }, data: { label: "User", nodeType: "User", category: "CLIENT_LAYER" } },
        { id: "lb-1", type: "systemNode", position: { x: 220, y: 200 }, data: { label: "Load Balancer", nodeType: "Load Balancer", category: "NETWORKING" } },
        { id: "gw-1", type: "systemNode", position: { x: 400, y: 200 }, data: { label: "API Gateway", nodeType: "API Gateway", category: "NETWORKING" } },
        { id: "svc-1", type: "systemNode", position: { x: 580, y: 100 }, data: { label: "Auth Service", nodeType: "Microservice", category: "SERVICES" } },
        { id: "svc-2", type: "systemNode", position: { x: 580, y: 200 }, data: { label: "User Service", nodeType: "Microservice", category: "SERVICES" } },
        { id: "svc-3", type: "systemNode", position: { x: 580, y: 300 }, data: { label: "Order Service", nodeType: "Microservice", category: "SERVICES" } },
        { id: "db-1", type: "systemNode", position: { x: 760, y: 100 }, data: { label: "Auth DB", nodeType: "PostgreSQL", category: "DATA" } },
        { id: "db-2", type: "systemNode", position: { x: 760, y: 200 }, data: { label: "User DB", nodeType: "PostgreSQL", category: "DATA" } },
        { id: "db-3", type: "systemNode", position: { x: 760, y: 300 }, data: { label: "Order DB", nodeType: "PostgreSQL", category: "DATA" } },
        { id: "cache-1", type: "systemNode", position: { x: 580, y: 400 }, data: { label: "Redis Cache", nodeType: "Redis Cache", category: "DATA" } },
      ],
      edges: [
        { id: "e1", source: "user-1", target: "lb-1" },
        { id: "e2", source: "lb-1", target: "gw-1" },
        { id: "e3", source: "gw-1", target: "svc-1" },
        { id: "e4", source: "gw-1", target: "svc-2" },
        { id: "e5", source: "gw-1", target: "svc-3" },
        { id: "e6", source: "svc-1", target: "db-1" },
        { id: "e7", source: "svc-2", target: "db-2" },
        { id: "e8", source: "svc-3", target: "db-3" },
        { id: "e9", source: "svc-2", target: "cache-1" },
      ],
    },
    "event-driven": {
      nodes: [
        { id: "producer-1", type: "systemNode", position: { x: 100, y: 200 }, data: { label: "Event Producer", nodeType: "Microservice", category: "SERVICES" } },
        { id: "kafka-1", type: "systemNode", position: { x: 320, y: 200 }, data: { label: "Kafka", nodeType: "Kafka", category: "MESSAGING" } },
        { id: "consumer-1", type: "systemNode", position: { x: 540, y: 100 }, data: { label: "Consumer A", nodeType: "Worker", category: "PROCESSING" } },
        { id: "consumer-2", type: "systemNode", position: { x: 540, y: 300 }, data: { label: "Consumer B", nodeType: "Worker", category: "PROCESSING" } },
        { id: "db-1", type: "systemNode", position: { x: 760, y: 100 }, data: { label: "Analytics DB", nodeType: "Time Series DB", category: "DATA" } },
        { id: "db-2", type: "systemNode", position: { x: 760, y: 300 }, data: { label: "Events Store", nodeType: "MongoDB", category: "DATA" } },
      ],
      edges: [
        { id: "e1", source: "producer-1", target: "kafka-1" },
        { id: "e2", source: "kafka-1", target: "consumer-1" },
        { id: "e3", source: "kafka-1", target: "consumer-2" },
        { id: "e4", source: "consumer-1", target: "db-1" },
        { id: "e5", source: "consumer-2", target: "db-2" },
      ],
    },
    "three-tier": {
      nodes: [
        { id: "user-1", type: "systemNode", position: { x: 50, y: 200 }, data: { label: "Browser", nodeType: "Browser", category: "CLIENT_LAYER" } },
        { id: "cdn-1", type: "systemNode", position: { x: 220, y: 100 }, data: { label: "CDN", nodeType: "CDN", category: "NETWORKING" } },
        { id: "web-1", type: "systemNode", position: { x: 220, y: 300 }, data: { label: "Web Server", nodeType: "Nginx", category: "NETWORKING" } },
        { id: "app-1", type: "systemNode", position: { x: 440, y: 200 }, data: { label: "App Server", nodeType: "REST API", category: "SERVICES" } },
        { id: "db-1", type: "systemNode", position: { x: 660, y: 150 }, data: { label: "Primary DB", nodeType: "PostgreSQL", category: "DATA" } },
        { id: "db-2", type: "systemNode", position: { x: 660, y: 300 }, data: { label: "Read Replica", nodeType: "Replica Database", category: "DATA" } },
      ],
      edges: [
        { id: "e1", source: "user-1", target: "cdn-1" },
        { id: "e2", source: "user-1", target: "web-1" },
        { id: "e3", source: "web-1", target: "app-1" },
        { id: "e4", source: "app-1", target: "db-1" },
        { id: "e5", source: "db-1", target: "db-2" },
      ],
    },
    kubernetes: {
      nodes: [
        { id: "user-1", type: "systemNode", position: { x: 50, y: 250 }, data: { label: "External User", nodeType: "User", category: "CLIENT_LAYER" } },
        { id: "lb-1", type: "systemNode", position: { x: 220, y: 250 }, data: { label: "Ingress / LB", nodeType: "Load Balancer", category: "NETWORKING" } },
        { id: "k8s-1", type: "systemNode", position: { x: 420, y: 250 }, data: { label: "K8s Cluster", nodeType: "Kubernetes Cluster", category: "INFRASTRUCTURE" } },
        { id: "pod-1", type: "systemNode", position: { x: 620, y: 100 }, data: { label: "API Pod", nodeType: "Container", category: "INFRASTRUCTURE" } },
        { id: "pod-2", type: "systemNode", position: { x: 620, y: 250 }, data: { label: "Worker Pod", nodeType: "Container", category: "INFRASTRUCTURE" } },
        { id: "pod-3", type: "systemNode", position: { x: 620, y: 400 }, data: { label: "DB Pod", nodeType: "Container", category: "INFRASTRUCTURE" } },
        { id: "pvc-1", type: "systemNode", position: { x: 820, y: 400 }, data: { label: "Persistent Volume", nodeType: "Object Storage", category: "STORAGE" } },
        { id: "mon-1", type: "systemNode", position: { x: 820, y: 100 }, data: { label: "Prometheus", nodeType: "Metrics Collector", category: "OBSERVABILITY" } },
      ],
      edges: [
        { id: "e1", source: "user-1", target: "lb-1" },
        { id: "e2", source: "lb-1", target: "k8s-1" },
        { id: "e3", source: "k8s-1", target: "pod-1" },
        { id: "e4", source: "k8s-1", target: "pod-2" },
        { id: "e5", source: "k8s-1", target: "pod-3" },
        { id: "e6", source: "pod-3", target: "pvc-1" },
        { id: "e7", source: "pod-1", target: "mon-1" },
      ],
    },
  };

  return templates[template] ?? { nodes: [], edges: [] };
}

export default router;
