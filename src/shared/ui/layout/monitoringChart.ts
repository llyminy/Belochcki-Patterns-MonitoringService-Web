import type { MonitoringStatResponse } from "./monitoringApi";

export type MinuteChartPoint = {
  time: string;
  total2xx: number;
  total4xx: number;
  total5xx: number;
  details2xx: Record<string, number>;
  details4xx: Record<string, number>;
  details5xx: Record<string, number>;
};

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function formatMinuteLabel(date: Date) {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function increment(map: Record<string, number>, key: string) {
  map[key] = (map[key] ?? 0) + 1;
}

function getStatusGroup(status: number): "2xx" | "4xx" | "5xx" | null {
  if (status >= 200 && status < 300) return "2xx";
  if (status >= 400 && status < 500) return "4xx";
  if (status >= 500 && status < 600) return "5xx";
  return null;
}

export function buildMinuteChartData(
  logs: MonitoringStatResponse[],
  fromDateTime: string,
  toDateTime: string
): MinuteChartPoint[] {
  if (!fromDateTime || !toDateTime) return [];

  const from = new Date(fromDateTime);
  const to = new Date(toDateTime);

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
    return [];
  }

  if (to <= from) {
    return [];
  }

  const points: MinuteChartPoint[] = [];
  const cursor = new Date(from);

  cursor.setSeconds(0, 0);

  while (cursor <= to) {
    points.push({
      time: formatMinuteLabel(cursor),
      total2xx: 0,
      total4xx: 0,
      total5xx: 0,
      details2xx: {},
      details4xx: {},
      details5xx: {},
    });

    cursor.setMinutes(cursor.getMinutes() + 1);
  }

  const pointMap = new Map(points.map((point) => [point.time, point]));

  logs.forEach((log) => {
    const logDate = new Date(log.createdAt);

    if (logDate < from || logDate > to) {
      return;
    }

    const minuteLabel = formatMinuteLabel(logDate);
    const point = pointMap.get(minuteLabel);

    if (!point) return;

    const group = getStatusGroup(log.status);
    if (!group) return;

    const statusKey = String(log.status);

    if (group === "2xx") {
      point.total2xx += 1;
      increment(point.details2xx, statusKey);
    }

    if (group === "4xx") {
      point.total4xx += 1;
      increment(point.details4xx, statusKey);
    }

    if (group === "5xx") {
      point.total5xx += 1;
      increment(point.details5xx, statusKey);
    }
  });

  return points;
}

export function getDynamicYAxisMax(data: MinuteChartPoint[]) {
  const maxValue = Math.max(
    0,
    ...data.map((item) => Math.max(item.total2xx, item.total4xx, item.total5xx))
  );

  if (maxValue <= 10) return 10;
  if (maxValue <= 20) return 20;
  if (maxValue <= 50) return 50;
  if (maxValue <= 100) return 100;

  return Math.ceil(maxValue / 50) * 50;
}