import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  Stack,
  Text
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { Lock, Mail } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link as RouterLink, Navigate, useLocation, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../layouts/AuthLayout";
import { authApi, getErrorMessage } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, setAuthUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const emailError = useMemo(
    () => email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
    [email]
  );

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (user) => {
      setAuthUser(user);
      toast.success("Logged in successfully");
      navigate(location.state?.from?.pathname || "/", { replace: true });
    },
    onError: (error) => toast.error(getErrorMessage(error))
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (emailError || !email || !password) {
      toast.error("Enter a valid email and password.");
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <AuthLayout
      eyebrow="Welcome back"
      title="Log in"
      subtitle="Pick up your feed, conversations, and profile where you left off."
    >
      <Stack as="form" spacing={5} onSubmit={handleSubmit}>
        <FormControl isInvalid={emailError} isRequired>
          <FormLabel>Email</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Mail size={18} />
            </InputLeftElement>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </InputGroup>
          <FormErrorMessage>Enter a valid email address.</FormErrorMessage>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Lock size={18} />
            </InputLeftElement>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Your password"
            />
          </InputGroup>
        </FormControl>
        <Button type="submit" leftIcon={<Lock size={18} />} isLoading={loginMutation.isPending}>
          Login
        </Button>
        <HStack justify="space-between" fontSize="sm">
          <Link as={RouterLink} to="/signup" color="brand.500" fontWeight="800">
            Create account
          </Link>
          <Link as={RouterLink} to="/forgot-password" color="accent.600" fontWeight="800">
            Forgot password
          </Link>
        </HStack>
        <Text fontSize="xs" color="gray.500">
          Protected with JWT authentication.
        </Text>
      </Stack>
    </AuthLayout>
  );
}
