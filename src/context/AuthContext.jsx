import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    email: null,
    password: null,
    isAuthenticated: false,
  });

  const login = (email, password) => {
    setAuth({ email, password, isAuthenticated: true });
  };

  const logout = () => {
    setAuth({ email: null, password: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
