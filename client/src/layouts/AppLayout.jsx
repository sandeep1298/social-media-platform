import { Box, Container, useColorModeValue } from "@chakra-ui/react";
import { Outlet } from "react-router";
import Sidebar from "../components/Sidebar";

export default function AppLayout() {
  const bg = useColorModeValue("gray.50", "gray.950");

  return (
    <Box minH="100vh" bg={bg}>
      <Sidebar />
      <Box ml={{ base: 0, lg: "260px" }} minH="100vh">
        <Container maxW="6xl" px={{ base: 4, md: 6 }} py={{ base: 5, md: 8 }}>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
}
