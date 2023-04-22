import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from './context';

export default function NotificationHandler() {
  const navigation = useNavigation();
  const {} = useAuth();

  useEffect(() => {
    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        if (
          response.notification.request.content.data.actionId === 'open_home'
        ) {
          // @ts-ignore
          navigation.navigate('Home');
        }
      });

    return () => {
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, [navigation]);

  return null;
}
