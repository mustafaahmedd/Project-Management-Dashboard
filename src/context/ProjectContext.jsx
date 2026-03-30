import { createContext, useContext, useReducer, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';
import { SEED_PROJECTS } from '../utils/seedData';
import { uid } from '../utils/uid';

const ProjectContext = createContext();

const ACTION = {
  SET: 'SET',
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION.SET:
      return action.payload;
    case ACTION.ADD:
      return [...state, action.payload];
    case ACTION.UPDATE:
      return state.map((p) => (p.id === action.payload.id ? { ...p, ...action.payload } : p));
    case ACTION.DELETE:
      return state.filter((p) => p.id !== action.payload);
    default:
      return state;
  }
}

export function ProjectProvider({ children }) {
  const [projects, dispatch] = useReducer(
    reducer,
    null,
    () => loadState('projects', SEED_PROJECTS),
  );

  useEffect(() => {
    saveState('projects', projects);
  }, [projects]);

  const addProject = (data) => {
    const project = {
      id: uid('proj'),
      createdAt: new Date().toISOString(),
      ownerId: 'user-1',
      memberIds: ['user-1'],
      status: 'active',
      roleId: null,
      ...data,
    };
    dispatch({ type: ACTION.ADD, payload: project });
    return project;
  };

  const updateProject = (id, data) => {
    dispatch({ type: ACTION.UPDATE, payload: { id, ...data } });
  };

  const deleteProject = (id) => {
    dispatch({ type: ACTION.DELETE, payload: id });
  };

  const getProject = (id) => projects.find((p) => p.id === id);

  return (
    <ProjectContext.Provider value={{ projects, addProject, updateProject, deleteProject, getProject }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProjects must be used within ProjectProvider');
  return ctx;
}
