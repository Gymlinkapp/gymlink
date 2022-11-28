import { ReactElement, JSXElementConstructor } from 'react';
import {
  Animated,
  FlatList,
  ListRenderItemInfo,
  ScrollView,
  View,
} from 'react-native';
import {
  SafeAreaInsetsContext,
  SafeAreaView,
} from 'react-native-safe-area-context';
import { COLORS } from '../utils/colors';
import Navbar from './navbar';

export default function Layout({ children }) {
  return (
    <>
      <>{children}</>
      <SafeAreaView className='flex-1 bg-primaryDark text-primaryWhite flex flex-col justify-between relative'>
        <Navbar />
      </SafeAreaView>
    </>
  );
}
