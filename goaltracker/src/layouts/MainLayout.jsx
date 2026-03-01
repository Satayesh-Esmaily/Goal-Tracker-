import { Container } from "@mui/material";
import Navbar from "../components/navbar/Navbar"
export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4 }}>
        <Outlet />
      </Container>
    </>
  );
}