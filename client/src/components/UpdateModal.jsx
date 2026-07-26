import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Textarea
} from "@chakra-ui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import FileUpload from "./FileUpload";
import { getErrorMessage, uploadImage } from "../services/api";

export default function UpdateModal({ isLoading, isOpen, onClose, onSubmit, post }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent borderRadius="lg">
        <ModalHeader>Edit post</ModalHeader>
        <ModalCloseButton />
        {isOpen && post ? (
          <UpdatePostForm
            key={post._id}
            isLoading={isLoading}
            onClose={onClose}
            onSubmit={onSubmit}
            post={post}
          />
        ) : null}
      </ModalContent>
    </Modal>
  );
}

function UpdatePostForm({ isLoading, onClose, onSubmit, post }) {
  const [body, setBody] = useState(post.body || "");
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState(post.title || "");
  const [isUploading, setIsUploading] = useState(false);

  const hasTitleError = title.trim().length > 0 && title.trim().length < 2;
  const hasBodyError = body.trim().length > 0 && body.trim().length < 2;

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!title.trim() || !body.trim()) {
      toast.error("Title and caption are required.");
      return;
    }

    try {
      setIsUploading(true);
      const photo = image ? await uploadImage(image) : post.photo;
      await onSubmit({
        postId: post._id,
        postDetails: {
          body: body.trim(),
          photo,
          title: title.trim()
        }
      });
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <ModalBody>
        <Stack spacing={5}>
          <FormControl isInvalid={hasTitleError} isRequired>
            <FormLabel>Title</FormLabel>
            <Input value={title} onChange={(event) => setTitle(event.target.value)} />
            <FormErrorMessage>Use at least 2 characters.</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={hasBodyError} isRequired>
            <FormLabel>Caption</FormLabel>
            <Textarea value={body} onChange={(event) => setBody(event.target.value)} rows={4} />
            <FormErrorMessage>Use at least 2 characters.</FormErrorMessage>
          </FormControl>
          <FileUpload label="Replace image" previewUrl={post.photo} onFileSelect={setImage} />
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button type="submit" isLoading={isLoading || isUploading}>
          Update
        </Button>
      </ModalFooter>
    </form>
  );
}
