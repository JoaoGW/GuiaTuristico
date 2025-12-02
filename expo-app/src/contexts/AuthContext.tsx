import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from '../../firebase';

export interface UserData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

type AuthContextType = {
  isAuthenticated: boolean;
  user: UserData | null;
  loading: boolean;
  login: (userData: UserData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

/**
 * Context for managing authentication state within the application.
 * 
 * Provides the current authentication status, user data, and functions to log in and log out.
 * Persists session data using AsyncStorage and Firebase Auth state observer.
 * 
 * @type {AuthContextType} The type definition for the authentication context.
 */
const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  refreshUser: async () => {},
});

const USER_STORAGE_KEY = '@GuiaTuristico:user';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Carrega dados do usuário do AsyncStorage na inicialização
   */
  useEffect(() => {
    loadUserFromStorage();
  }, []);

  /**
   * Observer do Firebase Auth para detectar mudanças de estado
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData: UserData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || null,
          displayName: firebaseUser.displayName || null,
          photoURL: firebaseUser.photoURL || null,
          emailVerified: firebaseUser.emailVerified || false,
        };
        await login(userData);
      } else {
        await logout();
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  /**
   * Carrega dados do usuário armazenados localmente
   */
  const loadUserFromStorage = async () => {
    try {
      const storedUser = await AsyncStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        const userData: UserData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erro ao carregar usuário do storage:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Faz login do usuário e persiste dados localmente
   */
  const login = async (userData: UserData) => {
    try {
      // Garante que apenas dados serializáveis são salvos
      const cleanUserData: UserData = {
        uid: userData.uid || '',
        email: userData.email || null,
        displayName: userData.displayName || null,
        photoURL: userData.photoURL || null,
        emailVerified: userData.emailVerified || false,
      };
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(cleanUserData));
      setUser(cleanUserData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Erro ao salvar usuário no storage:', error);
      throw error;
    }
  };

  /**
   * Faz logout do usuário, limpa dados locais e sessão do Firebase
   */
  const logout = async () => {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem(USER_STORAGE_KEY);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  };

  /**
   * Atualiza dados do usuário a partir do Firebase
   */
  const refreshUser = async () => {
    try {
      const currentUser = auth.currentUser;
      if (currentUser) {
        await currentUser.reload();
        const userData: UserData = {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName,
          photoURL: currentUser.photoURL,
          emailVerified: currentUser.emailVerified,
        };
        await login(userData);
      }
    } catch (error) {
      console.error('Erro ao atualizar dados do usuário:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);