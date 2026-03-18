import { createContext, useContext, useReducer, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';
import { SEED_MILESTONES } from '../utils/seedData';
import { uid } from '../utils/uid';

const MilestoneContext = createContext();

const ACTION = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION.ADD:
      return [...state, action.payload];
    case ACTION.UPDATE:
      return state.map((m) => (m.id === action.payload.id ? { ...m, ...action.payload } : m));
    case ACTION.DELETE:
      return state.filter((m) => m.id !== action.payload);
    default:
      return state;
  }
}

export function MilestoneProvider({ children }) {
  const [milestones, dispatch] = useReducer(
    reducer,
    null,
    () => loadState('milestones', SEED_MILESTONES),
  );

  useEffect(() => {
    saveState('milestones', milestones);
  }, [milestones]);

  const addMilestone = (data) => {
    const milestone = { id: uid('ms'), ...data };
    dispatch({ type: ACTION.ADD, payload: milestone });
    return milestone;
  };

  const updateMilestone = (id, data) => {
    dispatch({ type: ACTION.UPDATE, payload: { id, ...data } });
  };

  const deleteMilestone = (id) => {
    dispatch({ type: ACTION.DELETE, payload: id });
  };

  const getMilestonesByProject = (projectId) =>
    milestones.filter((m) => m.projectId === projectId);

  return (
    <MilestoneContext.Provider
      value={{ milestones, addMilestone, updateMilestone, deleteMilestone, getMilestonesByProject }}
    >
      {children}
    </MilestoneContext.Provider>
  );
}

export function useMilestones() {
  const ctx = useContext(MilestoneContext);
  if (!ctx) throw new Error('useMilestones must be used within MilestoneProvider');
  return ctx;
}
