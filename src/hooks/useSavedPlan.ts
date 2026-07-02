import { getLocalStorage, setLocalStorage } from '../utils/local-storage';
import type { DiagnosisState } from '../domain/plan';

export function useSavedPlan() {
  const save = (state: DiagnosisState) => setLocalStorage('retirement_plan', state);
  const load = (): DiagnosisState | null => getLocalStorage('retirement_plan');
  return { save, load };
}
