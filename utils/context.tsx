// create me a boilerplate for react context
import React, { createContext, useContext, useState } from 'react';
import { User } from './users';
import { Socket } from 'socket.io-client';
import { Filter } from './types/filter';
import { exercises } from './split';

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
  }
);

// create me a provider
const AuthProvider = ({ children }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [token, setToken] = useState('');
  const [user, setUser] = useState<User | null>(null);
  const [long, setLong] = useState(0);
  const [lat, setLat] = useState(0);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [filters, setFilters] = useState<Filter[]>([
    {
      filter: 'goingToday',
      name: 'Going Today',
      values: [
        {
          filter: 'goingToday',
          name: 'Yes',
          value: true,
        },
        {
          filter: 'goingToday',
          name: 'No',
          value: false,
        },
      ],
    },
    {
      filter: 'workoutType',
      name: 'Workout Type',
      values: [
        {
          filter: 'workoutType',
          name: 'Cardio',
          value: 'cardio',
        },
        {
          filter: 'workoutType',
          name: 'Bench',
          value: 'bench',
        },
        {
          filter: 'workoutType',
          name: 'Squat',
          value: 'squat',
        },
      ],
    },
    {
      filter: 'intensity',
      name: 'Workout Intensity',
      values: [
        {
          filter: 'intensity',
          name: 'Low',
          value: 'low',
        },
        {
          filter: 'intensity',
          name: 'Medium',
          value: 'medium',
        },
        {
          filter: 'intensity',
          name: 'High',
          value: 'high',
        },
      ],
    },
    {
      filter: 'intensityyy',
      name: 'Workout Intensity',
      values: [
        {
          filter: 'intensityyy',
          name: 'Low',
          value: 'low',
        },
        {
          filter: 'intensityyy',
          name: 'Medium',
          value: 'medium',
        },
        {
          filter: 'intensityyy',
          name: 'High',
          value: 'high',
        },
      ],
    },
  ]);

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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// export me a hook that can be used to access the context
const useAuth = () => useContext(AuthContext);

export { AuthProvider, useAuth };
