import { Box, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMemo, useState } from "react";

import type { ErrorRateStatResponse } from "../layout/monitoringApi";
import {
  buildErrorRateChartData,
  getDynamicPercentYAxisMax,
} from "../layout/errorRateChart";

type ServiceErrorRateChartProps = {
  title: string;
  logs: ErrorRateStatResponse[];
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

function CustomPercentTooltip({ active, payload, label }: CustomTooltipProps) {
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

      <Typography variant="body2">
        Процент ошибок: {point.errorRate.toFixed(2)}%
      </Typography>

      <Typography variant="body2" sx={{ mt: 1 }} color="text.secondary">
        Полная дата: {new Date(point.rawTime).toLocaleString()}
      </Typography>
    </Paper>
  );
}

export const ServiceErrorRateChart = ({
  title,
  logs,
}: ServiceErrorRateChartProps) => {
  const [fromDateTime, setFromDateTime] = useState(getDefaultFromDateTime);
  const [toDateTime, setToDateTime] = useState(getDefaultToDateTime);

  const chartData = useMemo(() => {
    return buildErrorRateChartData(logs, fromDateTime, toDateTime);
  }, [logs, fromDateTime, toDateTime]);

  const yAxisMax = useMemo(
    () => getDynamicPercentYAxisMax(chartData),
    [chartData]
  );

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
            График зависимости процента ошибок от времени
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
            <Tooltip content={<CustomPercentTooltip />} />
            <Line
              type="linear"
              dataKey="errorRate"
              name="Error Rate %"
              stroke="#7c3aed"
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