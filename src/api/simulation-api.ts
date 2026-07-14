import { isAxiosError } from 'axios';
import z from 'zod';
import client, { ApiError } from './client';

// 시뮬레이션 데이터 스키마
const simulationSchema = z.object({
  id: z.number(),
  userId: z.number(),
  type: z.enum(['HEALTH_INSURANCE', 'ISA']),
  inputData: z.record(z.unknown()),
  outputData: z.record(z.unknown()),
  createdAt: z.string().or(z.date()),
});

// 건강보험 시뮬레이션 입력 스키마
const healthInsuranceInputSchema = z.object({
  income: z.number(),
});

// ISA 시뮬레이션 입력 스키마
const isaInputSchema = z.object({
  amount: z.number(),
});

export type Simulation = z.infer<typeof simulationSchema>;
export type HealthInsuranceInput = z.infer<typeof healthInsuranceInputSchema>;
export type IsaInput = z.infer<typeof isaInputSchema>;

// 건강보험 시뮬레이션 생성
export const createHealthInsuranceSimulation = async (
  inputData: HealthInsuranceInput
): Promise<Simulation> => {
  try {
    const res = await client.post('/simulations/health-insurance', { inputData });
    const parsed = simulationSchema.safeParse(res.data.data);
    if (!parsed.success) {
      throw new Error('유효하지 않은 응답 형식입니다');
    }
    return parsed.data;
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      throw new ApiError(err.response?.data?.code || 'UNKNOWN_ERROR');
    }
    throw err;
  }
};

// 최신 건강보험 시뮬레이션 조회
export const getLatestHealthInsuranceSimulation = async (): Promise<Simulation> => {
  try {
    const res = await client.get('/simulations/health-insurance/latest');
    const parsed = simulationSchema.safeParse(res.data.data);
    if (!parsed.success) {
      throw new Error('유효하지 않은 응답 형식입니다');
    }
    return parsed.data;
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      throw new ApiError(err.response?.data?.code || 'UNKNOWN_ERROR');
    }
    throw err;
  }
};

// ISA 시뮬레이션 생성
export const createIsaSimulation = async (
  inputData: IsaInput
): Promise<Simulation> => {
  try {
    const res = await client.post('/simulations/isa', { inputData });
    const parsed = simulationSchema.safeParse(res.data.data);
    if (!parsed.success) {
      throw new Error('유효하지 않은 응답 형식입니다');
    }
    return parsed.data;
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      throw new ApiError(err.response?.data?.code || 'UNKNOWN_ERROR');
    }
    throw err;
  }
};

// 최신 ISA 시뮬레이션 조회
export const getLatestIsaSimulation = async (): Promise<Simulation> => {
  try {
    const res = await client.get('/simulations/isa/latest');
    const parsed = simulationSchema.safeParse(res.data.data);
    if (!parsed.success) {
      throw new Error('유효하지 않은 응답 형식입니다');
    }
    return parsed.data;
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      throw new ApiError(err.response?.data?.code || 'UNKNOWN_ERROR');
    }
    throw err;
  }
};
