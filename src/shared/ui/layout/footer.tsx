import { Box, Container, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box
      sx={{
        mt: "auto",
        borderTop: "1px solid rgba(15, 23, 42, 0.08)",
        backgroundColor: "rgba(255,255,255,0.7)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            py: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Scum Bank Monitoring
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Service analytics dashboard
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}