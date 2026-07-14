import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import Button from '../components/Button';
import { useSimulation } from '../hooks/useSimulation';

function formatWon(won: number): string {
  return won.toLocaleString('ko-KR');
}

export default function HealthInsuranceSimulationScreen() {
  const navigate = useNavigate();
  const { healthInsuranceSimulation, createHealthInsurance, isLoading, error } = useSimulation();

  const [monthlyIncome, setMonthlyIncome] = useState('');
  const [propertyValue, setPropertyValue] = useState('');
  const [carValue, setCarValue] = useState('');
  const [formError, setFormError] = useState<string | undefined>();

  const handleSubmit = async () => {
    setFormError(undefined);

    const incomeWon = Number(monthlyIncome) * 10000;
    const propertyWon = Number(propertyValue) * 10000;
    const carWon = Number(carValue) * 10000;

    if (!incomeWon || incomeWon <= 0) {
      setFormError('월 소득을 입력하세요');
      return;
    }

    try {
      await createHealthInsurance({
        monthlyIncome: incomeWon,
        propertyValue: propertyWon,
        carValue: carWon,
      });
    } catch {
      // hook에서 error 상태 관리
    }
  };

  const output = healthInsuranceSimulation?.outputData as
    | { estimatedMonthlyPremium: number; notice: string }
    | undefined;

  return (
    <div className="screen-content">
      <h2 className="card-title mb-8">건강보험료 시뮬레이션</h2>
      <p className="card-subtitle mb-16">은퇴 후 예상 건강보험료를 계산합니다.</p>

      <Input
        label="월 소득"
        type="number"
        value={monthlyIncome}
        onChange={(v) => setMonthlyIncome(v.replace(/[^0-9]/g, ''))}
        placeholder="예: 300"
        suffix="만원"
        error={formError}
      />
      <Input
        label="재산가액 (주택 등)"
        type="number"
        value={propertyValue}
        onChange={(v) => setPropertyValue(v.replace(/[^0-9]/g, ''))}
        placeholder="예: 50000"
        suffix="만원"
      />
      <Input
        label="차량가액"
        type="number"
        value={carValue}
        onChange={(v) => setCarValue(v.replace(/[^0-9]/g, ''))}
        placeholder="예: 3000"
        suffix="만원"
      />

      {error && <div className="form-error mb-8">{error}</div>}

      <Button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? '계산 중...' : '계산하기'}
      </Button>

      {output && (
        <div className="card mt-16">
          <div className="card-title">계산 결과</div>
          <div className="simulation-card">
            <span className="simulation-label">예상 월 보험료</span>
            <span className="simulation-delta">{formatWon(output.estimatedMonthlyPremium)}원</span>
          </div>
          <div className="simulation-card">
            <span className="simulation-label">연간 보험료</span>
            <span className="simulation-delta">{formatWon(output.estimatedMonthlyPremium * 12)}원</span>
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
