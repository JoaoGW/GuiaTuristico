import { createContext, useContext, useState } from 'react';

type AuthContextType = {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
};

/**
 * Context for managing authentication state within the application.
 * 
 * Provides the current authentication status and functions to log in and log out.
 * 
 * @type {AuthContextType} The type definition for the authentication context.
 * @property {boolean} isAuthenticated - Indicates whether the user is currently authenticated.
 * @property {() => void} login - Function to handle user login.
 * @property {() => void} logout - Function to handle user logout.
 */
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);