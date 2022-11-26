import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Layout from './layouts/layout';
import HomeScreen from './screens/Home';
import { COLORS } from './utils/colors';

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name='Home'
          options={{
            title: 'test',
            headerStyle: {
              backgroundColor: COLORS.secondaryDark,
            },
            headerTintColor: COLORS.mainWhite,
          }}
          component={HomeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
