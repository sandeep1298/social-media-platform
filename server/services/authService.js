const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { jwtExpiry, jwtSecret } = require("../config/env");
const { ApiError } = require("../utils/errors");
const { formatUser } = require("../utils/formatters");

const createToken = (userId) => jwt.sign({ _id: userId }, jwtSecret, { expiresIn: jwtExpiry });

const normalizeUsername = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 24);

const generateUsername = async ({ name, email, username }) => {
  const seed = normalizeUsername(username || name || email.split("@")[0]) || "user";
  let candidate = seed;
  let suffix = 1;

  while (await User.exists({ username: candidate })) {
    candidate = `${seed}${suffix}`;
    suffix += 1;
  }

  return candidate;
};

const buildAuthPayload = (user) => ({
  ...formatUser(user),
  token: createToken(user._id)
});

const signup = async ({ name, username, email, password }) => {
  const existingEmail = await User.findOne({ email: email.toLowerCase() });
  if (existingEmail) {
    throw new ApiError(422, "User already exists with that email");
  }

  const finalUsername = await generateUsername({ name, email, username });
  const hashedPassword = await bcrypt.hash(password, 12);
  const user = await User.create({
    name,
    username: finalUsername,
    email,
    password: hashedPassword
  });

  return buildAuthPayload(user);
};

const signin = async ({ email, password }) => {
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    throw new ApiError(422, "Invalid email or password");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw new ApiError(422, "Invalid email or password");
  }

  return buildAuthPayload(user);
};

module.exports = { signin, signup };
