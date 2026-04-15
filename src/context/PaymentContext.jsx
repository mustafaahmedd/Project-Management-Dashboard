import { createContext, useContext, useReducer, useEffect } from 'react';
import { loadState, saveState } from '../utils/storage';
import { uid } from '../utils/uid';

const PaymentContext = createContext();

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
      return state.map((p) => (p.id === action.payload.id ? { ...p, ...action.payload } : p));
    case ACTION.DELETE:
      return state.filter((p) => p.id !== action.payload);
    default:
      return state;
  }
}

const SEED_PAYMENTS = [
  {
    id: 'pay-1',
    projectId: 'proj-1',
    clientName: 'FHS Technologies',
    description: 'E-Commerce Platform — Phase 1 delivery',
    amount: 2500,
    currency: 'USD',
    status: 'received',
    type: 'freelance',
    date: '2026-03-15',
    dueDate: '2026-03-20',
    createdAt: '2026-03-15T10:00:00Z',
  },
  {
    id: 'pay-2',
    projectId: 'proj-2',
    clientName: 'CloudSync Inc',
    description: 'API Integration Module',
    amount: 1800,
    currency: 'USD',
    status: 'pending',
    type: 'freelance',
    date: '2026-04-01',
    dueDate: '2026-04-15',
    createdAt: '2026-04-01T09:00:00Z',
  },
  {
    id: 'pay-3',
    projectId: null,
    clientName: 'Personal',
    description: 'Monthly salary — April',
    amount: 5000,
    currency: 'USD',
    status: 'received',
    type: 'salary',
    date: '2026-04-01',
    dueDate: null,
    createdAt: '2026-04-01T08:00:00Z',
  },
];

export function PaymentProvider({ children }) {
  const [payments, dispatch] = useReducer(
    reducer,
    null,
    () => loadState('payments', SEED_PAYMENTS),
  );

  useEffect(() => {
    saveState('payments', payments);
  }, [payments]);

  const addPayment = (data) => {
    const payment = {
      id: uid('pay'),
      status: 'pending',
      type: 'freelance',
      currency: 'USD',
      createdAt: new Date().toISOString(),
      ...data,
    };
    dispatch({ type: ACTION.ADD, payload: payment });
    return payment;
  };

  const updatePayment = (id, data) => {
    dispatch({ type: ACTION.UPDATE, payload: { id, ...data } });
  };

  const deletePayment = (id) => {
    dispatch({ type: ACTION.DELETE, payload: id });
  };

  const getPaymentsByProject = (projectId) =>
    payments.filter((p) => p.projectId === projectId);

  const getTotalReceived = () =>
    payments.filter((p) => p.status === 'received').reduce((sum, p) => sum + p.amount, 0);

  const getTotalPending = () =>
    payments.filter((p) => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <PaymentContext.Provider
      value={{
        payments,
        addPayment,
        updatePayment,
        deletePayment,
        getPaymentsByProject,
        getTotalReceived,
        getTotalPending,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}

export function usePayments() {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error('usePayments must be used within PaymentProvider');
  return ctx;
}
