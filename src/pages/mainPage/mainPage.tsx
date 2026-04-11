import { useEffect, useState } from "react";
import {
  Box,
  Stack,
  Typography,
  Paper,
  Grid,
  Chip,
} from "@mui/material";
import { ServiceDetailedChart } from "../../shared/ui/layout/serviceDetailedChart";
import { ServiceErrorRateChart } from "../../shared/ui/layout/serviceErrorRateChart";
import {
  getLogsByServiceType,
  getErrorRateByServiceType,
} from "../../shared/ui/layout/monitoringApi";

import type {
  MonitoringStatResponse,
  ErrorRateStatResponse,
  ServiceType,
} from "../../shared/ui/layout/monitoringApi";

type ServiceConfig = {
  key: ServiceType;
  title: string;
  color: string;
};

const services: ServiceConfig[] = [
  { key: "AUTH_SERVICE", title: "auth-service", color: "#2563eb" },
  { key: "INFO_SERVICE", title: "info-service", color: "#7c3aed" },
  { key: "CORE_SERVICE", title: "core-service", color: "#0f766e" },
  { key: "CREDIT_SERVICE", title: "credit-service", color: "#dc2626" },
];

type LogsState = Record<ServiceType, MonitoringStatResponse[]>;
type ErrorRateState = Record<ServiceType, ErrorRateStatResponse[]>;

const initialLogsState: LogsState = {
  AUTH_SERVICE: [],
  INFO_SERVICE: [],
  CORE_SERVICE: [],
  CREDIT_SERVICE: [],
};

const initialErrorRateState: ErrorRateState = {
  AUTH_SERVICE: [],
  INFO_SERVICE: [],
  CORE_SERVICE: [],
  CREDIT_SERVICE: [],
};

export const MainPage = () => {
  const [logsByService, setLogsByService] = useState<LogsState>(initialLogsState);
  const [errorRateByService, setErrorRateByService] =
    useState<ErrorRateState>(initialErrorRateState);

  useEffect(() => {
    services.forEach(async (service) => {
      try {
        const response = await getLogsByServiceType(service.key, 0, 1000);

        setLogsByService((prev) => ({
          ...prev,
          [service.key]: response.data,
        }));
      } catch (error) {
        console.error(`Ошибка загрузки логов для ${service.key}`, error);
      }
    });

    services.forEach(async (service) => {
      try {
        const response = await getErrorRateByServiceType(service.key, 0, 1000);

        setErrorRateByService((prev) => ({
          ...prev,
          [service.key]: response.data,
        }));
      } catch (error) {
        console.error(`Ошибка загрузки errorRate для ${service.key}`, error);
      }
    });
  }, []);

  const totalLogs = Object.values(logsByService).reduce(
    (acc, logs) => acc + logs.length,
    0
  );

  const total5xx = Object.values(logsByService)
    .flat()
    .filter((log) => log.status >= 500 && log.status < 600).length;

  const avgTime = (() => {
    const allLogs = Object.values(logsByService).flat();
    if (allLogs.length === 0) return 0;

    const totalTime = allLogs.reduce((acc, log) => acc + log.timeMs, 0);
    return Math.round(totalTime / allLogs.length);
  })();

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          background:
            "#1976d2",
          color: "white",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(15,23,42,0.25)",
        }}
      >

        <Stack spacing={2} sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              maxWidth: 780,
              fontSize: { xs: "2rem", md: "2.8rem" },
            }}
          >
            Сервис мониторинга
          </Typography>

          <Typography
            variant="body1"
            sx={{
              maxWidth: 820,
              color: "rgba(255,255,255,0.82)",
              fontSize: "1rem",
            }}
          >
          </Typography>
        </Stack>
      </Paper>

      <Stack spacing={5}>
        {services.map((service) => (
          <Box key={service.key}>
            <Box sx={{ mb: 1.5, px: 0.5 }}>
              <Chip
                label={service.title}
                sx={{
                  fontWeight: 700,
                  color: service.color,
                  backgroundColor: "white",
                  border: `1px solid ${service.color}22`,
                }}
              />
            </Box>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 6 }}>
                <ServiceDetailedChart
                  title={`${service.title}`}
                  logs={logsByService[service.key]}
                />
              </Grid>

              <Grid size={{ xs: 12, lg: 6 }}>
                <ServiceErrorRateChart
                  title={`${service.title}`}
                  logs={errorRateByService[service.key]}
                />
              </Grid>
            </Grid>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};