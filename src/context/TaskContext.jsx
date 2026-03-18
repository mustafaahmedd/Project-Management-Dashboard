import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { loadState, saveState } from '../utils/storage';
import { SEED_TASKS } from '../utils/seedData';
import { uid } from '../utils/uid';

const TaskContext = createContext();

const ACTION = {
  SET: 'SET',
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  MOVE: 'MOVE',
  TOGGLE_SUBTASK: 'TOGGLE_SUBTASK',
};

function reducer(state, action) {
  switch (action.type) {
    case ACTION.SET:
      return action.payload;
    case ACTION.ADD:
      return [...state, action.payload];
    case ACTION.UPDATE:
      return state.map((t) => (t.id === action.payload.id ? { ...t, ...action.payload } : t));
    case ACTION.DELETE:
      return state.filter((t) => t.id !== action.payload);
    case ACTION.MOVE:
      return state.map((t) =>
        t.id === action.payload.id ? { ...t, status: action.payload.status } : t,
      );
    case ACTION.TOGGLE_SUBTASK:
      return state.map((t) => {
        if (t.id !== action.payload.taskId) return t;
        return {
          ...t,
          subtasks: t.subtasks.map((st) =>
            st.id === action.payload.subtaskId ? { ...st, completed: !st.completed } : st,
          ),
        };
      });
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(
    reducer,
    null,
    () => loadState('tasks', SEED_TASKS),
  );

  useEffect(() => {
    saveState('tasks', tasks);
  }, [tasks]);

  const addTask = (data) => {
    const task = {
      id: uid('task'),
      createdAt: new Date().toISOString(),
      assigneeId: 'user-1',
      status: 'todo',
      priority: 'medium',
      estimatedHours: 0,
      loggedHours: 0,
      subtasks: [],
      ...data,
    };
    dispatch({ type: ACTION.ADD, payload: task });
    return task;
  };

  const updateTask = (id, data) => {
    dispatch({ type: ACTION.UPDATE, payload: { id, ...data } });
  };

  const deleteTask = (id) => {
    dispatch({ type: ACTION.DELETE, payload: id });
  };

  const moveTask = (id, status) => {
    dispatch({ type: ACTION.MOVE, payload: { id, status } });
  };

  const toggleSubtask = (taskId, subtaskId) => {
    dispatch({ type: ACTION.TOGGLE_SUBTASK, payload: { taskId, subtaskId } });
  };

  const getTask = (id) => tasks.find((t) => t.id === id);

  const getTasksByProject = useCallback(
    (projectId) => tasks.filter((t) => t.projectId === projectId),
    [tasks],
  );

  const getTasksByStatus = useCallback(
    (status) => tasks.filter((t) => t.status === status),
    [tasks],
  );

  return (
    <TaskContext.Provider
      value={{
        tasks,
        addTask,
        updateTask,
        deleteTask,
        moveTask,
        toggleSubtask,
        getTask,
        getTasksByProject,
        getTasksByStatus,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
}
