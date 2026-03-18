import { createContext, useContext, useReducer, useEffect, useRef, useState, useCallback } from 'react';
import { loadState, saveState } from '../utils/storage';
import { SEED_TIME_ENTRIES } from '../utils/seedData';
import { uid } from '../utils/uid';

const TimeContext = createContext();

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
      return [action.payload, ...state];
    case ACTION.UPDATE:
      return state.map((e) => (e.id === action.payload.id ? { ...e, ...action.payload } : e));
    case ACTION.DELETE:
      return state.filter((e) => e.id !== action.payload);
    default:
      return state;
  }
}

export function TimeProvider({ children }) {
  const [entries, dispatch] = useReducer(
    reducer,
    null,
    () => loadState('timeEntries', SEED_TIME_ENTRIES),
  );

  // Timer state
  const [timer, setTimer] = useState({
    running: false,
    paused: false,
    taskId: null,
    projectId: null,
    startedAt: null,
    elapsed: 0, // seconds
  });
  const intervalRef = useRef(null);

  useEffect(() => {
    saveState('timeEntries', entries);
  }, [entries]);

  // Tick the timer
  useEffect(() => {
    if (timer.running && !timer.paused) {
      intervalRef.current = setInterval(() => {
        setTimer((prev) => ({ ...prev, elapsed: prev.elapsed + 1 }));
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [timer.running, timer.paused]);

  const startTimer = (taskId, projectId) => {
    setTimer({
      running: true,
      paused: false,
      taskId,
      projectId,
      startedAt: new Date().toISOString(),
      elapsed: 0,
    });
  };

  const pauseTimer = () => {
    setTimer((prev) => ({ ...prev, paused: true }));
  };

  const resumeTimer = () => {
    setTimer((prev) => ({ ...prev, paused: false }));
  };

  const stopTimer = (notes = '') => {
    if (!timer.running || timer.elapsed < 1) {
      resetTimer();
      return null;
    }
    const entry = {
      id: uid('te'),
      taskId: timer.taskId,
      projectId: timer.projectId,
      userId: 'user-1',
      startTime: timer.startedAt,
      endTime: new Date().toISOString(),
      durationMinutes: Math.round(timer.elapsed / 60),
      notes,
    };
    dispatch({ type: ACTION.ADD, payload: entry });
    resetTimer();
    return entry;
  };

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTimer({ running: false, paused: false, taskId: null, projectId: null, startedAt: null, elapsed: 0 });
  };

  const addManualEntry = (data) => {
    const entry = {
      id: uid('te'),
      userId: 'user-1',
      ...data,
    };
    dispatch({ type: ACTION.ADD, payload: entry });
    return entry;
  };

  const deleteEntry = (id) => {
    dispatch({ type: ACTION.DELETE, payload: id });
  };

  const getEntriesByTask = useCallback(
    (taskId) => entries.filter((e) => e.taskId === taskId),
    [entries],
  );

  const getEntriesByProject = useCallback(
    (projectId) => entries.filter((e) => e.projectId === projectId),
    [entries],
  );

  const getTotalMinutes = useCallback(
    (filterFn) => entries.filter(filterFn).reduce((sum, e) => sum + e.durationMinutes, 0),
    [entries],
  );

  return (
    <TimeContext.Provider
      value={{
        entries,
        timer,
        startTimer,
        pauseTimer,
        resumeTimer,
        stopTimer,
        resetTimer,
        addManualEntry,
        deleteEntry,
        getEntriesByTask,
        getEntriesByProject,
        getTotalMinutes,
      }}
    >
      {children}
    </TimeContext.Provider>
  );
}

export function useTime() {
  const ctx = useContext(TimeContext);
  if (!ctx) throw new Error('useTime must be used within TimeProvider');
  return ctx;
}
