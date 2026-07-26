import { Heading, SimpleGrid, Stack, Text, useDisclosure } from "@chakra-ui/react";
import { Grid3X3 } from "lucide-react";
import { useCallback, useState } from "react";
import toast from "react-hot-toast";
import EditProfileModal from "../components/EditProfileModal";
import EmptyState from "../components/EmptyState";
import FeedSkeleton from "../components/FeedSkeleton";
import PageTransition from "../components/PageTransition";
import PostCard from "../components/PostCard";
import ProfileHeader from "../components/ProfileHeader";
import UpdateModal from "../components/UpdateModal";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../hooks/usePosts";
import { useProfile } from "../hooks/useProfile";
import { getErrorMessage } from "../services/api";

export default function Profile() {
  const { user } = useAuth();
  const { isOpen: isProfileOpen, onClose: onProfileClose, onOpen: onProfileOpen } = useDisclosure();
  const { isOpen: isPostOpen, onClose: onPostClose, onOpen: onPostOpen } = useDisclosure();
  const [selectedPost, setSelectedPost] = useState(null);
  const { profileQuery, updateProfileMutation } = useProfile(user?._id);
  const { commentMutation, deletePostMutation, likePostMutation, unlikePostMutation, updatePostMutation } = usePosts();
  const profile = profileQuery.data;
  const posts = profile?.posts || [];

  const openPostEdit = useCallback(
    (post) => {
      setSelectedPost(post);
      onPostOpen();
    },
    [onPostOpen]
  );

  const closePostEdit = useCallback(() => {
    setSelectedPost(null);
    onPostClose();
  }, [onPostClose]);

  const handleProfileUpdate = (updates) =>
    updateProfileMutation.mutateAsync(updates, {
      onSuccess: () => toast.success("Profile updated"),
      onError: (error) => toast.error(getErrorMessage(error))
    });

  const handlePostUpdate = (payload) =>
    updatePostMutation.mutateAsync(payload, {
      onSuccess: () => toast.success("Post updated")
    });

  return (
    <PageTransition>
      <Stack spacing={6}>
        <Stack spacing={1}>
          <Heading size="lg">Profile</Heading>
          <Text color="gray.500">Manage your public profile and posts.</Text>
        </Stack>

        {profileQuery.isLoading ? (
          <FeedSkeleton />
        ) : (
          <>
            <ProfileHeader currentUserId={user?._id} postsCount={posts.length} user={profile?.user || user} onEdit={onProfileOpen} />
            {posts.length ? (
              <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={5} alignItems="start">
                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    currentUser={user}
                    post={post}
                    isActionLoading={commentMutation.isPending || deletePostMutation.isPending}
                    isLikeLoading={likePostMutation.isPending || unlikePostMutation.isPending}
                    onComment={(postId, text) =>
                      commentMutation.mutate({ postId, text }, { onError: (error) => toast.error(getErrorMessage(error)) })
                    }
                    onDelete={(postId) =>
                      deletePostMutation.mutate(postId, {
                        onSuccess: () => toast.success("Post deleted"),
                        onError: (error) => toast.error(getErrorMessage(error))
                      })
                    }
                    onEdit={openPostEdit}
                    onLike={(targetPost) => likePostMutation.mutate(targetPost, { onError: (error) => toast.error(getErrorMessage(error)) })}
                    onUnlike={(targetPost) => unlikePostMutation.mutate(targetPost, { onError: (error) => toast.error(getErrorMessage(error)) })}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <EmptyState
                icon={<Grid3X3 size={34} />}
                title="No profile posts"
                description="Your published posts will collect here."
              />
            )}
          </>
        )}
      </Stack>
      <EditProfileModal
        isOpen={isProfileOpen}
        onClose={onProfileClose}
        user={profile?.user || user}
        onSubmit={handleProfileUpdate}
        isLoading={updateProfileMutation.isPending}
      />
      <UpdateModal
        isOpen={isPostOpen}
        onClose={closePostEdit}
        post={selectedPost}
        onSubmit={handlePostUpdate}
        isLoading={updatePostMutation.isPending}
      />
    </PageTransition>
  );
}
