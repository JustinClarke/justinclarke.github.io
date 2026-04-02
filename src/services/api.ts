/**
 * @fileoverview Mock service layer representing backend API calls.
 */

import { projectsData } from '@/data';
import { Project } from '@/shared/types';

/**
 * Simulates a network request to an external database / CMS.
 * Resolves with the statically defined projects array.
 * 
 * @returns {Promise<Project[]>} Array of Project documents.
 */
export const fetchProjects = async (): Promise<Project[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(projectsData);
    }, 300); // simulate 300ms network latency
  });
};

/**
 * Simulates a network request to fetch a specific project by its ID.
 * 
 * @param {string} id - The unique project identifier.
 * @returns {Promise<Project | undefined>} The requested project, or undefined if not found.
 */
export const fetchProjectById = async (id: string): Promise<Project | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(projectsData.find((p) => p.id === id));
    }, 200);
  });
};
