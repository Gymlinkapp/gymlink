import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import RegisterScreen from './auth/Register';
import OTPScreen from './auth/OTP';
import UserAuthDetailsScreen from './auth/Details';
import FinishUserBaseAccountScreen from './auth/FinishUserBaseAccount';
import UserAccountPrompts from './auth/UserAccountPrompts';
import UserFavoriteMovements from './auth/UserFavoriteMovements';
import EmailLoginScreen from './auth/EmailLoginScreen';
import { useAuth } from '../utils/context';

export const stepToScreen = {
  0: 'Register',
  1: 'OTPScreen',
  2: 'UserAuthDetails',
  3: 'UserBaseAccount',
  4: 'UserPrompts',
  5: 'UserFavoriteMovements',
  6: 'EmailLoginScreen',
};

const AuthStack = createNativeStackNavigator();

export default function AuthStackScreen({ navigation, route }) {
  const { isVerified, setIsVerified } = route.params;
  const [step, setStep] = useState('Register');
  const { token } = useAuth();
  const { data: user, isLoading } = useUser(token);

  useEffect(() => {
    if (!isLoading && user && user.authSteps !== 6) {
      setStep(stepToScreen[user.authSteps]);
      navigation.navigate(step);
    }
  }, [token, user, isLoading, step]);
  console.log('step', step);
  return (
    <AuthStack.Navigator>
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
        initialParams={{ setIsVerified }}
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
    </AuthStack.Navigator>
  );
}
