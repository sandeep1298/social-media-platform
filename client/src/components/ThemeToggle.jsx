import { IconButton, Tooltip, useColorMode } from "@chakra-ui/react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { colorMode, toggleColorMode } = useColorMode();
  const isDark = colorMode === "dark";

  return (
    <Tooltip label={isDark ? "Switch to light mode" : "Switch to dark mode"}>
      <IconButton
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        icon={isDark ? <Sun size={18} /> : <Moon size={18} />}
        onClick={toggleColorMode}
        variant="ghost"
      />
    </Tooltip>
  );
}
