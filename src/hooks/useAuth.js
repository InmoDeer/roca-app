import { useState } from "react";
import { ADMIN_PASSWORD } from "../config/environment";

const ADMIN_STORAGE_KEY = "roca_admin";

/**
 * Custom hook for managing authentication
 * Handles admin login/logout with localStorage persistence
 * @returns {Object} - Auth state and methods
 */
export function useAuth() {
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem(ADMIN_STORAGE_KEY) === "true";
  });
  const [loginPassword, setLoginPassword] = useState("");

  // Login with password
  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_STORAGE_KEY, "true");
      setLoginPassword("");
      return true;
    }
    return false;
  };

  // Logout
  const logout = () => {
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_STORAGE_KEY);
    setLoginPassword("");
  };

  return {
    isAdmin,
    loginPassword,
    setLoginPassword,
    login,
    logout,
  };
}
