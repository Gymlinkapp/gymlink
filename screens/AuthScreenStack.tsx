import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { useUser } from '../hooks/useUser';
import RegisterScreen from './auth/Register';
import OTPScreen from './auth/OTP';
import InitialUserDetails from './auth/Details';
import UserImageUpload from './auth/UserImageUpload';
import UserGymLocation from './auth/UserGymLocation';
import UserFavoriteMovements from './auth/UserFavoriteMovements';
import EmailLoginScreen from './auth/EmailLoginScreen';
import { useAuth } from '../utils/context';

export const stepToScreen = {
  0: 'Register',
  1: 'OTPScreen',
  2: 'InitialUserDetails',
  3: 'UserImageUpload',
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
        name={stepToScreen[0]}
        component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={stepToScreen[1]}
        component={OTPScreen}
        initialParams={{ setIsVerified }}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={stepToScreen[2]}
        component={InitialUserDetails}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={stepToScreen[3]}
        component={UserImageUpload}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={stepToScreen[4]}
        component={UserGymLocation}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={stepToScreen[5]}
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
