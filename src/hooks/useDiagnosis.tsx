import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from 'react';
import type { DiagnosisState } from '../domain/plan';
import { setLocalStorage } from '../utils/local-storage';
import { calculateProjection } from '../service/retirement-service';

const initialState: DiagnosisState = {
  diagnosisType: 'individual',
  householdSize: 2,
  birthYear: null,
  incomeStatus: '',
  pension: { national: 0, retirement: 0, personal: 0 },
  livingExpense: { desiredMonthly: 0, guideMinimum: 0, guideRecommended: 0 },
  medicalExpense: { healthInsurance: 0, privateInsurance: 0 },
  projection: null,
};

type Action =
  | { type: 'UPDATE'; payload: Partial<DiagnosisState> }
  | { type: 'CALCULATE' }
  | { type: 'UPDATE_AND_CALCULATE'; payload: Partial<DiagnosisState> }
  | { type: 'RESET' };

function reducer(state: DiagnosisState, action: Action): DiagnosisState {
  switch (action.type) {
    case 'UPDATE': {
      const next = { ...state, ...action.payload };
      setLocalStorage('retirement_plan', next);
      return next;
    }
    case 'CALCULATE': {
      const projection = calculateProjection(state);
      const next = { ...state, projection };
      setLocalStorage('retirement_plan', next);
      return next;
    }
    case 'UPDATE_AND_CALCULATE': {
      const updated = { ...state, ...action.payload };
      const projection = calculateProjection(updated);
      const next = { ...updated, projection };
      setLocalStorage('retirement_plan', next);
      return next;
    }
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}

interface DiagnosisContextValue {
  state: DiagnosisState;
  dispatch: Dispatch<Action>;
}

const DiagnosisContext = createContext<DiagnosisContextValue | null>(null);

export function DiagnosisProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <DiagnosisContext.Provider value={{ state, dispatch }}>
      {children}
    </DiagnosisContext.Provider>
  );
}

export function useDiagnosis(): DiagnosisContextValue {
  const ctx = useContext(DiagnosisContext);
  if (!ctx) throw new Error('useDiagnosis must be used within DiagnosisProvider');
  return ctx;
}
