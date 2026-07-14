import { useCallback, useState } from 'react';
import {
  createHealthInsuranceSimulation,
  getLatestHealthInsuranceSimulation,
  createIsaSimulation,
  getLatestIsaSimulation,
  type Simulation,
  type HealthInsuranceInput,
  type IsaInput,
} from '../api/simulation-api';
import { ApiError } from '../api/client';

export function useSimulation() {
  const [healthInsuranceSimulation, setHealthInsuranceSimulation] = useState<Simulation | null>(null);
  const [isaSimulation, setIsaSimulation] = useState<Simulation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 건강보험 시뮬레이션 생성
  const createHealthInsurance = useCallback(
    async (inputData: HealthInsuranceInput) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await createHealthInsuranceSimulation(inputData);
        setHealthInsuranceSimulation(result);
        return result;
      } catch (err) {
        const message = err instanceof ApiError
          ? `생성 실패: ${err.errorCode}`
          : '건강보험 시뮬레이션 생성 중 오류가 발생했습니다';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 최신 건강보험 시뮬레이션 조회
  const fetchLatestHealthInsurance = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getLatestHealthInsuranceSimulation();
      setHealthInsuranceSimulation(result);
      return result;
    } catch (err) {
      const message = err instanceof ApiError
        ? `조회 실패: ${err.errorCode}`
        : '건강보험 시뮬레이션 조회 중 오류가 발생했습니다';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ISA 시뮬레이션 생성
  const createIsa = useCallback(
    async (inputData: IsaInput) => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await createIsaSimulation(inputData);
        setIsaSimulation(result);
        return result;
      } catch (err) {
        const message = err instanceof ApiError
          ? `생성 실패: ${err.errorCode}`
          : 'ISA 시뮬레이션 생성 중 오류가 발생했습니다';
        setError(message);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // 최신 ISA 시뮬레이션 조회
  const fetchLatestIsa = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getLatestIsaSimulation();
      setIsaSimulation(result);
      return result;
    } catch (err) {
      const message = err instanceof ApiError
        ? `조회 실패: ${err.errorCode}`
        : 'ISA 시뮬레이션 조회 중 오류가 발생했습니다';
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    healthInsuranceSimulation,
    isaSimulation,
    isLoading,
    error,
    createHealthInsurance,
    fetchLatestHealthInsurance,
    createIsa,
    fetchLatestIsa,
  };
}
