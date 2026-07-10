import { useEffect, useRef } from 'react';
import { useUpdateProject } from '@workspace/api-client-react';

export function useAutosave(projectId: string | null, data: any) {
  const updateProject = useUpdateProject();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    if (!projectId) return;

    const dataStr = JSON.stringify(data);
    if (dataStr === lastSavedRef.current) return;

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      updateProject.mutate(
        { id: projectId, data: { canvasData: data } },
        {
          onSuccess: () => {
            lastSavedRef.current = dataStr;
          }
        }
      );
    }, 2000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [data, projectId]);
}
