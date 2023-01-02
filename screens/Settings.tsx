import { SignOut, User } from 'phosphor-react-native';
import { SafeAreaView, Text, View } from 'react-native';
import { useMutation } from 'react-query';
import Button from '../components/button';
import { COLORS } from '../utils/colors';
import api from '../utils/axiosStore';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import useSignout from '../hooks/useSignout';

export default function SettingsScreen({ navigation }) {
  const [token, setToken] = useState(null);
  const signout = useSignout(token, navigation);
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
          navigation.popToTop();
          navigation.navigate('Auth', { screen: 'Register' });
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
          navigation.navigate('Auth', { screen: 'Register' });
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
        }}
        variant='menu'
        icon={<SignOut weight='fill' color={COLORS.mainWhite} />}
      >
        Reset
      </Button>
    </SafeAreaView>
  );
}
