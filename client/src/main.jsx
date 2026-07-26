import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { BrowserRouter as Router } from "react-router";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";
import theme from "./theme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Router>
            <App />
            <Toaster
              position="top-right"
              reverseOrder={false}
              toastOptions={{
                duration: 3200,
                style: {
                  background: "#171923",
                  borderRadius: "8px",
                  color: "#fff"
                }
              }}
            />
          </Router>
        </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </StrictMode>
);
