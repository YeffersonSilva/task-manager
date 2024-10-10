import React, { createContext, useState, useEffect } from "react";
import { IUser } from "../types/User";

interface AuthContextProps {
  user: IUser | null;
  setUser: React.Dispatch<React.SetStateAction<IUser | null>>;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps>({
  user: null,
  setUser: () => {},
  login: async () => {},
  register: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<IUser | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const API_URL = process.env.REACT_APP_API_URL;

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      throw new Error(data.message || "Login failed");
    }
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } else {
      throw new Error(data.message || "Registration failed");
    }
  };

  const logout = async () => {
    await fetch(`${API_URL}/logout`, { credentials: "include" });
    setUser(null);
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const fetchUser = async () => {
      if (!user) {
        const response = await fetch(`${API_URL}/user`, {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        }
      }
    };
    fetchUser();
  }, [user, API_URL]);

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
