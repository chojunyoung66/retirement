import type { DiagnosisState, ProjectionResult } from '../domain/plan';

export interface WelcomeMetrics {
  averageMonthlyPension: number;
  completedDiagnoses: number;
  accuracyRate: number;
}

export interface LivingExpenseGuide {
  minimum: number;
  recommended: number;
}

export function getWelcomeMetrics(): WelcomeMetrics {
  return {
    averageMonthlyPension: 1870000,
    completedDiagnoses: 1240000,
    accuracyRate: 98,
  };
}

export function getLivingExpenseGuide(
  diagnosisType: string,
  householdSize: number,
): LivingExpenseGuide {
  if (diagnosisType === 'couple') {
    const guides: Record<number, LivingExpenseGuide> = {
      1: { minimum: 1500000, recommended: 2000000 },
      2: { minimum: 2000000, recommended: 2800000 },
      3: { minimum: 2500000, recommended: 3400000 },
      4: { minimum: 3000000, recommended: 4000000 },
      5: { minimum: 3500000, recommended: 4600000 },
    };
    return guides[householdSize] ?? guides[2];
  }
  return { minimum: 1200000, recommended: 1800000 };
}

export function calculateProjection(state: DiagnosisState): ProjectionResult {
  const totalIncome =
    state.pension.national + state.pension.retirement + state.pension.personal;
  const totalExpense =
    state.livingExpense.desiredMonthly +
    state.medicalExpense.healthInsurance +
    state.medicalExpense.privateInsurance;
  const gap = totalIncome - totalExpense;

  const incomeItems = [
    { label: '국민연금', amount: state.pension.national },
    { label: '퇴직연금', amount: state.pension.retirement },
    { label: '개인연금', amount: state.pension.personal },
  ].filter((i) => i.amount > 0);

  const expenseItems = [
    { label: '생활비', amount: state.livingExpense.desiredMonthly },
    { label: '건강보험료', amount: state.medicalExpense.healthInsurance },
    { label: '민영보험료', amount: state.medicalExpense.privateInsurance },
  ].filter((i) => i.amount > 0);

  const causeAnalysis =
    gap < 0
      ? [
          { cause: '연금 수입 부족', weight: 60 },
          { cause: '생활비 설정', weight: 40 },
        ]
      : [];

  const simulations = [
    { label: '생활비 30만원 ↓', delta: 300000 },
    { label: '연금 수입 30만원 ↑', delta: 300000 },
    { label: '보험료 10만원 ↓', delta: 100000 },
  ];

  return {
    totalIncome,
    totalExpense,
    gap,
    incomeItems,
    expenseItems,
    causeAnalysis,
    simulations,
  };
}

export interface YearlyProjection {
  year: number;
  age: number;
  monthlyIncome: number;
  monthlyExpense: number;
  monthlyGap: number;
  cumulativeGap: number;
}

export function calculateLongTermProjection(
  state: DiagnosisState,
  years = 20,
  inflationRate = 0.02,
  pensionGrowthRate = 0.02,
): YearlyProjection[] {
  const retirementAge = 65;
  const baseIncome =
    state.pension.national + state.pension.retirement + state.pension.personal;
  const baseExpense =
    state.livingExpense.desiredMonthly +
    state.medicalExpense.healthInsurance +
    state.medicalExpense.privateInsurance;

  const result: YearlyProjection[] = [];
  let cumulative = 0;

  for (let i = 0; i < years; i++) {
    const inflationFactor = Math.pow(1 + inflationRate, i);
    const pensionFactor = Math.pow(1 + pensionGrowthRate, i);
    const monthlyIncome = Math.round(baseIncome * pensionFactor);
    const monthlyExpense = Math.round(baseExpense * inflationFactor);
    const monthlyGap = monthlyIncome - monthlyExpense;
    cumulative += monthlyGap * 12;

    result.push({
      year: i + 1,
      age: retirementAge + i,
      monthlyIncome,
      monthlyExpense,
      monthlyGap,
      cumulativeGap: cumulative,
    });
  }
  return result;
}
