export const queryKeys = {
  auth: {
    me: ["auth", "me"]
  },
  posts: {
    all: ["posts"],
    list: (params = {}) => ["posts", "list", params]
  },
  profile: (userId) => ["profile", userId],
  search: (params = {}) => ["search", params]
};
