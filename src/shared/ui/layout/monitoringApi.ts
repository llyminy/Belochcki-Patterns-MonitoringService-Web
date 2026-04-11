export type ServiceType =
  | "AUTH_SERVICE"
  | "INFO_SERVICE"
  | "CORE_SERVICE"
  | "CREDIT_SERVICE";

export type MonitoringStatResponse = {
  id: string;
  serviceName: string;
  serviceType: ServiceType;
  traceId: string;
  method: string;
  path: string;
  status: number;
  timeMs: number;
  errorRate: number;
  message: string;
  createdAt: string;
};

export type MonitoringStatPageResponse = {
  data: MonitoringStatResponse[];
  page: number;
  size: number;
  count: number;
  totalElements: number;
};

export type ErrorRateStatResponse = {
  id: string;
  serviceName: string;
  serviceType: ServiceType;
  errorRate: number;
  time: string;
  message: string;
  createdAt: string;
};

export type ErrorRateStatPageResponse = {
  data: ErrorRateStatResponse[];
  page: number;
  size: number;
  count: number;
  totalElements: number;
};

const BASE_URL = "http://localhost:8090";

export async function getLogsByServiceType(
  serviceType: ServiceType,
  page = 0,
  size = 10000
): Promise<MonitoringStatPageResponse> {
  const response = await fetch(
    `${BASE_URL}/logs/getAll?serviceType=${serviceType}&page=${page}&size=${size}`
  );

  if (!response.ok) {
    throw new Error(`Ошибка загрузки данных: ${response.status}`);
  }

  return response.json();
}

export async function getErrorRateByServiceType(
  serviceType: ServiceType,
  page = 0,
  size = 10000
): Promise<ErrorRateStatPageResponse> {
  const response = await fetch(
    `${BASE_URL}/logs/errorRate?serviceType=${serviceType}&page=${page}&size=${size}`
  );

  if (!response.ok) {
    throw new Error(`Ошибка загрузки errorRate данных: ${response.status}`);
  }

  return response.json();
}