import { Box, Container, Grid, GridItem, Heading, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function AuthLayout({ children, eyebrow, title, subtitle }) {
  const panelRef = useRef(null);
  const bg = useColorModeValue("gray.50", "gray.950");
  const panelBg = useColorModeValue("white", "gray.900");
  const textColor = useColorModeValue("gray.700", "gray.300");

  useEffect(() => {
    gsap.fromTo(
      panelRef.current,
      { autoAlpha: 0, y: 18 },
      { autoAlpha: 1, y: 0, duration: 0.55, ease: "power3.out" }
    );
  }, []);

  return (
    <Box minH="100vh" bg={bg}>
      <Grid minH="100vh" templateColumns={{ base: "1fr", lg: "0.88fr 1.12fr" }}>
        <GridItem
          display={{ base: "none", lg: "flex" }}
          bgGradient="linear(to-br, brand.500, accent.600)"
          color="white"
          alignItems="center"
          px={16}
        >
          <Stack spacing={6} maxW="420px">
            <Text fontSize="sm" fontWeight="800" textTransform="uppercase">
              {eyebrow}
            </Text>
            <Heading size="2xl" lineHeight="1.05">
              Social Media
            </Heading>
            <Text fontSize="lg" color="whiteAlpha.900">
              {subtitle}
            </Text>
          </Stack>
        </GridItem>
        <GridItem display="flex" alignItems="center">
          <Container maxW="md" py={10}>
            <Stack ref={panelRef} spacing={7}>
              <Stack spacing={2}>
                <Text display={{ base: "block", lg: "none" }} fontSize="sm" fontWeight="800" color="brand.500">
                  Social Media
                </Text>
                <Heading size="xl">{title}</Heading>
                <Text color={textColor}>{subtitle}</Text>
              </Stack>
              <Box
                bg={panelBg}
                borderWidth="1px"
                borderColor={useColorModeValue("gray.200", "gray.800")}
                borderRadius="lg"
                boxShadow={useColorModeValue("0 20px 60px rgba(20, 20, 20, 0.08)", "none")}
                p={{ base: 5, md: 7 }}
              >
                {children}
              </Box>
            </Stack>
          </Container>
        </GridItem>
      </Grid>
    </Box>
  );
}
