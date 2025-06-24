<<<<<<< HEAD

import React, { createContext, useContext, useEffect, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  userEmail: string | null;
  login: (email: string) => void;
  logout: () => void;
=======
import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiClient } from '@/lib/api';

type User = {
  id: number;
  email: string;
  created_at: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
>>>>>>> 139731a (Initial backend implementation and simple authentication)
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
<<<<<<< HEAD
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const authStatus = localStorage.getItem("isAuthenticated");
    const email = localStorage.getItem("userEmail");
    
    if (authStatus === "true" && email) {
      setIsAuthenticated(true);
      setUserEmail(email);
    }
  }, []);

  const login = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
=======
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem("auth_token");
    
    if (token) {
      apiClient.setToken(token);
      // Verify token with server
      apiClient.getCurrentUser()
        .then(response => {
          setIsAuthenticated(true);
          setUser(response.user);
        })
        .catch(() => {
          // Token is invalid, clear it
          localStorage.removeItem("auth_token");
          apiClient.setToken(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);
      setIsAuthenticated(true);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const response = await apiClient.register(email, password);
      setIsAuthenticated(true);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
>>>>>>> 139731a (Initial backend implementation and simple authentication)
  };

  const logout = () => {
    setIsAuthenticated(false);
<<<<<<< HEAD
    setUserEmail(null);
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userEmail, login, logout }}>
=======
    setUser(null);
    apiClient.setToken(null);
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
      register, 
      logout, 
      loading 
    }}>
>>>>>>> 139731a (Initial backend implementation and simple authentication)
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
<<<<<<< HEAD
};
=======
};
>>>>>>> 139731a (Initial backend implementation and simple authentication)
