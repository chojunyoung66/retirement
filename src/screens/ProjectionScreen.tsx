import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useDiagnosis } from '../hooks/useDiagnosis';
import { useSavedPlan } from '../hooks/useSavedPlan';
import ProgressBar from '../components/ProgressBar';
import Button from '../components/Button';
import SummaryCard from '../components/SummaryCard';
import { formatWan } from '../utils/format';
import { showToast } from '../store/toast-slice';
import type { AppDispatch } from '../store/store';

export default function ProjectionScreen() {
  const navigate = useNavigate();
  const { state, dispatch: diagnosisDispatch } = useDiagnosis();
  const dispatch = useDispatch<AppDispatch>();
  const { save } = useSavedPlan();

  const projection = state.projection;

  const chartValues = useMemo(() => {
    if (!projection) return null;
    const max = Math.max(projection.totalIncome, projection.totalExpense, 1);
    return {
      incomePct: (projection.totalIncome / max) * 100,
      expensePct: (projection.totalExpense / max) * 100,
      gapPct: Math.min(100, (Math.abs(projection.gap) / max) * 100),
    };
  }, [projection]);

  if (!projection || !chartValues) {
    return (
      <>
        <ProgressBar progress={100} />
        <div className="screen-content">
          <div className="card">
            <div className="card-title">진단 데이터가 없습니다</div>
            <div className="card-subtitle">진단을 처음부터 시작해주세요.</div>
            <div className="mt-16">
              <Button onClick={() => navigate('/diagnosis')}>진단 시작하기</Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const isNegative = projection.gap < 0;
  const gapLabel = isNegative ? '월 부족액' : '월 여유금액';

  const handleSave = () => {
    save(state);
    dispatch(showToast('진단 결과를 저장했어요'));
    navigate('/summary');
  };

  const handleRestart = () => {
    diagnosisDispatch({ type: 'RESET' });
    navigate('/diagnosis');
  };

  return (
    <>
      <ProgressBar progress={100} />
      <div className="screen-content">
        <div className="big-gap">
          <div className="big-gap-label">{gapLabel}</div>
          <div className={`big-gap-value ${isNegative ? 'result-negative' : 'result-positive'}`}>
            {isNegative ? '-' : '+'}
            {formatWan(Math.abs(projection.gap))}
          </div>
        </div>

        <div className="card">
          <div className="card-title">월 현금흐름</div>
          <div className="bar-chart">
            <div className="bar-row">
              <div className="bar-header">
                <span>수입</span>
                <span>{formatWan(projection.totalIncome)}</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill bar-fill-income"
                  style={{ width: `${chartValues.incomePct}%` }}
                />
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-header">
                <span>지출</span>
                <span>{formatWan(projection.totalExpense)}</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill bar-fill-expense"
                  style={{ width: `${chartValues.expensePct}%` }}
                />
              </div>
            </div>
            <div className="bar-row">
              <div className="bar-header">
                <span>{gapLabel}</span>
                <span>{formatWan(Math.abs(projection.gap))}</span>
              </div>
              <div className="bar-track">
                <div
                  className={`bar-fill ${isNegative ? 'bar-fill-gap-neg' : 'bar-fill-gap-pos'}`}
                  style={{ width: `${chartValues.gapPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-title">수입 세부</div>
          {projection.incomeItems.length === 0 ? (
            <div className="card-subtitle">등록된 수입이 없어요.</div>
          ) : (
            projection.incomeItems.map((item) => (
              <div key={item.label} className="item-row">
                <span className="item-row-label">{item.label}</span>
                <span className="item-row-value">{formatWan(item.amount)}</span>
              </div>
            ))
          )}
        </div>

        <div className="card">
          <div className="card-title">지출 세부</div>
          {projection.expenseItems.length === 0 ? (
            <div className="card-subtitle">등록된 지출이 없어요.</div>
          ) : (
            projection.expenseItems.map((item) => (
              <div key={item.label} className="item-row">
                <span className="item-row-label">{item.label}</span>
                <span className="item-row-value">{formatWan(item.amount)}</span>
              </div>
            ))
          )}
        </div>

        {projection.causeAnalysis.length > 0 && (
          <div className="card">
            <div className="card-title">부족 원인 분석</div>
            {projection.causeAnalysis.map((cause) => (
              <div key={cause.cause} className="item-row">
                <span className="item-row-label">{cause.cause}</span>
                <span className="item-row-value">{cause.weight}%</span>
              </div>
            ))}
          </div>
        )}

        <div className="card">
          <div className="card-title">개선 시뮬레이션</div>
          {projection.simulations.map((sim) => (
            <div key={sim.label} className="simulation-card">
              <span className="simulation-label">{sim.label}</span>
              <span className="simulation-delta">+{formatWan(sim.delta)}</span>
            </div>
          ))}
        </div>

        <SummaryCard
          label="가구 유형"
          value={state.diagnosisType === 'couple' ? '부부' : '개인'}
        />

        <button
          className="btn-cta"
          style={{ marginBottom: 12, background: 'var(--primary-dark)' }}
          onClick={() => navigate('/cashflow-plan')}
        >
          📊 20년 현금 흐름 설계 보기
        </button>

        <div className="button-row">
          <button className="btn-back" onClick={handleRestart}>
            다시 계산
          </button>
          <Button onClick={handleSave}>결과 저장하기</Button>
        </div>
      </div>
    </>
  );
}
