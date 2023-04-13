import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { COLORS } from './utils/colors';

import { QueryClient, QueryClientProvider } from 'react-query';
import { io } from 'socket.io-client';
import Routes from './screens/routes';
import { AuthProvider, useAuth } from './utils/context';
import { CHAT_URL, URL } from './utils/url';

const queryClient = new QueryClient();

// needs to be this for ios not localhost
const socket = io(CHAT_URL);
console.log(URL);

export default function App() {
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
        </NavigationContainer>
      </AuthProvider>
    </QueryClientProvider>
  );
}
