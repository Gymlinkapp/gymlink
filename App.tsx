import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import HomeScreen from './screens/Home';
import Header from './components/header';
import { COLORS } from './utils/colors';
import Chats from './screens/Chats';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  HouseSimple,
  Chats as ChatsIcon,
  UserCircle,
} from 'phosphor-react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import NotificationScreen from './screens/Notifications';
import AccountScreen from './screens/Account';
import UserAccountScreen from './screens/UserAccount';
import SettingsScreen from './screens/Settings';
import RegisterScreen from './screens/auth/Register';
import { useEffect, useState } from 'react';
import { getValueFor } from './utils/secureStore';
import OTPScreen from './screens/auth/OTP';
import { QueryClient, QueryClientProvider } from 'react-query';
import UserAuthDetailsScreen from './screens/auth/Details';
import * as SecureStore from 'expo-secure-store';
import FinishUserBaseAccountScreen from './screens/auth/FinishUserBaseAccount';
import UserAccountPrompts from './screens/auth/UserAccountPrompts';
import UserFavoriteMovements from './screens/auth/UserFavoriteMovements';
import { useLocation } from './hooks/useLocation';
import * as Location from 'expo-location';
import { io } from 'socket.io-client';
import EmailLoginScreen from './screens/auth/EmailLoginScreen';
import useToken from './hooks/useToken';
import CreateChatScreen from './screens/CreateChat';
import ChatScreen from './screens/Chat';
import FriendsScreen from './screens/Friends';
import { User } from './utils/users';
import api from './utils/axiosStore';
import { useUser } from './hooks/useUser';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const queryClient = new QueryClient();

// needs to be this for ios not localhost
const socket = io('http://10.0.1.198:3000');

const AuthStack = createNativeStackNavigator();

export const stepToScreen = {
  0: 'Register',
  1: 'OTPScreen',
  2: 'UserAuthDetails',
  3: 'UserBaseAccount',
  4: 'UserPrompts',
  5: 'UserFavoriteMovements',
  6: 'EmailLoginScreen',
};

function AuthStackScreen({ navigation, route }) {
  const [step, setStep] = useState('Register');
  const [token, setToken] = useState('');
  const { data: user, isLoading } = useUser(token);
  const { notAUserOrNotFinishedAuth } = route.params;

  useEffect(() => {
    SecureStore.getItemAsync('token').then((token) => {
      if (token) {
        setToken(token);
      }
    });
    if (!isLoading && user && user.authSteps !== 6) {
      setStep(stepToScreen[user.authSteps]);
      navigation.navigate(step);
    }
  }, [token, user, isLoading, step]);
  console.log('step', step);
  return (
    <AuthStack.Navigator>
      {notAUserOrNotFinishedAuth && (
        <>
          <AuthStack.Screen
            name='Register'
            component={RegisterScreen}
            options={{
              headerShown: false,
            }}
          />
          <AuthStack.Screen
            name='OTPScreen'
            component={OTPScreen}
            options={{
              headerShown: false,
            }}
          />
          <AuthStack.Screen
            name='UserAuthDetails'
            component={UserAuthDetailsScreen}
            options={{
              headerShown: false,
            }}
          />
          <AuthStack.Screen
            name='UserBaseAccount'
            component={FinishUserBaseAccountScreen}
            options={{
              headerShown: false,
            }}
          />
          <AuthStack.Screen
            name='UserPrompts'
            component={UserAccountPrompts}
            options={{
              headerShown: false,
            }}
          />
          <AuthStack.Screen
            name='UserFavoriteMovements'
            component={UserFavoriteMovements}
            options={{
              headerShown: false,
            }}
          />
          <AuthStack.Screen
            name='EmailLoginScreen'
            component={EmailLoginScreen}
            options={{
              headerShown: false,
            }}
          />
        </>
      )}
    </AuthStack.Navigator>
  );
}

