import { Outlet } from "react-router-dom";
import { Box, Container } from "@mui/material";
import Header from "./header";
import Footer from "./footer";

export default function MainLayout() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background:
          "linear-gradient(180deg, #f4f7fb 0%, #eef3f9 45%, #f8fafc 100%)",
      }}
    >
      <Header />

      <Box sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="xl">
          <Outlet />
        </Container>
      </Box>

      <Footer />
    </Box>
  );
}