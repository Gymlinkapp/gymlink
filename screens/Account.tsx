import { getItemAsync } from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useUser } from '../hooks/useUser';

export default function AccountScreen({ navigation }) {
  const [token, setToken] = useState(null);
  useEffect(() => {
    setToken(getItemAsync('token'));
  }, []);
  const { data: user, isLoading, error } = useUser(token);
  console.log('error: ', error);
  console.log('loading: ', isLoading);

  console.log(user);
  return (
    <View>
      <Text className='text-white'>Account</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <Text className='text-white'>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}
