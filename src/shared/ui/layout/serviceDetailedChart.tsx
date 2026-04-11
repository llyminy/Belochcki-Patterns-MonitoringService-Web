import { Box, Paper, Stack, TextField, Typography, Divider } from "@mui/material";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo, useState } from "react";

import type { MonitoringStatResponse } from "../layout/monitoringApi";
import {
  buildMinuteChartData,
  getDynamicYAxisMax,
} from "../layout/monitoringChart";

type ServiceDetailedChartProps = {
  title: string;
  logs: MonitoringStatResponse[];
};

type CustomTooltipProps = {
  active?: boolean;
  payload?: Array<{ payload: any }>;
  label?: string;
};

function formatDateTimeLocal(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getDefaultFromDateTime() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - 30);
  now.setSeconds(0, 0);
  return formatDateTimeLocal(now);
}

function getDefaultToDateTime() {
  const now = new Date();
  now.setSeconds(0, 0);
  return formatDateTimeLocal(now);
}

function renderStatusDetails(title: string, details: Record<string, number>) {
  const entries = Object.entries(details).sort((a, b) => Number(a[0]) - Number(b[0]));

  if (entries.length === 0) return null;

  return (
    <Box sx={{ mt: 1 }}>
      <Typography variant="body2" sx={{ fontWeight: 700 }}>
        {title}
      </Typography>
      {entries.map(([status, count]) => (
        <Typography key={status} variant="body2">
          {status}: {count}
        </Typography>
      ))}
    </Box>
  );
}

function CustomChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <Paper
      elevation={4}
      sx={{
        p: 2,
        borderRadius: 2,
        minWidth: 180,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: 700, mb: 1 }}>
        Время: {label}
      </Typography>

      <Typography variant="body2">2xx: {point.total2xx}</Typography>
      <Typography variant="body2">4xx: {point.total4xx}</Typography>
      <Typography variant="body2">5xx: {point.total5xx}</Typography>

      {renderStatusDetails("Детали 2xx", point.details2xx)}
      {renderStatusDetails("Детали 4xx", point.details4xx)}
      {renderStatusDetails("Детали 5xx", point.details5xx)}
    </Paper>
  );
}

export const ServiceDetailedChart = ({
  title,
  logs,
}: ServiceDetailedChartProps) => {
  const [fromDateTime, setFromDateTime] = useState(getDefaultFromDateTime);
  const [toDateTime, setToDateTime] = useState(getDefaultToDateTime);

  const chartData = useMemo(() => {
    return buildMinuteChartData(logs, fromDateTime, toDateTime);
  }, [logs, fromDateTime, toDateTime]);

  const yAxisMax = useMemo(() => getDynamicYAxisMax(chartData), [chartData]);

  return (
    <Paper
    elevation={0}
        sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 5,
            background: "rgba(255,255,255,0.96)",
            border: "1px solid rgba(15,23,42,0.06)",
            boxShadow: "0 14px 36px rgba(15,23,42,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: 3,
        }}
    >
      <Stack
        direction={{ xs: "column", xl: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", xl: "center" }}
        spacing={3}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            График зависимости количества запросов по группам ошибок от времени
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{ width: { xs: "100%", xl: "auto" } }}
        >
          <TextField
            label="Дата и время от"
            type="datetime-local"
            size="small"
            value={fromDateTime}
            onChange={(e) => setFromDateTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 220 }}
          />

          <TextField
            label="Дата и время до"
            type="datetime-local"
            size="small"
            value={toDateTime}
            onChange={(e) => setToDateTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ minWidth: 220 }}
          />
        </Stack>
      </Stack>

      <Divider />

      <Box sx={{ width: "100%", height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="4 4" />
            <XAxis dataKey="time" minTickGap={20} />
            <YAxis domain={[0, yAxisMax]} />
            <Tooltip content={<CustomChartTooltip />} />
            <Legend />

            <Line
              type="linear"
              dataKey="total2xx"
              name="2xx"
              stroke="#2e7d32"
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />

            <Line
              type="linear"
              dataKey="total4xx"
              name="4xx"
              stroke="#ed6c02"
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />

            <Line
              type="linear"
              dataKey="total5xx"
              name="5xx"
              stroke="#d32f2f"
              strokeWidth={3}
              dot={{ r: 3 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};