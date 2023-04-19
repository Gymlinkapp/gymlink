import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { useState, useEffect } from 'react';
import { useUser } from './useUser';
import { useAuth } from '../utils/context';

const AUTH_STEPS = '7';

export const useAuthState = () => {
  const { setToken, token, setUser, setSocket, socket } = useAuth();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const { data: user, isLoading } = useUser(token);

  useEffect(() => {
    getItemAsync('token').then((token) => {
      if (token) {
        setToken(token);

        setIsLoadingAuth(false);
      }
    });

    if (!token) {
      setIsLoadingAuth(false);

      return;
    }

    if (!isLoading && user) {
      // if the user has a jwt (has an email) and has completed all auth steps
      if (user.authSteps.toString() === AUTH_STEPS && user.tempJWT) {
        // the user is verified to be logged in past the onboarding screens
        setIsVerified(true);

        // store the auth steps in secure store
        setItemAsync('authSteps', user.authSteps.toString());

        // setting the user in context (should be better than store?)
        setUser(user);
      } else {
        // if the user has not completed all auth steps, they are not verified and need to be tracked back to the remaining screens
        setIsVerified(false);
      }

      // the user is not loading anymore
      setIsLoadingAuth(false);
    }
    if (!token) {
      // if the user has no token, they are not verified
      setIsVerified(false);
    }

    // instead of needing to fetch the user all over again, after the checks above, store the isVerified state in secure store
    setItemAsync('isVerified', isVerified.toString());

    if (socket) {
      setSocket(socket);
    }
  }, [token, user, isLoading, socket]);

  return { isVerified, setIsVerified, setSocket, isLoadingAuth, token };
};
