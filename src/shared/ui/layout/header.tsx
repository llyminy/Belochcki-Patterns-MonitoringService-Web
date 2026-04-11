import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: "blur(10px)",
        background: "rgba(15, 23, 42, 0.88)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          minHeight: 72,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #60a5fa, #2563eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 800,
              fontSize: 18,
              boxShadow: "0 8px 24px rgba(37,99,235,0.35)",
            }}
          >
            M
          </Box>

          <Box>
            <Typography
              variant="h6"
              sx={{ color: "white", fontWeight: 800, lineHeight: 1.1 }}
            >
              Scum Bank Monitoring
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "rgba(255,255,255,0.72)" }}
            >
              Dashboard for service analytics
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            component={Link}
            to="/main"
            sx={{
              color: "white",
              px: 2,
              borderRadius: 2,
              backgroundColor:
                location.pathname === "/main"
                  ? "rgba(255,255,255,0.12)"
                  : "transparent",
            }}
          >
            Dashboard
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}