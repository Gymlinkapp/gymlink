import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Navbar() {
  return (
    <SafeAreaView className='flex flex-col justify-end flex-1 absolute inset-0'>
      <View className='bg-secondaryDark text-primaryWhite w-full h-14 rounded-full'>
        <Text className='text-white'>
          karhon is a big jew, the biggest jew ever
        </Text>
      </View>
    </SafeAreaView>
  );
}
