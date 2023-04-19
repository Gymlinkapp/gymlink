import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { useState, useEffect } from 'react';
import { useUser } from './useUser';
import { useAuth } from '../utils/context';

const AUTH_STEPS = '7';

export const useAuthState = () => {
  const { setToken, token, setUser, setSocket, socket } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [isTokenChecked, setIsTokenChecked] = useState(false);
  const { data: user, isLoading, isError } = useUser(token);

  useEffect(() => {
    getItemAsync('token').then((token) => {
      if (token) {
        setToken(token);
      }
      setIsTokenChecked(true);
    });

    if (!isLoading && user) {
      const completedOnboarding = user.authSteps.toString() === AUTH_STEPS;
      setIsVerified(completedOnboarding);

      setUser(user);
      setIsLoadingAuth(false);
    } else if (!isLoading && !user && token) {
      // Token exists, but user doesn't
      setIsLoadingAuth(false);
      setIsVerified(false);
    } else if (!isLoading && !user && !token) {
      setIsLoadingAuth(false);
    }

    if (socket) setSocket(socket);
  }, [token, user, isLoading, socket]);

  return {
    isVerified,
    setIsVerified,
    setSocket,
    isLoadingAuth,
    token,
    isTokenChecked,
  };
};
