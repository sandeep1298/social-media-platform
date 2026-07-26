import axios from "axios";

const sanitizeUrl = (value) => (value || "").trim().replace(/^["']|["']$/g, "");

export const api = axios.create({
  baseURL: sanitizeUrl(import.meta.env.VITE_API_URL) || "http://localhost:5000/api",
  withCredentials: true
});

const getStoredToken = () => {
  try {
    const user = JSON.parse(localStorage.getItem("userInfo") || "null");
    return user?.token;
  } catch {
    return null;
  }
};

api.interceptors.request.use((config) => {
  const token = getStoredToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getErrorMessage = (error) =>
  error?.response?.data?.error ||
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong";

export const authApi = {
  async signup(credentials) {
    const { data } = await api.post("/auth/signup", credentials);
    return data.user;
  },
  async login(credentials) {
    const { data } = await api.post("/auth/signin", credentials);
    return data.user;
  },
  async me() {
    const { data } = await api.get("/auth/me");
    return data.user;
  }
};

export const uploadImage = async (image) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "sandeep1298";
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "sandeep-insta";
  const payload = new FormData();

  payload.append("file", image);
  payload.append("upload_preset", uploadPreset);

  const { data } = await axios.post(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    payload,
    {
      headers: { "Content-Type": "multipart/form-data" }
    }
  );

  return data.secure_url || data.url;
};

export const postsApi = {
  async getPosts(params = {}) {
    const { data } = await api.get("/posts/allpost", { params });
    return data.posts || [];
  },
  async createPost(postDetails) {
    const { data } = await api.post("/posts/createpost", postDetails);
    return data.post;
  },
  async updatePost(postId, postDetails) {
    const { data } = await api.put(`/posts/updatepost/${postId}`, postDetails);
    return data.post;
  },
  async deletePost(postId) {
    const { data } = await api.delete(`/posts/deletepost/${postId}`);
    return data;
  },
  async likePost(postId) {
    const { data } = await api.put("/posts/like", { postId });
    return data.post || data;
  },
  async unlikePost(postId) {
    const { data } = await api.put("/posts/unlike", { postId });
    return data.post || data;
  },
  async comment(postId, text) {
    const { data } = await api.put("/posts/comment", { postId, text });
    return data.post || data;
  }
};

export const profileApi = {
  async getProfile(userId) {
    const { data } = await api.get(`/users/${userId}`);
    return {
      user: data.user,
      posts: data.posts || []
    };
  },
  async updateProfile(profileDetails) {
    const { data } = await api.put("/users/me/profile", profileDetails);
    return data.user;
  },
  async follow(userId) {
    const { data } = await api.put(`/users/${userId}/follow`);
    return {
      user: data.user,
      posts: data.posts || []
    };
  },
  async unfollow(userId) {
    const { data } = await api.put(`/users/${userId}/unfollow`);
    return {
      user: data.user,
      posts: data.posts || []
    };
  }
};

export const searchApi = {
  async search(params = {}) {
    const { data } = await api.get("/search", { params });
    return {
      users: data.users || [],
      posts: data.posts || []
    };
  }
};
