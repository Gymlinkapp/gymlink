import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { deleteItemAsync, getItemAsync, setItemAsync } from 'expo-secure-store';
import OnboardingStack from './OnboardingStack';
import RootHomeScreen from './RootHomeScreen';
import NotificationScreen from './Notifications';
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
import CreateSplit from './auth/CreateGymSplit';
import EditAccount from './EditAccount';
import ProfileInfo from './ProfileInfo';
import { useAuthState } from '../hooks/useAuthState';
import getMostRecentPrompt from '../utils/getMostRecentPrompt';

const Stack = createNativeStackNavigator();

export default function Routes({ socket }: { socket: any }) {
  const { isVerified, setIsVerified, isLoadingAuth, token, isTokenChecked } =
    useAuthState();
  const { setSocket, user, setCanAnswerPrompt, setPrompt } = useAuth();

  // saving socket to context inititally
  useEffect(() => {
    setSocket(socket);

    // i want to check if the most recent userPrompts was answered yet
    if (user) {
      const lastPrompt = getMostRecentPrompt(user);
      console.log('lastPrompt', lastPrompt);
      if (lastPrompt && lastPrompt.hasAnswered === false) {
        setCanAnswerPrompt(true);
      } else {
        setCanAnswerPrompt(false);
      }
      const res = api.post('/social/getPromptById', {
        promptId: lastPrompt.promptId,
      });

      res
        .then((res) => {
          console.log('prompt', res.data.prompt.prompt);
          setPrompt(res.data.prompt);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user, socket, setCanAnswerPrompt, setPrompt, setSocket, token]);

  // deleteItemAsync('token');
  if (isLoadingAuth || (token && !isTokenChecked)) {
    return <Loading />;
  }

  if (token && !isVerified) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name='Onboarding'
          component={OnboardingStack}
          initialParams={{ setIsVerified }}
        />
      </Stack.Navigator>
    );
  }

  if (!token || !isTokenChecked) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name='Onboarding'
          component={OnboardingStack}
          initialParams={{ setIsVerified }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
        name='Home'
        component={RootHomeScreen}
        initialParams={{ socket }}
      />

      <Stack.Screen
        name='Notifications'
        component={NotificationScreen}
        initialParams={{ token }}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='Chat'
        component={ChatScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='Profile'
        component={ProfileScreen}
        options={{
          animation: 'fade_from_bottom',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='ProfileInfo'
        component={ProfileInfo}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Group
        screenOptions={{
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
        <Stack.Screen name='AddSplit' component={CreateSplit} />
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
          name='EditAccount'
          component={EditAccount}
          options={{
            contentStyle: {
              backgroundColor: COLORS.primaryDark,
            },
          }}
        />
      </Stack.Group>
    </Stack.Navigator>
  );
}