function Home({ route }) {
  const { isAUserAndFinishedAuth } = route.params;
  const glowEffect = (focused: boolean) => {
    return {
      shadowColor: focused ? COLORS.accent : COLORS.secondaryWhite,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: focused ? 10 : 0.5,
      shadowRadius: focused ? 10 : 5,
      elevation: 5,
    };
  };
  return (
    <Tab.Navigator
      initialRouteName='Home'
      screenOptions={({ route, navigation }) => ({
        header: () => <Header navigation={navigation} route={route} />,
        headerStyle: {
          backgroundColor: COLORS.primaryDark,
        },
      })}
    >
      {isAUserAndFinishedAuth && (
        <>
          <Tab.Screen
            name='Chats'
            initialParams={{ socket }}
            options={{
              tabBarIcon: ({ focused }) => (
                <ChatsIcon
                  style={glowEffect(focused)}
                  color={focused ? COLORS.accent : COLORS.secondaryWhite}
                  size={32}
                  weight={focused ? 'fill' : 'bold'}
                />
              ),
              headerStyle: {
                backgroundColor: COLORS.primaryDark,
              },
            }}
            component={Chats}
          />
          <Tab.Screen
            name='Friends'
            initialParams={{ socket }}
            options={{
              tabBarIcon: ({ focused }) => (
                <ChatsIcon
                  style={glowEffect(focused)}
                  color={focused ? COLORS.accent : COLORS.secondaryWhite}
                  size={32}
                  weight={focused ? 'fill' : 'bold'}
                />
              ),
              headerStyle: {
                backgroundColor: COLORS.primaryDark,
              },
            }}
            component={FriendsScreen}
          />
          <Tab.Screen
            name='Home'
            options={{
              tabBarIcon: ({ focused }) => (
                <HouseSimple
                  style={glowEffect(focused)}
                  color={focused ? COLORS.accent : COLORS.secondaryWhite}
                  size={32}
                  weight={focused ? 'fill' : 'bold'}
                />
              ),

              headerStyle: {
                backgroundColor: COLORS.primaryDark,
              },
            }}
            component={HomeScreen}
          />

          <Tab.Screen
            name='Account'
            options={{
              tabBarIcon: ({ focused }) => (
                <UserCircle
                  // greate a glow effect
                  style={glowEffect(focused)}
                  color={focused ? COLORS.accent : COLORS.secondaryWhite}
                  size={32}
                  weight={focused ? 'fill' : 'bold'}
                />
              ),
              headerStyle: {
                backgroundColor: COLORS.primaryDark,
              },
            }}
            component={AccountScreen}
          />
        </>
      )}
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    SecureStore.getItemAsync('token').then((res) => {
      console.log('token', res);
      setToken(res);
    });

    if (token) {
      api
        .get(`/users/${token}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.log('err', err);
        });
    }
  }, [token]);

  // if there is a token, i want to get the user, if there is a user that means that they have been through the auth process or some of the auth process which means they need to finish the auth process

  const [fontsLoaded] = useFonts({
    MontserratRegular: require('./assets/fonts/Montserrat-Regular.ttf'),
    MontserratMedium: require('./assets/fonts/Montserrat-Medium.ttf'),
    MontserratBold: require('./assets/fonts/Montserrat-Bold.ttf'),
  });
  if (!fontsLoaded) {
    return null;
  }
  const notAUserOrNotFinishedAuth = !token || !user || user?.authSteps < 6;
  const isAUserAndFinishedAuth = token && user && user.authSteps === 6;
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer
        theme={{
          colors: {
            background: COLORS.primaryDark,
            text: COLORS.mainWhite,
            primary: COLORS.mainWhite,
            card: COLORS.primaryDark,
            border: COLORS.primaryDark,
            notification: COLORS.mainWhite,
          },
          dark: true,
        }}
      >
        <Stack.Navigator>
          <Stack.Screen
            name='Auth'
            component={AuthStackScreen}
            initialParams={{ token, notAUserOrNotFinishedAuth }}
          />
          <Stack.Screen
            name='Root'
            component={Home}
            initialParams={{ socket, token, isAUserAndFinishedAuth }}
            options={{
              headerShown: false,
              animation: 'slide_from_right',
            }}
          />

          <Stack.Screen
            name='Notifications'
            component={NotificationScreen}
            initialParams={{ token }}
          />
          <Stack.Screen
            name='UserAccountScreen'
            component={UserAccountScreen}
          />
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
              options={{
                contentStyle: {
                  backgroundColor: COLORS.secondaryDark,
                },
              }}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
