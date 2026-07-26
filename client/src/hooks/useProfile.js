import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../constants/queryKeys";
import { useAuth } from "../context/AuthContext";
import { profileApi } from "../services/api";

const normalizeIds = (items = []) => items.map((item) => item?.toString());

export const useProfile = (userId) => {
  const { setAuthUser, updateAuthUser, user } = useAuth();
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: queryKeys.profile(userId),
    queryFn: () => profileApi.getProfile(userId),
    enabled: Boolean(user?.token && userId),
    staleTime: 30 * 1000,
    retry: 1
  });

  const updateProfileMutation = useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (updatedUser) => {
      updateAuthUser(updatedUser);
      queryClient.setQueryData(queryKeys.profile(updatedUser._id), (current) => ({
        posts: current?.posts || [],
        user: updatedUser
      }));
      queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.search() });
    }
  });

  const followMutation = useMutation({
    mutationFn: (targetUserId) => profileApi.follow(targetUserId),
    onMutate: async (targetUserId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.profile(targetUserId) });
      const previousProfile = queryClient.getQueryData(queryKeys.profile(targetUserId));
      const previousUser = user;
      const currentFollowing = normalizeIds(user?.following);

      updateAuthUser({
        following: Array.from(new Set([...currentFollowing, targetUserId]))
      });

      queryClient.setQueryData(queryKeys.profile(targetUserId), (current) => {
        if (!current?.user) return current;
        const followers = Array.from(new Set([...normalizeIds(current.user.followers), user._id]));
        return {
          ...current,
          user: {
            ...current.user,
            followers,
            followersCount: followers.length
          }
        };
      });

      return { previousProfile, previousUser };
    },
    onError: (_error, targetUserId, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(queryKeys.profile(targetUserId), context.previousProfile);
      }
      setAuthUser(context?.previousUser || user);
    },
    onSuccess: (profile, targetUserId) => {
      queryClient.setQueryData(queryKeys.profile(targetUserId), profile);
    },
    onSettled: (_data, _error, targetUserId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile(targetUserId) });
    }
  });

  const unfollowMutation = useMutation({
    mutationFn: (targetUserId) => profileApi.unfollow(targetUserId),
    onMutate: async (targetUserId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.profile(targetUserId) });
      const previousProfile = queryClient.getQueryData(queryKeys.profile(targetUserId));
      const previousUser = user;

      updateAuthUser({
        following: normalizeIds(user?.following).filter((id) => id !== targetUserId)
      });

      queryClient.setQueryData(queryKeys.profile(targetUserId), (current) => {
        if (!current?.user) return current;
        const followers = normalizeIds(current.user.followers).filter((id) => id !== user._id);
        return {
          ...current,
          user: {
            ...current.user,
            followers,
            followersCount: followers.length
          }
        };
      });

      return { previousProfile, previousUser };
    },
    onError: (_error, targetUserId, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(queryKeys.profile(targetUserId), context.previousProfile);
      }
      setAuthUser(context?.previousUser || user);
    },
    onSuccess: (profile, targetUserId) => {
      queryClient.setQueryData(queryKeys.profile(targetUserId), profile);
    },
    onSettled: (_data, _error, targetUserId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile(targetUserId) });
    }
  });

  return {
    followMutation,
    profileQuery,
    unfollowMutation,
    updateProfileMutation
  };
};
