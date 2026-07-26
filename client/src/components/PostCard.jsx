import {
  AspectRatio,
  Box,
  Button,
  HStack,
  IconButton,
  Image,
  Input,
  Stack,
  Text,
  Tooltip,
  useColorModeValue
} from "@chakra-ui/react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Pencil, Send, Trash2 } from "lucide-react";
import { memo, useCallback, useMemo, useState } from "react";
import { Link as RouterLink } from "react-router";
import UserAvatar from "./UserAvatar";

const normalizeId = (id) => id?.toString();

function PostCard({
  currentUser,
  isActionLoading,
  isLikeLoading,
  onComment,
  onDelete,
  onEdit,
  onLike,
  onUnlike,
  post
}) {
  const [comment, setComment] = useState("");
  const cardBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.800");
  const muted = useColorModeValue("gray.500", "gray.400");
  const comments = post?.comments || [];
  const likes = (post?.likes || []).map(normalizeId);
  const isLiked = likes.includes(normalizeId(currentUser?._id));
  const isOwner = normalizeId(post?.postedBy?._id || post?.postedBy) === normalizeId(currentUser?._id);
  const postCreatedAt = post?.createdAt;

  const createdAt = useMemo(() => {
    if (!postCreatedAt) return "";
    return formatDistanceToNow(new Date(postCreatedAt), { addSuffix: true });
  }, [postCreatedAt]);

  const submitComment = useCallback(
    (event) => {
      event.preventDefault();
      if (!comment.trim()) return;
      onComment(post._id, comment.trim());
      setComment("");
    },
    [comment, onComment, post._id]
  );

  return (
    <Box
      as={motion.article}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      bg={cardBg}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="lg"
      overflow="hidden"
      boxShadow={useColorModeValue("0 16px 45px rgba(20, 20, 20, 0.06)", "none")}
    >
      <HStack p={4} justify="space-between">
        <HStack spacing={3} minW={0}>
          <UserAvatar user={post?.postedBy} />
          <Box minW={0}>
            <Box
              as={RouterLink}
              to={`/users/${post?.postedBy?._id}`}
              display="block"
              _hover={{ textDecoration: "none", color: "brand.500" }}
            >
              <Text fontWeight="900" noOfLines={1}>
                {post?.postedBy?.name || "Unknown user"}
              </Text>
            </Box>
            <Text fontSize="sm" color={muted}>
              @{post?.postedBy?.username || "creator"} {createdAt ? `- ${createdAt}` : ""}
            </Text>
          </Box>
        </HStack>
        {isOwner ? (
          <HStack spacing={1}>
            <Tooltip label="Edit post">
              <IconButton aria-label="Edit post" icon={<Pencil size={17} />} variant="ghost" onClick={() => onEdit(post)} />
            </Tooltip>
            <Tooltip label="Delete post">
              <IconButton
                aria-label="Delete post"
                icon={<Trash2 size={17} />}
                variant="ghost"
                colorScheme="red"
                isLoading={isActionLoading}
                onClick={() => onDelete(post._id)}
              />
            </Tooltip>
          </HStack>
        ) : null}
      </HStack>

      <AspectRatio ratio={1}>
        <Image src={post?.photo} alt={post?.title} objectFit="cover" />
      </AspectRatio>

      <Stack p={4} spacing={4}>
        <HStack spacing={3}>
          <Tooltip label={isLiked ? "Unlike" : "Like"}>
            <IconButton
              as={motion.button}
              whileTap={{ scale: 0.85 }}
              aria-label={isLiked ? "Unlike post" : "Like post"}
              icon={<Heart size={21} fill={isLiked ? "currentColor" : "none"} />}
              color={isLiked ? "brand.500" : undefined}
              variant="ghost"
              isLoading={isLikeLoading}
              isDisabled={isLikeLoading}
              onClick={() => (isLiked ? onUnlike(post) : onLike(post))}
            />
          </Tooltip>
          <HStack color={muted} spacing={1}>
            <MessageCircle size={18} />
            <Text fontWeight="700">{comments.length}</Text>
          </HStack>
          <Text fontWeight="800">{likes.length} {likes.length === 1 ? "like" : "likes"}</Text>
        </HStack>

        <Box>
          <Text fontSize="lg" fontWeight="900">
            {post?.title}
          </Text>
          <Text color={useColorModeValue("gray.700", "gray.300")}>{post?.body}</Text>
        </Box>

        {comments.length ? (
          <Stack spacing={2}>
            {comments.slice(-3).map((item) => (
              <Text key={item._id} fontSize="sm">
                <Text as="span" fontWeight="900">
                  {item?.postedBy?.username || item?.postedBy?.name || "user"}
                </Text>{" "}
                {item.text}
              </Text>
            ))}
          </Stack>
        ) : null}

        <HStack as="form" onSubmit={submitComment} spacing={2}>
          <Input
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Add a comment"
            borderRadius="lg"
          />
          <Button type="submit" px={4} isDisabled={!comment.trim()} isLoading={isActionLoading}>
            <Send size={18} />
          </Button>
        </HStack>
      </Stack>
    </Box>
  );
}

export default memo(PostCard);
