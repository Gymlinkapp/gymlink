import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import AuthStackScreen from './AuthScreenStack';
import Home from './RootHomeScreen';
import NotificationScreen from './Notifications';
import UserAccountScreen from './UserAccount';
import CreateChatScreen from './CreateChat';
import ChatScreen from './Chat';
import SettingsScreen from './Settings';
import { COLORS } from '../utils/colors';
import api from '../utils/axiosStore';
import { User } from '../utils/users';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../utils/context';
import Loading from '../components/Loading';

const Stack = createNativeStackNavigator();

export default function Routes({ socket }: { socket: any }) {
  const { isVerified, setIsVerified, setToken, token, setUser } = useAuth();
  const { data: user, isLoading } = useUser(token);

  useEffect(() => {
    getItemAsync('token').then((res) => {
      setToken(res);
      console.log('token', res);
    });

    if (user) {
      setUser(user);
      if (user.authSteps === 6 && user.tempJWT) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    }
  }, [token, , user]);

  if (token && isLoading) {
    return <Loading />;
  }

  return (
    <Stack.Navigator>
      {!isVerified ? (
        <Stack.Screen
          name='Auth'
          component={AuthStackScreen}
          initialParams={{ token }}
        />
      ) : (
        <Stack.Screen
          name='Root'
          component={Home}
          initialParams={{ socket, token }}
          options={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        />
      )}

      <Stack.Screen
        name='Notifications'
        component={NotificationScreen}
        initialParams={{ token }}
      />
      <Stack.Screen name='UserAccountScreen' component={UserAccountScreen} />
      <Stack.Screen
        options={{
          presentation: 'modal',
          headerShown: false,
        }}
        name='CreateChat'
        component={CreateChatScreen}
      />
      <Stack.Screen name='Chat' component={ChatScreen} />
      <Stack.Group
        screenOptions={{
          headerBlurEffect: 'dark',
          presentation: 'modal',
          headerShown: false,
        }}
      >
        <Stack.Screen
          name='Settings'
          component={SettingsScreen}
          initialParams={{ setIsVerified }}
          options={{
            contentStyle: {
              backgroundColor: COLORS.secondaryDark,
            },
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
