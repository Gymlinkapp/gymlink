import { SignOut, User } from 'phosphor-react-native';
import { SafeAreaView, Text, View } from 'react-native';
import { useMutation } from 'react-query';
import Button from '../components/button';
import { COLORS } from '../utils/colors';
import api from '../utils/axiosStore';
import { useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

export default function SettingsScreen({ navigation }) {
  const [token, setToken] = useState(null);
  useEffect(() => {
    (async () => {
      const t = await SecureStore.getItemAsync('token');
      setToken(t);
    })();
  });
  const signOut = useMutation(
    async () => {
      try {
        return await api.post(
          '/auth/signout',
          {
            token: token,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: async () => {
        try {
        } catch (error) {
          console.log(error);
        }

        navigation.navigate('Register');
      },
    }
  );
  return (
    <SafeAreaView className='w-full h-full items-center flex-col-reverse'>
      <Button
        onPress={() => {
          SecureStore.deleteItemAsync('token');

          api.delete(`/users/${token}`);
          navigation.navigate('Register');
        }}
        variant='danger'
        icon={<User weight='fill' color='rgb(239, 68, 68)' />}
      >
        Delete
      </Button>
      <Button
        onPress={() => {
          SecureStore.deleteItemAsync('token');

          signOut.mutate();
        }}
        variant='menu'
        icon={<SignOut weight='fill' color={COLORS.mainWhite} />}
      >
        Signout
      </Button>
    </SafeAreaView>
  );
}
