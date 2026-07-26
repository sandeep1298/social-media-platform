import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { postsApi } from "../services/api";
import { queryKeys } from "../constants/queryKeys";
import { useAuth } from "../context/AuthContext";

const normalizeId = (id) => id?.toString();

const replacePost = (posts, updatedPost) => {
  if (!Array.isArray(posts)) return posts;
  return posts.map((post) => (normalizeId(post._id) === normalizeId(updatedPost._id) ? updatedPost : post));
};

const removePost = (posts, postId) => {
  if (!Array.isArray(posts)) return posts;
  return posts.filter((post) => normalizeId(post._id) !== normalizeId(postId));
};

const addLike = (post, userId) => ({
  ...post,
  likes: Array.from(new Set([...(post.likes || []).map(normalizeId), userId]))
});

const removeLike = (post, userId) => ({
  ...post,
  likes: (post.likes || []).map(normalizeId).filter((id) => id !== userId)
});

export const usePosts = (params = {}) => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const queryKey = queryKeys.posts.list(params);

  const postsQuery = useQuery({
    queryKey,
    queryFn: () => postsApi.getPosts(params),
    enabled: Boolean(user?.token),
    staleTime: 30 * 1000,
    retry: 1
  });

  const getPostSnapshots = () => [
    ...queryClient.getQueriesData({ queryKey: queryKeys.posts.all }),
    ...queryClient.getQueriesData({ queryKey: ["profile"] }),
    ...queryClient.getQueriesData({ queryKey: ["search"] })
  ];

  const mutatePostAcrossSurfaces = (mapper) => {
    queryClient.setQueriesData({ queryKey: queryKeys.posts.all }, (oldPosts) => mapper(oldPosts));
    queryClient.setQueriesData({ queryKey: ["profile"] }, (current) =>
      current?.posts ? { ...current, posts: mapper(current.posts) } : current
    );
    queryClient.setQueriesData({ queryKey: ["search"] }, (current) =>
      current?.posts ? { ...current, posts: mapper(current.posts) } : current
    );
  };

  const updatePostAcrossSurfaces = (postId, mapper) =>
    mutatePostAcrossSurfaces((posts) =>
      Array.isArray(posts)
        ? posts.map((currentPost) =>
            normalizeId(currentPost._id) === normalizeId(postId) ? mapper(currentPost) : currentPost
          )
        : posts
    );

  const invalidatePostSurfaces = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.posts.all });
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    queryClient.invalidateQueries({ queryKey: ["search"] });
  };

  const likePostMutation = useMutation({
    mutationFn: (post) => postsApi.likePost(post._id),
    onMutate: async (post) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.all });
      await queryClient.cancelQueries({ queryKey: ["profile"] });
      await queryClient.cancelQueries({ queryKey: ["search"] });
      const snapshots = getPostSnapshots();
      updatePostAcrossSurfaces(post._id, (currentPost) => addLike(currentPost, normalizeId(user._id)));
      return { snapshots };
    },
    onError: (_error, _post, context) => {
      context?.snapshots?.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSuccess: (updatedPost) => {
      mutatePostAcrossSurfaces((oldPosts) => replacePost(oldPosts, updatedPost));
    },
    // The confirmed response updates every cached surface. Refetching here can
    // briefly replace it with an older Redis-cached feed.
  });

  const unlikePostMutation = useMutation({
    mutationFn: (post) => postsApi.unlikePost(post._id),
    onMutate: async (post) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.all });
      await queryClient.cancelQueries({ queryKey: ["profile"] });
      await queryClient.cancelQueries({ queryKey: ["search"] });
      const snapshots = getPostSnapshots();
      updatePostAcrossSurfaces(post._id, (currentPost) => removeLike(currentPost, normalizeId(user._id)));
      return { snapshots };
    },
    onError: (_error, _post, context) => {
      context?.snapshots?.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSuccess: (updatedPost) => {
      mutatePostAcrossSurfaces((oldPosts) => replacePost(oldPosts, updatedPost));
    },
    // See the matching like mutation above.
  });

  const commentMutation = useMutation({
    mutationFn: ({ postId, text }) => postsApi.comment(postId, text),
    onSuccess: (updatedPost) => {
      mutatePostAcrossSurfaces((oldPosts) => replacePost(oldPosts, updatedPost));
    },
    onSettled: () => {
      invalidatePostSurfaces();
    }
  });

  const createPostMutation = useMutation({
    mutationFn: postsApi.createPost,
    onSuccess: () => {
      invalidatePostSurfaces();
    }
  });

  const updatePostMutation = useMutation({
    mutationFn: ({ postId, postDetails }) => postsApi.updatePost(postId, postDetails),
    onSuccess: (updatedPost) => {
      mutatePostAcrossSurfaces((oldPosts) => replacePost(oldPosts, updatedPost));
      invalidatePostSurfaces();
    }
  });

  const deletePostMutation = useMutation({
    mutationFn: postsApi.deletePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.posts.all });
      await queryClient.cancelQueries({ queryKey: ["profile"] });
      await queryClient.cancelQueries({ queryKey: ["search"] });
      const snapshots = getPostSnapshots();
      mutatePostAcrossSurfaces((oldPosts) => removePost(oldPosts, postId));
      return { snapshots };
    },
    onError: (_error, _postId, context) => {
      context?.snapshots?.forEach(([key, data]) => queryClient.setQueryData(key, data));
    },
    onSettled: () => {
      invalidatePostSurfaces();
    }
  });

  return {
    commentMutation,
    createPostMutation,
    deletePostMutation,
    likePostMutation,
    postsQuery,
    unlikePostMutation,
    updatePostMutation
  };
};
