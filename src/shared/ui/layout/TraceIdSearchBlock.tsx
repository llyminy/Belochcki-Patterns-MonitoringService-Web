import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import {
  getLogsByTraceId,
  type MonitoringStatResponse,
} from "./monitoringApi";

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getStatusColor(status: number) {
  if (status >= 500) return "error";
  if (status >= 400) return "warning";
  if (status >= 200) return "success";
  return "default";
}

export const TraceIdSearchBlock = () => {
  const [traceId, setTraceId] = useState("");
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<MonitoringStatResponse[]>([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const normalizedTraceId = traceId.trim();

    if (!normalizedTraceId) {
      setError("Введите traceId");
      setLogs([]);
      setSearched(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await getLogsByTraceId(normalizedTraceId, 0, 100);

      const sortedLogs = [...response.data].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setLogs(sortedLogs);
      setSearched(true);
    } catch (e) {
      console.error("Ошибка поиска по traceId", e);
      setError("Не удалось выполнить поиск по traceId");
      setLogs([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        backgroundColor: "#fff",
      }}
    >
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Поиск по Trace ID
          </Typography>
        </Box>

        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          alignItems={{ xs: "stretch", md: "center" }}
        >
          <TextField
            fullWidth
            label="Trace ID"
            value={traceId}
            onChange={(event) => setTraceId(event.target.value)}
            onKeyDown={handleKeyDown}
            size="small"
          />

          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            sx={{
              minWidth: { xs: "100%", md: 160 },
              height: 40,
              fontWeight: 700,
            }}
          >
            {loading ? "Поиск..." : "Найти"}
          </Button>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}

        {searched && !error && logs.length === 0 && (
          <Alert severity="info">По этому traceId ничего не найдено</Alert>
        )}

        <TableContainer
          sx={{
            maxHeight: 340,
            overflowY: "auto",
            overflowX: "auto",
            border: "1px solid #e5e7eb",
            borderRadius: 2,
          }}
        >
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "#fff", fontWeight: 700 }}>
                  Время
                </TableCell>
                <TableCell sx={{ backgroundColor: "#fff", fontWeight: 700 }}>
                  Метод
                </TableCell>
                <TableCell sx={{ backgroundColor: "#fff", fontWeight: 700 }}>
                  Service
                </TableCell>
                <TableCell sx={{ backgroundColor: "#fff", fontWeight: 700 }}>
                  Path
                </TableCell>
                <TableCell sx={{ backgroundColor: "#fff", fontWeight: 700 }}>
                  Status
                </TableCell>
                <TableCell sx={{ backgroundColor: "#fff", fontWeight: 700 }}>
                  Trace ID
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id} hover>
                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    {formatDate(log.createdAt)}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap", fontWeight: 600 }}>
                    {log.method}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap"}}>
                    <Chip
                    label={log.serviceName}
                    size="small"
                    sx={{ fontWeight: 600, backgroundColor: "#fff"}}
                    />
                </TableCell>

                  <TableCell
                    sx={{
                      maxWidth: 320,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={log.path}
                  >
                    {log.path}
                  </TableCell>

                  <TableCell sx={{ whiteSpace: "nowrap" }}>
                    <Chip
                      label={log.status}
                      color={getStatusColor(log.status)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>

                  <TableCell
                    sx={{
                      maxWidth: 260,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontFamily: "monospace",
                      fontSize: "0.75rem",
                    }}
                    title={log.traceId}
                  >
                    {log.traceId}
                  </TableCell>
                </TableRow>
              ))}

              {searched && logs.length === 0 && !error && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ py: 2 }}
                    >
                      Нет данных для отображения
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Paper>
  );
};