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
  Stack
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { Mail, User, UserPlus } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link as RouterLink, Navigate, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import AuthLayout from "../layouts/AuthLayout";
import { authApi, getErrorMessage } from "../services/api";

export default function Signup() {
  const navigate = useNavigate();
  const { isAuthenticated, setAuthUser } = useAuth();
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    username: ""
  });

  const errors = useMemo(
    () => ({
      email: form.email.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
      name: form.name.length > 0 && form.name.trim().length < 2,
      password: form.password.length > 0 && form.password.length < 6,
      username: form.username.length > 0 && form.username.trim().length < 3
    }),
    [form]
  );

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: (user) => {
      setAuthUser(user);
      toast.success("Account created successfully");
      navigate("/", { replace: true });
    },
    onError: (error) => toast.error(getErrorMessage(error))
  });

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const updateField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const hasErrors = Object.values(errors).some(Boolean);
    if (hasErrors || !form.email || !form.name || !form.password) {
      toast.error("Please complete the highlighted fields.");
      return;
    }

    signupMutation.mutate({
      email: form.email,
      name: form.name,
      password: form.password,
      username: form.username || undefined
    });
  };

  return (
    <AuthLayout
      eyebrow="Start fresh"
      title="Create account"
      subtitle="Set up a profile, share posts, and follow people from one clean workspace."
    >
      <Stack as="form" spacing={5} onSubmit={handleSubmit}>
        <FormControl isInvalid={errors.name} isRequired>
          <FormLabel>Name</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <User size={18} />
            </InputLeftElement>
            <Input value={form.name} onChange={updateField("name")} placeholder="Your name" />
          </InputGroup>
          <FormErrorMessage>Use at least 2 characters.</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.username}>
          <FormLabel>Username</FormLabel>
          <Input value={form.username} onChange={updateField("username")} placeholder="creatorname" />
          <FormErrorMessage>Use at least 3 characters.</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.email} isRequired>
          <FormLabel>Email</FormLabel>
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Mail size={18} />
            </InputLeftElement>
            <Input
              type="email"
              value={form.email}
              onChange={updateField("email")}
              placeholder="you@example.com"
            />
          </InputGroup>
          <FormErrorMessage>Enter a valid email address.</FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={errors.password} isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            value={form.password}
            onChange={updateField("password")}
            placeholder="At least 6 characters"
          />
          <FormErrorMessage>Use at least 6 characters.</FormErrorMessage>
        </FormControl>
        <Button type="submit" leftIcon={<UserPlus size={18} />} isLoading={signupMutation.isPending}>
          Sign Up
        </Button>
        <HStack justify="center" fontSize="sm">
          <Mail size={16} />
          <Link as={RouterLink} to="/login" color="brand.500" fontWeight="800">
            Already have an account?
          </Link>
        </HStack>
      </Stack>
    </AuthLayout>
  );
}
