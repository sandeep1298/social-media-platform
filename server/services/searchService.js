const { getCache, setCache } = require("../config/redis");
const { formatUser } = require("../utils/formatters");
const { findUsersForSearch, getPosts } = require("./postService");

const getSearchResults = async ({ q = "", sort = "recent" }) => {
  const cacheKey = `search:${q}:${sort}`;
  const cached = await getCache(cacheKey);
  if (cached) return cached;

  const [users, posts] = await Promise.all([
    findUsersForSearch(q),
    getPosts({ q, sort })
  ]);

  const payload = {
    users: users.map(formatUser),
    posts
  };

  await setCache(cacheKey, payload, 45);
  return payload;
};

module.exports = { getSearchResults };
