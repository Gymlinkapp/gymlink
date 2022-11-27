import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useFonts } from 'expo-font';
import { useColorScheme } from 'nativewind';
import Layout from './layouts/layout';
import HomeScreen from './screens/Home';
import Header from './components/header';
import { COLORS } from './utils/colors';

const Stack = createNativeStackNavigator();
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
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          header: Header,
          headerStyle: {
            backgroundColor: COLORS.primaryDark,
          },
        }}
      >
        <Stack.Screen
          name='Home'
          options={{
            headerStyle: {
              backgroundColor: COLORS.primaryDark,
            },
          }}
          component={HomeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
