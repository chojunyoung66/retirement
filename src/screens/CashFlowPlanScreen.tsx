import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDiagnosis } from '../hooks/useDiagnosis';
import { calculateLongTermProjection } from '../service/retirement-service';
import { formatWan } from '../utils/format';

const INFLATION_OPTIONS = [
  { label: '0%', value: 0 },
  { label: '2%', value: 0.02 },
  { label: '3%', value: 0.03 },
];

const PENSION_GROWTH_OPTIONS = [
  { label: '0%', value: 0 },
  { label: '1%', value: 0.01 },
  { label: '2%', value: 0.02 },
];

export default function CashFlowPlanScreen() {
  const navigate = useNavigate();
  const { state } = useDiagnosis();
  const [inflationRate, setInflationRate] = useState(0.02);
  const [pensionGrowthRate, setPensionGrowthRate] = useState(0.02);

  const data = useMemo(
    () => calculateLongTermProjection(state, 20, inflationRate, pensionGrowthRate),
    [state, inflationRate, pensionGrowthRate],
  );

  const lastYear = data[data.length - 1];
  const totalCumulative = lastYear?.cumulativeGap ?? 0;
  const positiveYears = data.filter((d) => d.monthlyGap >= 0).length;

  const maxAbs = useMemo(
    () => Math.max(...data.map((d) => Math.abs(d.cumulativeGap)), 1),
    [data],
  );

  if (!state.projection) {
    return (
      <div className="screen-content">
        <div className="card">
          <div className="card-title">진단 데이터가 없습니다</div>
          <div className="card-subtitle">진단을 먼저 완료해주세요.</div>
          <div className="mt-16">
            <button className="btn-cta" onClick={() => navigate('/diagnosis')}>
              진단 시작하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen-content">
      <div className="cfp-hero">
        <div className="cfp-hero-title">20년 현금 흐름 설계</div>
        <div className="cfp-hero-sub">은퇴 후 65세~84세까지의 재정 흐름을 시뮬레이션합니다</div>
      </div>

      {/* 가정 설정 */}
      <div className="card">
        <div className="card-title">시뮬레이션 가정</div>
        <div className="cfp-assumption-row">
          <span className="cfp-assumption-label">물가 상승률</span>
          <div className="cfp-chip-group">
            {INFLATION_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`cfp-chip ${inflationRate === opt.value ? 'cfp-chip-active' : ''}`}
                onClick={() => setInflationRate(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="cfp-assumption-row">
          <span className="cfp-assumption-label">연금 인상률</span>
          <div className="cfp-chip-group">
            {PENSION_GROWTH_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`cfp-chip ${pensionGrowthRate === opt.value ? 'cfp-chip-active' : ''}`}
                onClick={() => setPensionGrowthRate(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 20년 요약 지표 */}
      <div className="cfp-kpi-row">
        <div className="cfp-kpi-card">
          <div className="cfp-kpi-label">흑자 연도</div>
          <div className={`cfp-kpi-value ${positiveYears >= 15 ? 'result-positive' : positiveYears >= 10 ? '' : 'result-negative'}`}>
            {positiveYears}년
          </div>
          <div className="cfp-kpi-sub">/ 20년</div>
        </div>
        <div className="cfp-kpi-card">
          <div className="cfp-kpi-label">20년 누적 잔액</div>
          <div className={`cfp-kpi-value ${totalCumulative >= 0 ? 'result-positive' : 'result-negative'}`}>
            {totalCumulative >= 0 ? '+' : ''}{formatWan(Math.round(totalCumulative / 10000) * 10000)}
          </div>
          <div className="cfp-kpi-sub">연간 합산</div>
        </div>
      </div>

      {/* 누적 잔액 시각화 */}
      <div className="card">
        <div className="card-title">누적 잔액 추이</div>
        <div className="cfp-chart">
          {data.map((d) => {
            const pct = Math.min(100, (Math.abs(d.cumulativeGap) / maxAbs) * 100);
            const isPos = d.cumulativeGap >= 0;
            return (
              <div key={d.year} className="cfp-chart-row">
                <div className="cfp-chart-age">{d.age}세</div>
                <div className="cfp-chart-track">
                  <div
                    className={`cfp-chart-fill ${isPos ? 'cfp-chart-fill-pos' : 'cfp-chart-fill-neg'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className={`cfp-chart-val ${isPos ? 'result-positive' : 'result-negative'}`}>
                  {isPos ? '+' : ''}{formatWan(Math.round(d.cumulativeGap / 10000) * 10000)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 연도별 상세 테이블 */}
      <div className="card">
        <div className="card-title">연도별 현금 흐름 상세</div>
        <div className="cfp-table-wrap">
          <table className="cfp-table">
            <thead>
              <tr>
                <th>나이</th>
                <th>월 수입</th>
                <th>월 지출</th>
                <th>월 갭</th>
              </tr>
            </thead>
            <tbody>
              {data.map((d) => (
                <tr key={d.year}>
                  <td className="cfp-td-age">{d.age}세</td>
                  <td>{formatWan(d.monthlyIncome)}</td>
                  <td>{formatWan(d.monthlyExpense)}</td>
                  <td className={d.monthlyGap >= 0 ? 'result-positive' : 'result-negative'}>
                    {d.monthlyGap >= 0 ? '+' : ''}{formatWan(d.monthlyGap)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <button className="btn-back" style={{ width: '100%', marginBottom: 24 }} onClick={() => navigate('/result')}>
        ← 결과 화면으로
      </button>
    </div>
  );
}
