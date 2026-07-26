import { Flex, Heading, Text, useColorModeValue } from "@chakra-ui/react";

export default function EmptyState({ icon, title, description }) {
  const color = useColorModeValue("gray.500", "gray.400");

  return (
    <Flex direction="column" align="center" justify="center" minH="260px" textAlign="center" color={color} gap={3}>
      {icon}
      <Heading size="md" color={useColorModeValue("gray.700", "gray.200")}>
        {title}
      </Heading>
      <Text maxW="360px">{description}</Text>
    </Flex>
  );
}
