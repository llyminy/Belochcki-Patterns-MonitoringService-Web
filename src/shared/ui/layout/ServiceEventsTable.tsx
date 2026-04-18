import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  Stack,
  Box,
} from "@mui/material";
import type { MonitoringStatResponse } from "./monitoringApi";

type Props = {
  title: string;
  logs: MonitoringStatResponse[];
  limit?: number;
  height?: number;
};

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
  });
}

function getStatusColor(status: number) {
  if (status >= 500) return "error";
  if (status >= 400) return "warning";
  if (status >= 200) return "success";
  return "default";
}

export const ServiceEventsTable = ({
  title,
  logs,
  limit = 30,
  height = 340,
}: Props) => {
  const sortedLogs = [...logs]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, limit);

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        backgroundColor: "#fff",
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: "1px solid #e5e7eb",
          minHeight: 56,
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
          Последние события
        </Typography>

        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Stack>

      <TableContainer
        sx={{
          height,
          overflowY: "auto",
          overflowX: "auto",
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
            {sortedLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>
                  <Box sx={{ py: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Пока нет данных
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              sortedLogs.map((log) => (
                <TableRow key={log.id} hover>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                        {formatDate(log.createdAt)}
                    </TableCell>

                    <TableCell sx={{ whiteSpace: "nowrap", fontWeight: 600 }}>
                        {log.method}
                    </TableCell>

                    <TableCell
                        sx={{
                        maxWidth: 300,
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
                        maxWidth: 220,
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
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};