import { useState, useEffect } from 'react';
import { Project } from '../types';
import { fetchProjectById } from '../../services/api';

/**
 * Hook for managing project data fetching.
 */
interface UseProjectResult {
  project: Project | null;
  loading: boolean;
  error: Error | null;
}

export const useProject = (id: string | undefined): UseProjectResult => {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;
    const getAppStatus = async () => {
      if (!id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const data = await fetchProjectById(id);
        if (active) {
          if (data) setProject(data);
          else setError(new Error('Project not found'));
        }
      } catch (err: any) {
        if (active) setError(err);
      } finally {
        if (active) setLoading(false);
      }
    };
    getAppStatus();
    return () => { active = false; };
  }, [id]);

  return { project, loading, error };
};
