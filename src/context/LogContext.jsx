import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { loadState, saveState } from '../utils/storage';
import { SEED_LOGS } from '../utils/seedData';
import { uid } from '../utils/uid';

const LogContext = createContext();

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
      return state.map((l) => (l.id === action.payload.id ? { ...l, ...action.payload } : l));
    case ACTION.DELETE:
      return state.filter((l) => l.id !== action.payload);
    default:
      return state;
  }
}

export function LogProvider({ children }) {
  const [logs, dispatch] = useReducer(
    reducer,
    null,
    () => loadState('logs', SEED_LOGS),
  );

  useEffect(() => {
    saveState('logs', logs);
  }, [logs]);

  const addLog = (data) => {
    const log = {
      id: uid('log'),
      createdAt: new Date().toISOString(),
      parsedItems: [],
      priorityNotes: '',
      ...data,
    };
    dispatch({ type: ACTION.ADD, payload: log });
    return log;
  };

  const updateLog = (id, data) => {
    dispatch({ type: ACTION.UPDATE, payload: { id, ...data } });
  };

  const deleteLog = (id) => {
    dispatch({ type: ACTION.DELETE, payload: id });
  };

  const getLog = (id) => logs.find((l) => l.id === id);

  const getLogByDate = useCallback(
    (date) => logs.find((l) => l.date === date),
    [logs],
  );

  const getLogsByMonth = useCallback(
    (year, month) => logs.filter((l) => {
      const d = new Date(l.date);
      return d.getFullYear() === year && d.getMonth() === month;
    }),
    [logs],
  );

  return (
    <LogContext.Provider
      value={{ logs, addLog, updateLog, deleteLog, getLog, getLogByDate, getLogsByMonth }}
    >
      {children}
    </LogContext.Provider>
  );
}

export function useLogs() {
  const ctx = useContext(LogContext);
  if (!ctx) throw new Error('useLogs must be used within LogProvider');
  return ctx;
}
