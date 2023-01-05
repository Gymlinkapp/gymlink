// create me a boilerplate for react context
import React, { createContext, useContext, useState } from 'react';
import { User } from './users';

// create me a context
const AuthContext = createContext(
  {} as {
    isVerified: boolean;
    setIsVerified: React.Dispatch<React.SetStateAction<boolean>>;
    token: string;
    setToken: React.Dispatch<React.SetStateAction<string>>;
    user: User;
    setUser: React.Dispatch<React.SetStateAction<User>>;
    long: number;
    setLong: React.Dispatch<React.SetStateAction<number>>;
    lat: number;
    setLat: React.Dispatch<React.SetStateAction<number>>;
  }
);

// create me a provider
const AuthProvider = ({ children }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [token, setToken] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [long, setLong] = useState(0);
  const [lat, setLat] = useState(0);

  return (
    <AuthContext.Provider
      value={{
        isVerified,
        setIsVerified,
        token,
        setToken,
        user,
        setUser,
        long,
        setLong,
        lat,
        setLat,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// export me a hook that can be used to access the context
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
