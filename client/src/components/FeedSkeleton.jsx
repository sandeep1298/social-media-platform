import { Box, Skeleton, SkeletonCircle, Stack, useColorModeValue } from "@chakra-ui/react";

export default function FeedSkeleton() {
  const cardBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.800");

  return (
    <Stack spacing={5}>
      {[1, 2, 3].map((item) => (
        <Box key={item} bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="lg" p={4}>
          <Stack spacing={4}>
            <Stack direction="row" align="center">
              <SkeletonCircle size="10" />
              <Stack flex="1">
                <Skeleton h="14px" w="140px" />
                <Skeleton h="12px" w="90px" />
              </Stack>
            </Stack>
            <Skeleton h="360px" borderRadius="lg" />
            <Skeleton h="16px" w="70%" />
            <Skeleton h="14px" w="45%" />
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}
