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
import { useUser } from './hooks/useUser';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const queryClient = new QueryClient();

// needs to be this for ios not localhost
const socket = io('http://10.0.1.198:3000');

function Home() {
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
    </Tab.Navigator>
  );
}

export default function App() {
  const token = useToken();
  const location = useLocation();

  const [fontsLoaded] = useFonts({
    MontserratRegular: require('./assets/fonts/Montserrat-Regular.ttf'),
    MontserratMedium: require('./assets/fonts/Montserrat-Medium.ttf'),
    MontserratBold: require('./assets/fonts/Montserrat-Bold.ttf'),
  });
  if (!fontsLoaded) {
    return null;
  }
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
          {!token && (
            <>
              <Stack.Screen name='Register' component={RegisterScreen} />
              <Stack.Screen name='OTPScreen' component={OTPScreen} />
              <Stack.Screen
                name='UserAuthDetails'
                component={UserAuthDetailsScreen}
              />
              <Stack.Screen
                name='UserBaseAccount'
                component={FinishUserBaseAccountScreen}
              />
              <Stack.Screen name='UserPrompts' component={UserAccountPrompts} />
              <Stack.Screen
                name='UserFavoriteMovements'
                component={UserFavoriteMovements}
              />
              <Stack.Screen
                name='EmailLoginScreen'
                component={EmailLoginScreen}
              />
            </>
          )}
          <>
            <Stack.Screen
              name='Root'
              component={Home}
              initialParams={{ socket, token }}
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
          </>
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
}
