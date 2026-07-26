import { Center, Spinner } from "@chakra-ui/react";

export function Loader() {
	return (
		<Center minH="100vh">
			<Spinner color="brand.500" size="xl" thickness="4px" />
		</Center>
	)
}
