import { SignOut, User } from 'phosphor-react-native';
import { SafeAreaView, Text, View } from 'react-native';
import { useMutation } from 'react-query';
import Button from '../components/button';
import { COLORS } from '../utils/colors';
import api from '../utils/axiosStore';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import useSignout from '../hooks/useSignout';
import { useAuth } from '../utils/context';

export default function SettingsScreen({ navigation }) {
  const [token, setToken] = useState(null);
  const { setIsVerified } = useAuth();
  const signout = useSignout(token);
  useEffect(() => {
    (async () => {
      const t = await SecureStore.getItemAsync('token');
      setToken(t);
    })();
  });

  return (
    <SafeAreaView className='w-full h-full items-center flex-col-reverse'>
      <Button
        onPress={() => {
          SecureStore.deleteItemAsync('token');

          api.delete(`/users/${token}`);
          setIsVerified(false);
        }}
        variant='danger'
        icon={<User weight='fill' color='rgb(239, 68, 68)' />}
      >
        Delete
      </Button>
      <Button
        onPress={() => {
          SecureStore.deleteItemAsync('token');

          signout.mutate();
          navigation.popToTop();
          setIsVerified(false);
        }}
        variant='menu'
        icon={<SignOut weight='fill' color={COLORS.mainWhite} />}
      >
        Signout
      </Button>
      <Button
        onPress={() => {
          SecureStore.deleteItemAsync('token');
          signout.mutate();
          setIsVerified(false);
        }}
        variant='menu'
        icon={<SignOut weight='fill' color={COLORS.mainWhite} />}
      >
        Reset
      </Button>
    </SafeAreaView>
  );
}
