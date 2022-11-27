import { ScrollView, View } from 'react-native';
import {
  SafeAreaInsetsContext,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { COLORS } from '../utils/colors';
import Navbar from './navbar';

export default function Layout({ children }) {
  return (
    <>
      <ScrollView
        className='bg-primaryDark'
        contentInsetAdjustmentBehavior='automatic'
        style={{ paddingHorizontal: 16 }}
      >
        {children}
      </ScrollView>
      <SafeAreaView className='flex-1 bg-primaryDark text-primaryWhite flex flex-col justify-between relative'>
        <Navbar />
      </SafeAreaView>
    </>
  );
}
