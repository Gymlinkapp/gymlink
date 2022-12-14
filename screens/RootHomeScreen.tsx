import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Header from '../components/header';
import { COLORS } from '../utils/colors';
import {
  HouseSimple,
  Chats as ChatsIcon,
  UserCircle,
} from 'phosphor-react-native';
import FriendsScreen from './Friends';
import HomeScreen from './Home';
import AccountScreen from './Account';
import Chats from './Chats';

const Tab = createBottomTabNavigator();

export default function Home({ route }) {
  const { socket } = route.params;
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
