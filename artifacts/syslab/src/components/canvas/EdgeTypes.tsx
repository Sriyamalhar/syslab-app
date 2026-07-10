import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react';

export function AnimatedEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const isSimulating = !!data?.isSimulating;
  const errorRate = data?.errorRate as number || 0;
  
  let strokeColor = 'hsl(var(--muted-foreground))';
  if (isSimulating) {
    if (errorRate > 50) strokeColor = 'hsl(var(--destructive))';
    else if (errorRate > 0) strokeColor = 'hsl(var(--yellow-500))';
    else strokeColor = 'hsl(var(--primary))';
  }

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth: isSimulating ? 2 : 1.5,
          opacity: 0.6,
        }}
      />
      {isSimulating && (
        <circle r="3" fill={strokeColor}>
          <animateMotion 
            dur={`${Math.max(0.5, 2 - (data?.requestsPerSec as number / 100))}s`} 
            repeatCount="indefinite" 
            path={edgePath} 
          />
        </circle>
      )}
    </>
  );
}
