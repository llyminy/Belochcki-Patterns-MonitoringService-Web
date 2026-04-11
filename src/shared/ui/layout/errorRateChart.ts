import type { ErrorRateStatResponse } from "../layout/monitoringApi";

export type ErrorRateChartPoint = {
  time: string;
  errorRate: number;
  rawTime: string;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatMinuteLabel(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function buildErrorRateChartData(
  logs: ErrorRateStatResponse[],
  fromDateTime: string,
  toDateTime: string
): ErrorRateChartPoint[] {
  if (!fromDateTime || !toDateTime) return [];

  const from = new Date(fromDateTime);
  const to = new Date(toDateTime);

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return [];
  }

  if (to <= from) {
    return [];
  }

  return logs
    .filter((log) => {
      const logDate = new Date(log.time);
      return logDate >= from && logDate <= to;
    })
    .sort(
      (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
    )
    .map((log) => ({
      time: formatMinuteLabel(new Date(log.time)),
      errorRate: Number(log.errorRate),
      rawTime: log.time,
    }));
}

export function getDynamicPercentYAxisMax(data: ErrorRateChartPoint[]) {
  const maxValue = Math.max(0, ...data.map((item) => item.errorRate));

  if (maxValue <= 10) return 10;
  if (maxValue <= 20) return 20;
  if (maxValue <= 50) return 50;
  if (maxValue <= 100) return 100;

  return Math.ceil(maxValue / 10) * 10;
}