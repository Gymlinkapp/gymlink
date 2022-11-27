import { SafeAreaView, Text, View } from 'react-native';

export default function Header() {
  return (
    <SafeAreaView className='bg-primaryDark'>
      <View className='pb-6'>
        <Text className='text-white text-center font-[MontserratBold] text-xl'>
          Gymlink
        </Text>
      </View>
    </SafeAreaView>
  );
}
