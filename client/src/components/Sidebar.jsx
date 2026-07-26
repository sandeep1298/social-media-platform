import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
  Tooltip,
  useColorModeValue,
  useDisclosure
} from "@chakra-ui/react";
import { gsap } from "gsap";
import { Compass, Home, LogOut, Menu, PlusSquare, Search, User } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

const navItems = [
  { label: "Home", path: "/", icon: Home },
  { label: "Search", path: "/search", icon: Search },
  { label: "Create Post", path: "/createpost", icon: PlusSquare },
  { label: "Profile", path: "/profile", icon: User }
];

function SidebarContent({ onNavigate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const panelRef = useRef(null);
  const { logout, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const subtleText = useColorModeValue("gray.500", "gray.400");

  useEffect(() => {
    gsap.fromTo(
      panelRef.current,
      { x: -18, autoAlpha: 0 },
      { x: 0, autoAlpha: 1, duration: 0.45, ease: "power3.out" }
    );
  }, []);

  const handleLogout = useCallback(() => {
    setIsLoggingOut(true);
    window.setTimeout(() => {
      logout();
      setIsLoggingOut(false);
      navigate("/login");
    }, 180);
  }, [logout, navigate]);

  return (
    <Flex ref={panelRef} direction="column" h="full" py={5}>
      <HStack px={5} pb={6} spacing={3}>
        <Flex
          align="center"
          justify="center"
          w="42px"
          h="42px"
          borderRadius="lg"
          bg="brand.500"
          color="white"
        >
          <Compass size={22} />
        </Flex>
        <Box>
          <Text fontSize="lg" fontWeight="900">
            Social Media
          </Text>
          <Text fontSize="sm" color={subtleText}>
            @{user?.username || "creator"}
          </Text>
        </Box>
      </HStack>

      <Stack spacing={1} px={3} flex="1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Button
              key={item.path}
              as={RouterLink}
              to={item.path}
              onClick={onNavigate}
              justifyContent="flex-start"
              leftIcon={<Icon size={19} />}
              variant={isActive ? "solid" : "ghost"}
              colorScheme={isActive ? "brand" : "gray"}
              h="44px"
            >
              {item.label}
            </Button>
          );
        })}
      </Stack>

      <Stack borderTopWidth="1px" borderColor={borderColor} px={3} pt={4} spacing={2}>
        <HStack px={2} py={2}>
          <Avatar name={user?.name} src={user?.profilePic || ""} size="sm" />
          <Box minW={0}>
            <Text fontWeight="800" noOfLines={1}>
              {user?.name}
            </Text>
            <Text fontSize="sm" color={subtleText} noOfLines={1}>
              {user?.email}
            </Text>
          </Box>
        </HStack>
        <HStack justify="space-between">
          <ThemeToggle />
          <Tooltip label="Logout">
            <IconButton
              aria-label="Logout"
              icon={<LogOut size={18} />}
              isLoading={isLoggingOut}
              onClick={handleLogout}
              variant="ghost"
            />
          </Tooltip>
        </HStack>
      </Stack>
    </Flex>
  );
}

export default function Sidebar() {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const bg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.800");

  return (
    <>
      <Flex
        display={{ base: "flex", lg: "none" }}
        position="sticky"
        top="0"
        zIndex="sticky"
        align="center"
        justify="space-between"
        px={4}
        py={3}
        bg={bg}
        borderBottomWidth="1px"
        borderColor={borderColor}
      >
        <HStack spacing={3}>
          <IconButton aria-label="Open navigation" icon={<Menu size={20} />} onClick={onOpen} variant="ghost" />
          <Text fontWeight="900">Social Media</Text>
        </HStack>
        <ThemeToggle />
      </Flex>

      <Box
        display={{ base: "none", lg: "block" }}
        position="fixed"
        insetY="0"
        left="0"
        w="260px"
        bg={bg}
        borderRightWidth="1px"
        borderColor={borderColor}
      >
        <SidebarContent />
      </Box>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent maxW="280px">
          <DrawerBody p={0}>
            <SidebarContent onNavigate={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
