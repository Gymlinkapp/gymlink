// create me a boilerplate for react context
import React, { createContext, useContext, useState } from 'react';
import { User } from './users';
import { Socket } from 'socket.io-client';
import { Filter, defaultFilters } from './types/filter';
import { exercises } from './split';
import { Prompt } from './types/prompt';

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
    socket: Socket;
    setSocket: React.Dispatch<React.SetStateAction<Socket>>;
    filters: Filter[];
    setFilters: React.Dispatch<React.SetStateAction<Filter[]>>;
    feed: User[];
    setFeed: React.Dispatch<React.SetStateAction<User[]>>;
    phoneNumber: string;
    setPhoneNumber: React.Dispatch<React.SetStateAction<string>>;
    canAnswerPrompt: boolean;
    setCanAnswerPrompt: React.Dispatch<React.SetStateAction<boolean>>;
    prompt: Prompt;
    setPrompt: React.Dispatch<React.SetStateAction<Prompt>>;
  }
);

// create me a provider
const AuthProvider = ({ children }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [token, setToken] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [long, setLong] = useState(null);
  const [lat, setLat] = useState(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [filters, setFilters] = useState<Filter[]>(defaultFilters);
  const [feed, setFeed] = useState<User[]>([]);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [canAnswerPrompt, setCanAnswerPrompt] = useState(true);
  const [prompt, setPrompt] = useState<Prompt | null>(null);

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
        socket,
        setSocket,
        filters,
        setFilters,
        feed,
        setFeed,
        phoneNumber,
        setPhoneNumber,
        canAnswerPrompt,
        setCanAnswerPrompt,
        prompt,
        setPrompt,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// export me a hook that can be used to access the context
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
