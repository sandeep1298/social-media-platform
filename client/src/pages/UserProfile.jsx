import { Heading, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { Grid3X3 } from "lucide-react";
import toast from "react-hot-toast";
import { Navigate, useParams } from "react-router";
import EmptyState from "../components/EmptyState";
import FeedSkeleton from "../components/FeedSkeleton";
import PageTransition from "../components/PageTransition";
import PostCard from "../components/PostCard";
import ProfileHeader from "../components/ProfileHeader";
import { useAuth } from "../context/AuthContext";
import { usePosts } from "../hooks/usePosts";
import { useProfile } from "../hooks/useProfile";
import { getErrorMessage } from "../services/api";

export default function UserProfile() {
  const { userId } = useParams();
  const { user } = useAuth();
  const { followMutation, profileQuery, unfollowMutation } = useProfile(userId);
  const { commentMutation, deletePostMutation, likePostMutation, unlikePostMutation } = usePosts();
  const profile = profileQuery.data;
  const posts = profile?.posts || [];

  if (userId === user?._id) {
    return <Navigate to="/profile" replace />;
  }

  const handleFollow = () => {
    followMutation.mutate(userId, {
      onSuccess: () => toast.success("Following user"),
      onError: (error) => toast.error(getErrorMessage(error))
    });
  };

  const handleUnfollow = () => {
    unfollowMutation.mutate(userId, {
      onSuccess: () => toast.success("Unfollowed user"),
      onError: (error) => toast.error(getErrorMessage(error))
    });
  };

  return (
    <PageTransition>
      <Stack spacing={6}>
        <Stack spacing={1}>
          <Heading size="lg">{profile?.user?.name || "Profile"}</Heading>
          <Text color="gray.500">Posts, followers, and public profile details.</Text>
        </Stack>

        {profileQuery.isLoading ? (
          <FeedSkeleton />
        ) : (
          <>
            <ProfileHeader
              currentUserId={user?._id}
              isFollowLoading={followMutation.isPending || unfollowMutation.isPending}
              onFollow={handleFollow}
              onUnfollow={handleUnfollow}
              postsCount={posts.length}
              user={profile?.user}
            />
            {posts.length ? (
              <SimpleGrid columns={{ base: 1, xl: 2 }} spacing={5} alignItems="start">
                {posts.map((post) => (
                  <PostCard
                    key={post._id}
                    currentUser={user}
                    post={post}
                    isActionLoading={commentMutation.isPending || deletePostMutation.isPending}
                    isLikeLoading={likePostMutation.isPending || unlikePostMutation.isPending}
                    onComment={(postId, text) => commentMutation.mutate({ postId, text })}
                    onDelete={(postId) => deletePostMutation.mutate(postId)}
                    onEdit={() => null}
                    onLike={(targetPost) => likePostMutation.mutate(targetPost, { onError: (error) => toast.error(getErrorMessage(error)) })}
                    onUnlike={(targetPost) => unlikePostMutation.mutate(targetPost, { onError: (error) => toast.error(getErrorMessage(error)) })}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <EmptyState
                icon={<Grid3X3 size={34} />}
                title="No posts here"
                description="This profile has not published any posts yet."
              />
            )}
          </>
        )}
      </Stack>
    </PageTransition>
  );
}
