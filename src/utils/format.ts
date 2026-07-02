export function formatWan(amount: number): string {
  if (amount === 0) return '0만원';
  const wan = Math.round(amount / 10000);
  return `${wan.toLocaleString()}만원`;
}

export function formatAge(birthYear: number): number {
  return new Date().getFullYear() - birthYear + 1;
}

export function formatYearsToRetirement(birthYear: number): number {
  const retirementAge = 65;
  const currentAge = formatAge(birthYear);
  return Math.max(0, retirementAge - currentAge);
}
