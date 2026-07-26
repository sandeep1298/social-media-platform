import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
  useColorModeValue
} from "@chakra-ui/react";
import { ImagePlus } from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import FileUpload from "../components/FileUpload";
import PageTransition from "../components/PageTransition";
import { usePosts } from "../hooks/usePosts";
import { getErrorMessage, uploadImage } from "../services/api";

export default function CreatePost() {
  const navigate = useNavigate();
  const { createPostMutation } = usePosts();
  const [body, setBody] = useState("");
  const [image, setImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [title, setTitle] = useState("");
  const cardBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.800");

  const errors = useMemo(
    () => ({
      body: body.length > 0 && body.trim().length < 2,
      title: title.length > 0 && title.trim().length < 2
    }),
    [body, title]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !body.trim() || !image) {
      toast.error("Add a title, caption, and image.");
      return;
    }

    try {
      setIsUploading(true);
      const photo = await uploadImage(image);
      await createPostMutation.mutateAsync({
        body: body.trim(),
        photo,
        title: title.trim()
      });
      toast.success("Post created");
      navigate("/");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <PageTransition>
      <Stack spacing={6} maxW="720px" mx="auto">
        <Stack spacing={1}>
          <Heading size="lg">Create Post</Heading>
          <Text color="gray.500">Share a new photo with a clear title and caption.</Text>
        </Stack>
        <Box bg={cardBg} borderWidth="1px" borderColor={borderColor} borderRadius="lg" p={{ base: 5, md: 7 }}>
          <Stack as="form" spacing={5} onSubmit={handleSubmit}>
            <FormControl isInvalid={errors.title} isRequired>
              <FormLabel>Title</FormLabel>
              <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" />
              <FormErrorMessage>Use at least 2 characters.</FormErrorMessage>
            </FormControl>
            <FormControl isInvalid={errors.body} isRequired>
              <FormLabel>Caption</FormLabel>
              <Textarea value={body} onChange={(event) => setBody(event.target.value)} rows={5} placeholder="Write a caption" />
              <FormErrorMessage>Use at least 2 characters.</FormErrorMessage>
            </FormControl>
            <FileUpload onFileSelect={setImage} />
            <Button type="submit" leftIcon={<ImagePlus size={18} />} isLoading={isUploading || createPostMutation.isPending}>
              Publish
            </Button>
          </Stack>
        </Box>
      </Stack>
    </PageTransition>
  );
}
