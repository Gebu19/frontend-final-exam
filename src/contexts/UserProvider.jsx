import { useContext, useState, useEffect } from "react";
import { UserContext } from "./UserContext";

export function UserProvider({ children }) {
  const initialUser = { isLoggedIn: false, name: '', email: '', role: '' };
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
  const [user, setUser] = useState(initialUser);

  // Restore session on refresh
  useEffect(() => {
    const saved = localStorage.getItem("session");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const login = async (email, password) => {
    try {
      const res = await fetch(`${API_URL}/api/user/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });
      if (res.ok) {
        const data = await res.json();
        const newUser = {
          isLoggedIn: true,
          name: data.user.email,
          email: data.user.email,
          role: data.user.role // Required for Admin RBAC
        };
        setUser(newUser);
        localStorage.setItem("session", JSON.stringify(newUser));
        return true;
      }
      return false;
    } catch (e) { return false; }
  }

  const logout = async () => {
    await fetch(`${API_URL}/api/user/logout`, { method: "POST", credentials: "include" });
    setUser(initialUser);
    localStorage.removeItem("session");
  }

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() { return useContext(UserContext); }