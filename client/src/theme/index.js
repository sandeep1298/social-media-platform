import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false
  },
  fonts: {
    heading: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif",
    body: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
  },
  colors: {
    gray: {
      950: "#080b12"
    },
    brand: {
      50: "#fff1f0",
      100: "#ffd9d4",
      200: "#ffafa7",
      300: "#ff8277",
      400: "#f65b51",
      500: "#dd3f37",
      600: "#b8312b",
      700: "#8e2925",
      800: "#6d2421",
      900: "#411716"
    },
    accent: {
      50: "#e9fbf8",
      100: "#c7f3ec",
      200: "#91e3d5",
      300: "#58cbb9",
      400: "#28ad9b",
      500: "#158879",
      600: "#126d62",
      700: "#11584f",
      800: "#104741",
      900: "#0d2b28"
    }
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.950" : "gray.50",
        color: props.colorMode === "dark" ? "gray.100" : "gray.800",
        letterSpacing: "0"
      },
      a: {
        color: "inherit"
      },
      "button, input, textarea, select": {
        letterSpacing: "0"
      }
    })
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "lg",
        fontWeight: "700"
      },
      defaultProps: {
        colorScheme: "brand"
      }
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: "lg"
        }
      }
    },
    Input: {
      defaultProps: {
        focusBorderColor: "brand.400"
      }
    },
    Textarea: {
      defaultProps: {
        focusBorderColor: "brand.400"
      }
    }
  }
});

export default theme;
