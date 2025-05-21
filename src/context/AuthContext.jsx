import { createContext, useContext, useState } from "react";

const defaultAuthState = {
  email: null,
  password: null,
  isAuthenticated: false,
  logs: [],
  totalPages: 1,
  totalItems: 0,
  currentPage: 1,
};

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(defaultAuthState);

  const login = (email, password) => {
    const isValid =
      email === "bolaybuthd@gmail.com" && password === "stre123ngth";
    setAuth((prev) => ({
      ...prev,
      email: isValid ? email : null,
      password: isValid ? password : null,
      isAuthenticated: isValid,
    }));
    return isValid;
  };

  const updateLogs = (logs, totalPages, totalItems, currentPage) => {
    setAuth((prev) => ({
      ...prev,
      logs,
      totalPages,
      totalItems,
      currentPage,
    }));
  };
  const logout = () => {
    setAuth(defaultAuthState);
  };

  const value = {
    auth,
    login,
    logout,
    updateLogs,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
