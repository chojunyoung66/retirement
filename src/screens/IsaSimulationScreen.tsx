import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useSimulation } from '../hooks/useSimulation';

function formatWan(won: number): string {
  return `${Math.round(won / 10000).toLocaleString('ko-KR')}만원`;
}

export default function IsaSimulationScreen() {
  const navigate = useNavigate();
  const { isaSimulation, createIsa, isLoading, error } = useSimulation();

  const [annualContribution, setAnnualContribution] = useState('');
  const [expectedReturnRate, setExpectedReturnRate] = useState('');
  const [investmentYears, setInvestmentYears] = useState('');
  const [formError, setFormError] = useState<string | undefined>();

  const handleSubmit = async () => {
    setFormError(undefined);

    const contributionWon = Number(annualContribution) * 10000;
    const rate = Number(expectedReturnRate);
    const years = Number(investmentYears);

    if (!contributionWon || contributionWon <= 0) {
      setFormError('연간 납입액을 입력하세요');
      return;
    }
    if (!rate || rate <= 0 || rate > 30) {
      setFormError('기대 수익률은 0 초과 30 이하여야 합니다');
      return;
    }
    if (!Number.isInteger(years) || years < 1 || years > 50) {
      setFormError('투자 기간은 1~50년 사이 정수입니다');
      return;
    }

    try {
      await createIsa({
        annualContribution: contributionWon,
        expectedReturnRate: rate,
        investmentYears: years,
      });
    } catch {
      // hook에서 error 상태 관리
    }
  };

  const output = isaSimulation?.outputData as
    | { expectedProfit: number; estimatedTaxSaving: number; notice: string }
    | undefined;

  return (
    <div className="screen-content">
      <h2 className="card-title mb-8">ISA 시뮬레이션</h2>
      <p className="card-subtitle mb-16">ISA 계좌의 예상 수익과 절세 효과를 확인하세요.</p>

      <Input
        label="연간 납입액"
        type="number"
        value={annualContribution}
        onChange={(v) => setAnnualContribution(v.replace(/[^0-9]/g, ''))}
        placeholder="예: 2000"
        suffix="만원"
        error={formError}
      />
      <Input
        label="기대 수익률"
        type="number"
        value={expectedReturnRate}
        onChange={(v) => setExpectedReturnRate(v.replace(/[^0-9.]/g, ''))}
        placeholder="예: 5"
        suffix="%"
      />
      <Input
        label="투자 기간"
        type="number"
        value={investmentYears}
        onChange={(v) => setInvestmentYears(v.replace(/[^0-9]/g, ''))}
        placeholder="예: 10"
        suffix="년"
      />

      {error && <div className="form-error mb-8">{error}</div>}

      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? '계산 중...' : '계산하기'}
      </Button>

      {output && (
        <div className="card mt-16">
          <div className="card-title">계산 결과</div>
          <div className="simulation-card">
            <span className="simulation-label">예상 수익</span>
            <span className="simulation-delta">{formatWan(output.expectedProfit)}</span>
          </div>
          <div className="simulation-card">
            <span className="simulation-label">예상 절세액</span>
            <span className="simulation-delta">{formatWan(output.estimatedTaxSaving)}</span>
          </div>
          <p className="form-hint mt-8">{output.notice}</p>
        </div>
      )}

      <div className="mt-16">
        <button className="btn-back" onClick={() => navigate('/simulation')}>
          뒤로
        </button>
      </div>
    </div>
  );
}
