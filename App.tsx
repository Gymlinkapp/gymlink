import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { COLORS } from './utils/colors';

import { QueryClient, QueryClientProvider } from 'react-query';
import { io } from 'socket.io-client';
import Routes from './screens/routes';
import { AuthProvider, useAuth } from './utils/context';
import { CHAT_URL, URL } from './utils/url';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';
import { Button, Platform } from 'react-native';
import api from './utils/axiosStore';
import NotificationHandler from './utils/NotificationHandler';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { logStoredTime } from './utils/logStoredNotificationTime';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

const queryClient = new QueryClient();

// needs to be this for ios not localhost
const socket = io(CHAT_URL);
console.log(URL);

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState<any>(false);
  const notificationListener = useRef<any>();
  const [fontsLoaded] = useFonts({
    MontserratRegular: require('./assets/fonts/Montserrat-Regular.ttf'),
    MontserratMedium: require('./assets/fonts/Montserrat-Medium.ttf'),
    MontserratBold: require('./assets/fonts/Montserrat-Bold.ttf'),
    ProstoOne: require('./assets/fonts/ProstoOne-Regular.ttf'),
  });

  useEffect(() => {
    (async () => {
      const token = await registerForPushNotificationsAsync();
      setExpoPushToken(token);
    })();

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
    };
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
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
          <Routes socket={socket} />
          <NotificationHandler />
          {/* {__DEV__ && (
            <Button onPress={logStoredTime} title='Check Stored Time' />
          )} */}
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    api.post('/config/savePushToken', { token });
  } else {
    alert('Must use physical device for Push Notifications');
  }

  console.log(token);

  return token;
}

// const notifications = [
//   {
//     content: {
//       title: '?',
//       body: 'This is the first notification',
//       data: { data: 'goes here' },
//     },
//     trigger: {
//       /* scheduling details for the first notification */
//     },
//   },
// ];

// async function scheduleAllNotifications() {
//   for (const notification of notifications) {
//     await scheduleNotification(notification);
//   }
// }
