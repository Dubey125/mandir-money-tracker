import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { email, role: 'admin' }

  const login = (email, password) => {
    const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "admin@mandir.com";
    const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASS || "admin123";

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      setUser({ email, role: "admin" });
      return { ok: true };
    }
    return { ok: false, message: "Invalid credentials" };
  };

  const logout = () => setUser(null);

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
