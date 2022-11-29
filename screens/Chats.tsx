import { NavigationState } from '@react-navigation/native';
import { Text, View } from 'react-native';
import Layout from '../layouts/layout';

interface ChatsProps {
  navigation: NavigationState;
}

export default function Chats({ navigation }: ChatsProps) {
  return (
    <View className='flex-1 bg-primaryDark'>
      <Text className='text-white'>test</Text>
    </View>
  );
}
