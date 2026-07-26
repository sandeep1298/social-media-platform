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
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { getErrorMessage, uploadImage } from "../services/api";
import FileUpload from "./FileUpload";

export default function EditProfileModal({ isLoading, isOpen, onClose, onSubmit, user }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="lg">
      <ModalOverlay />
      <ModalContent borderRadius="lg">
        <ModalHeader>Edit profile</ModalHeader>
        <ModalCloseButton />
        {isOpen && user ? (
          <EditProfileForm
            key={user._id}
            isLoading={isLoading}
            onClose={onClose}
            onSubmit={onSubmit}
            user={user}
          />
        ) : null}
      </ModalContent>
    </Modal>
  );
}

function EditProfileForm({ isLoading, onClose, onSubmit, user }) {
  const [bio, setBio] = useState(user.bio || "");
  const [image, setImage] = useState(null);
  const [name, setName] = useState(user.name || "");
  const [username, setUsername] = useState(user.username || "");
  const [isUploading, setIsUploading] = useState(false);

  const errors = useMemo(
    () => ({
      bio: bio.length > 160,
      name: name.trim().length > 0 && name.trim().length < 2,
      username: username.trim().length > 0 && username.trim().length < 3
    }),
    [bio, name, username]
  );

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name.trim() || !username.trim()) {
      toast.error("Name and username are required.");
      return;
    }

    try {
      setIsUploading(true);
      const profilePic = image ? await uploadImage(image) : user.profilePic || "";
      await onSubmit({
        bio: bio.trim(),
        name: name.trim(),
        profilePic,
        username: username.trim().toLowerCase()
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
          <FormControl isInvalid={errors.name} isRequired>
            <FormLabel>Name</FormLabel>
            <Input value={name} onChange={(event) => setName(event.target.value)} />
            <FormErrorMessage>Use at least 2 characters.</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.username} isRequired>
            <FormLabel>Username</FormLabel>
            <Input value={username} onChange={(event) => setUsername(event.target.value)} />
            <FormErrorMessage>Use at least 3 characters.</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={errors.bio}>
            <FormLabel>Bio</FormLabel>
            <Textarea value={bio} onChange={(event) => setBio(event.target.value)} rows={4} />
            <FormErrorMessage>Bio must be 160 characters or fewer.</FormErrorMessage>
          </FormControl>
          <FileUpload label="Profile picture" previewUrl={user.profilePic} onFileSelect={setImage} />
        </Stack>
      </ModalBody>
      <ModalFooter>
        <Button type="submit" isLoading={isLoading || isUploading}>
          Save
        </Button>
      </ModalFooter>
    </form>
  );
}
