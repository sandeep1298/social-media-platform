import { createContext, useCallback, useContext, useMemo, useState } from "react";
import Cookies from "js-cookie";

const AuthContext = createContext(null);
const STORAGE_KEY = "userInfo";

const readStoredUser = () => {
  try {
    const localValue = localStorage.getItem(STORAGE_KEY);
    if (localValue) return JSON.parse(localValue);

    const cookieValue = Cookies.get(STORAGE_KEY);
    if (cookieValue) return JSON.parse(cookieValue);
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    Cookies.remove(STORAGE_KEY);
  }

  return null;
};

const persistUser = (user) => {
  if (!user) {
    localStorage.removeItem(STORAGE_KEY);
    Cookies.remove(STORAGE_KEY);
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  Cookies.set(STORAGE_KEY, JSON.stringify(user), { expires: 7 });
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStoredUser);

  const setAuthUser = useCallback((nextUser) => {
    setUser(nextUser);
    persistUser(nextUser);
  }, []);

  const updateAuthUser = useCallback((updates) => {
    setUser((currentUser) => {
      const nextUser = {
        ...currentUser,
        ...updates,
        token: updates?.token || currentUser?.token
      };
      persistUser(nextUser);
      return nextUser;
    });
  }, []);

  const logout = useCallback(() => {
    setAuthUser(null);
  }, [setAuthUser]);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user?.token),
      logout,
      setAuthUser,
      updateAuthUser,
      user
    }),
    [logout, setAuthUser, updateAuthUser, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
};
