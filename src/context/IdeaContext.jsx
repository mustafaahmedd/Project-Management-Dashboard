import { createContext, useContext, useReducer, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';
import { uid } from '../utils/uid';

const IdeaContext = createContext();

const ACTION = {
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION.ADD:
      return [action.payload, ...state];
    case ACTION.UPDATE:
      return state.map((i) => (i.id === action.payload.id ? { ...i, ...action.payload } : i));
    case ACTION.DELETE:
      return state.filter((i) => i.id !== action.payload);
    default:
      return state;
  }
}

const SEED_IDEAS = [
  {
    id: 'idea-1',
    title: 'Add dark/light theme toggle',
    description: 'Let users switch between dark and light themes from settings page.',
    category: 'feature',
    priority: 'medium',
    status: 'new',
    createdAt: '2026-04-10T09:00:00Z',
  },
  {
    id: 'idea-2',
    title: 'Integrate Slack notifications',
    description: 'Send task deadline reminders via Slack webhook.',
    category: 'integration',
    priority: 'high',
    status: 'exploring',
    createdAt: '2026-04-12T14:30:00Z',
  },
];

export function IdeaProvider({ children }) {
  const [ideas, dispatch] = useReducer(
    reducer,
    null,
    () => loadState('ideas', SEED_IDEAS),
  );

  useEffect(() => {
    saveState('ideas', ideas);
  }, [ideas]);

  const addIdea = (data) => {
    const idea = {
      id: uid('idea'),
      status: 'new',
      category: 'general',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      ...data,
    };
    dispatch({ type: ACTION.ADD, payload: idea });
    return idea;
  };

  const updateIdea = (id, data) => {
    dispatch({ type: ACTION.UPDATE, payload: { id, ...data } });
  };

  const deleteIdea = (id) => {
    dispatch({ type: ACTION.DELETE, payload: id });
  };

  return (
    <IdeaContext.Provider value={{ ideas, addIdea, updateIdea, deleteIdea }}>
      {children}
    </IdeaContext.Provider>
  );
}

export function useIdeas() {
  const ctx = useContext(IdeaContext);
  if (!ctx) throw new Error('useIdeas must be used within IdeaProvider');
  return ctx;
}
