import { Outlet } from "react-router-dom";
import Container from "@mui/material/Container";
import Header from "./Header";

export default function Layout() {
  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ py: { xs: 3, sm: 4 } }}>
        <Outlet />
      </Container>
    </>
  );
}