import {
  AspectRatio,
  Box,
  Button,
  HStack,
  Image,
  Text,
  useColorModeValue,
  VisuallyHidden
} from "@chakra-ui/react";
import { ImagePlus, Upload } from "lucide-react";
import { memo, useCallback, useEffect, useId, useState } from "react";
import toast from "react-hot-toast";

function FileUpload({ label = "Upload image", onFileSelect, previewUrl }) {
  const inputId = useId();
  const [fileName, setFileName] = useState("");
  const [localPreview, setLocalPreview] = useState("");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const muted = useColorModeValue("gray.500", "gray.400");
  const preview = localPreview || previewUrl;

  const handleChange = useCallback(
    (event) => {
      const file = event.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file.");
        return;
      }

      setFileName(file.name);
      setLocalPreview(URL.createObjectURL(file));
      onFileSelect(file);
    },
    [onFileSelect]
  );

  useEffect(
    () => () => {
      if (localPreview) {
        URL.revokeObjectURL(localPreview);
      }
    },
    [localPreview]
  );

  return (
    <Box>
      <VisuallyHidden>
        <input id={inputId} type="file" accept="image/*" onChange={handleChange} />
      </VisuallyHidden>
      <HStack spacing={3} align="center">
        <Button as="label" htmlFor={inputId} leftIcon={<Upload size={18} />} cursor="pointer" variant="outline">
          {label}
        </Button>
        <Text color={fileName ? undefined : muted} fontSize="sm" noOfLines={1}>
          {fileName || "No file selected"}
        </Text>
      </HStack>
      {preview ? (
        <AspectRatio ratio={4 / 3} mt={4} borderRadius="lg" overflow="hidden" borderWidth="1px" borderColor={borderColor}>
          <Image src={preview} alt="Selected upload preview" objectFit="cover" />
        </AspectRatio>
      ) : (
        <HStack
          mt={4}
          minH="96px"
          borderWidth="1px"
          borderColor={borderColor}
          borderStyle="dashed"
          borderRadius="lg"
          justify="center"
          color={muted}
        >
          <ImagePlus size={18} />
          <Text fontSize="sm">Preview appears here</Text>
        </HStack>
      )}
    </Box>
  );
}

export default memo(FileUpload);
