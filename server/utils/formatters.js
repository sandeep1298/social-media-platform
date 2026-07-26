const normalizeIdArray = (items = []) => items.map((item) => item.toString());

const formatUser = (user) => {
  if (!user) return null;

  const plain = typeof user.toObject === "function" ? user.toObject() : user;
  delete plain.password;

  const followers = normalizeIdArray(plain.followers || []);
  const following = normalizeIdArray(plain.following || []);

  return {
    ...plain,
    followers,
    following,
    followersCount: followers.length,
    followingCount: following.length
  };
};

module.exports = { formatUser };
