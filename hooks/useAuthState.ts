import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { useState, useEffect } from 'react';
import { useUser } from './useUser';
import { useAuth } from '../utils/context';

const AUTH_STEPS = '7';

export const useAuthState = () => {
  const { setToken, token, setUser } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const { data: user, isLoading } = useUser(token);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    getItemAsync('token').then((res) => {
      setToken(res);
    });

    if (!isLoading && user) {
      if (user.authSteps.toString() === AUTH_STEPS && user.tempJWT) {
        setItemAsync('authSteps', user.authSteps.toString());
        setIsVerified(true);

        setUser(user);
      } else {
        setIsVerified(false);
      }
      setIsLoadingAuth(false);
    }
    if (!token) {
      setIsVerified(false);
    }
    setItemAsync('isVerified', isVerified.toString());

    if (socket) {
      setSocket(socket);
    }
  }, [token, user, isLoading, socket]);

  return { isVerified, setIsVerified, setSocket, isLoadingAuth };
};
