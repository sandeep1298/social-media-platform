import { Button, Link, Stack, Text } from "@chakra-ui/react";
import { ArrowLeft } from "lucide-react";
import { Link as RouterLink } from "react-router";
import AuthLayout from "../layouts/AuthLayout";

export default function ForgotPassword() {
  return (
    <AuthLayout
      eyebrow="Account access"
      title="Forgot password"
      subtitle="Password reset is ready for the UI and can be wired once the backend email flow is added."
    >
      <Stack spacing={5}>
        <Text color="gray.500">
          This app does not expose a password reset endpoint yet, so this screen keeps the route in place without pretending to send an email.
        </Text>
        <Button as={RouterLink} to="/login" variant="outline" leftIcon={<ArrowLeft size={18} />}>
          Back to Login
        </Button>
        <Link as={RouterLink} to="/signup" color="brand.500" fontWeight="800" textAlign="center">
          Create a new account
        </Link>
      </Stack>
    </AuthLayout>
  );
}
