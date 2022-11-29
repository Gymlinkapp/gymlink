import { Text, TouchableOpacity, View } from 'react-native';

export default function AccountScreen({ navigation }) {
  return (
    <View>
      <Text className='text-white'>Account</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
        <Text className='text-white'>Settings</Text>
      </TouchableOpacity>
    </View>
  );
}
