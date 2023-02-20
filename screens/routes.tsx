import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import AuthStackScreen from './AuthScreenStack';
import Home from './RootHomeScreen';
import NotificationScreen from './Notifications';
import UserAccountScreen from './UserAccount';
import CreateChatScreen from './CreateChat';
import ChatScreen from './Chat';
import SettingsScreen from './Settings';
import { COLORS } from '../utils/colors';
import api from '../utils/axiosStore';
import { useUser } from '../hooks/useUser';
import { useAuth } from '../utils/context';
import Loading from '../components/Loading';
import ProfileScreen from './Profile';
import { AUTH_STEPS } from '../utils/users';
import EditSplit from './EditSplit';
import AssignExcercise from './auth/AssignExcercise';

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
      if (user.authSteps === AUTH_STEPS && user.tempJWT) {
        setIsVerified(true);
      } else {
        setIsVerified(false);
      }
    }
    if (!token) {
      setIsVerified(false);
    }
  }, [token, , user]);

  // deleteItemAsync('token');
  return (
    <Stack.Navigator>
      {!isVerified ? (
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name='Auth'
          component={AuthStackScreen}
          initialParams={{ setIsVerified }}
        />
      ) : (
        <Stack.Screen
          options={{
            headerShown: false,
          }}
          name='Home'
          component={Home}
          initialParams={{ socket }}
        />
      )}
      <Stack.Screen
        name='Notifications'
        component={NotificationScreen}
        initialParams={{ token }}
        options={{
          headerShown: false,
        }}
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
          name='AssignExcercise'
          component={AssignExcercise}
          initialParams={{ setIsVerified }}
        />
        <Stack.Screen name='EditSplit' component={EditSplit} />
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
        <Stack.Screen
          name='Profile'
          component={ProfileScreen}
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
