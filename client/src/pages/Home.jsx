import { Heading, HStack, SimpleGrid, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { Camera } from "lucide-react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import EmptyState from "../components/EmptyState";
import FeedSkeleton from "../components/FeedSkeleton";
import PageTransition from "../components/PageTransition";
import PostCard from "../components/PostCard";
import UpdateModal from "../components/UpdateModal";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../hooks/usePosts";
import { getErrorMessage } from "../services/api";

export default function Home() {
  const { user } = useAuth();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [selectedPost, setSelectedPost] = useState(null);
  const {
    commentMutation,
    deletePostMutation,
    likePostMutation,
    postsQuery,
    unlikePostMutation,
    updatePostMutation
  } = usePosts({ sort: "recent" });

  const posts = postsQuery.data || [];

  const openEdit = useCallback(
    (post) => {
      setSelectedPost(post);
      onOpen();
    },
    [onOpen]
  );

  const handleComment = useCallback(
    (postId, text) => {
      commentMutation.mutate(
        { postId, text },
        { onError: (error) => toast.error(getErrorMessage(error)) }
      );
    },
    [commentMutation]
  );

  const handleDelete = useCallback(
    (postId) => {
      deletePostMutation.mutate(postId, {
        onSuccess: () => toast.success("Post deleted"),
        onError: (error) => toast.error(getErrorMessage(error))
      });
    },
    [deletePostMutation]
  );

  const handleUpdate = useCallback(
    (payload) =>
      updatePostMutation.mutateAsync(payload, {
        onSuccess: () => toast.success("Post updated")
      }),
    [updatePostMutation]
  );

  return (
    <PageTransition>
      <Stack spacing={6}>
        <HStack justify="space-between" align="flex-end">
          <Stack spacing={1}>
            <Heading size="lg">Home</Heading>
            <Text color="gray.500">Latest posts from the community.</Text>
          </Stack>
        </HStack>

        {postsQuery.isLoading ? (
          <FeedSkeleton />
        ) : posts.length ? (
          <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={5} alignItems="start">
            {posts.map((post) => (
              <PostCard
                key={post._id}
                currentUser={user}
                post={post}
                isActionLoading={deletePostMutation.isPending || commentMutation.isPending}
                isLikeLoading={likePostMutation.isPending || unlikePostMutation.isPending}
                onComment={handleComment}
                onDelete={handleDelete}
                onEdit={openEdit}
                onLike={(targetPost) => likePostMutation.mutate(targetPost, { onError: (error) => toast.error(getErrorMessage(error)) })}
                onUnlike={(targetPost) => unlikePostMutation.mutate(targetPost, { onError: (error) => toast.error(getErrorMessage(error)) })}
              />
            ))}
          </SimpleGrid>
        ) : (
          <EmptyState
            icon={<Camera size={34} />}
            title="No posts yet"
            description="Create the first post and it will appear in this feed."
          />
        )}
      </Stack>

      <UpdateModal
        isOpen={isOpen}
        onClose={onClose}
        post={selectedPost}
        onSubmit={handleUpdate}
        isLoading={updatePostMutation.isPending}
      />
    </PageTransition>
  );
}
