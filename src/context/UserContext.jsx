import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { loadState, saveState } from '../utils/storage';
import { SEED_PROFILE, SEED_ROLES } from '../utils/seedData';
import { uid } from '../utils/uid';

const UserContext = createContext();

const ACTION = {
  SET_PROFILE: 'SET_PROFILE',
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  SET_ROLES: 'SET_ROLES',
  ADD_ROLE: 'ADD_ROLE',
  UPDATE_ROLE: 'UPDATE_ROLE',
  DELETE_ROLE: 'DELETE_ROLE',
};

function profileReducer(state, action) {
  switch (action.type) {
    case ACTION.SET_PROFILE:
      return action.payload;
    case ACTION.UPDATE_PROFILE:
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

function rolesReducer(state, action) {
  switch (action.type) {
    case ACTION.SET_ROLES:
      return action.payload;
    case ACTION.ADD_ROLE:
      return [...state, action.payload];
    case ACTION.UPDATE_ROLE:
      return state.map((r) => (r.id === action.payload.id ? { ...r, ...action.payload } : r));
    case ACTION.DELETE_ROLE:
      return state.filter((r) => r.id !== action.payload);
    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const [profile, dispatchProfile] = useReducer(
    profileReducer,
    null,
    () => loadState('profile', SEED_PROFILE),
  );

  const [roles, dispatchRoles] = useReducer(
    rolesReducer,
    null,
    () => loadState('roles', SEED_ROLES),
  );

  useEffect(() => {
    saveState('profile', profile);
  }, [profile]);

  useEffect(() => {
    saveState('roles', roles);
  }, [roles]);

  const updateProfile = (data) => {
    dispatchProfile({ type: ACTION.UPDATE_PROFILE, payload: data });
  };

  const addRole = (data) => {
    const role = {
      id: uid('role'),
      createdAt: new Date().toISOString(),
      isActive: true,
      endDate: null,
      ...data,
    };
    dispatchRoles({ type: ACTION.ADD_ROLE, payload: role });
    return role;
  };

  const updateRole = (id, data) => {
    dispatchRoles({ type: ACTION.UPDATE_ROLE, payload: { id, ...data } });
  };

  const deleteRole = (id) => {
    dispatchRoles({ type: ACTION.DELETE_ROLE, payload: id });
  };

  const getRole = useCallback(
    (id) => roles.find((r) => r.id === id),
    [roles],
  );

  const getActiveRoles = useCallback(
    () => roles.filter((r) => r.isActive),
    [roles],
  );

  const getCompanies = useCallback(() => {
    const companyMap = {};
    roles.forEach((r) => {
      if (!companyMap[r.company]) {
        companyMap[r.company] = { name: r.company, roles: [] };
      }
      companyMap[r.company].roles.push(r);
    });
    return Object.values(companyMap);
  }, [roles]);

  return (
    <UserContext.Provider
      value={{
        profile,
        roles,
        updateProfile,
        addRole,
        updateRole,
        deleteRole,
        getRole,
        getActiveRoles,
        getCompanies,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error('useUser must be used within UserProvider');
  return ctx;
}
