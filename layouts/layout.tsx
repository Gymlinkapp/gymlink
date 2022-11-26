import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../utils/colors';
import Navbar from './navbar';

export default function Layout({ children }) {
  return (
    <SafeAreaView className='flex-1 bg-primaryDark text-primaryWhite flex flex-col justify-between relative'>
      <View>{children}</View>
      <Navbar />
    </SafeAreaView>
  );
}
