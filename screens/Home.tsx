import { Text, TouchableOpacity, View } from 'react-native';
import Layout from '../layouts/layout';
import React, { useState } from 'react';

import { useAuth } from '../utils/context';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { COLORS } from '../utils/colors';
import HomeFeed from '../components/HomeFeed';
import AnswerPrompt from '../components/AnswerPrompt';
import { FlatList } from 'react-native-gesture-handler';
import { Plus } from 'phosphor-react-native';

export default function HomeScreen({ navigation, route }) {
  const { prompt, canAnswerPrompt } = useAuth();

  const [screen, setScreen] = useState('home');
  const slidePosition = screen === 'home' ? 0 : 1;

  return (
    <Layout navigation={navigation}>
      <LinearGradient
        pointerEvents='none'
        colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
        className='absolute -top-[100px] z-50 w-full h-80'
        start={[0, 0]}
        end={[0, 1]}
      />
      <LinearGradient
        pointerEvents='none'
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,1)']}
        className='absolute bottom-0 z-50r w-full h-80'
        start={[0, 0]}
        end={[0, 1]}
      />
      <View
        style={{
          overflow: 'hidden',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '50%',
          alignSelf: 'center',
          backgroundColor: COLORS.secondaryDark,
          paddingVertical: 10,
          borderRadius: 999,
          zIndex: 50,
        }}
      >
        <MotiView
          animate={{
            translateX: slidePosition === 0 ? -50 : 50, // Adjust the value '100' based on your desired sliding distance
            backgroundColor: '#724CF9',
          }}
          style={{
            position: 'absolute',
            borderRadius: 50,
            padding: 20,
            width: '40%',
          }}
        />
        <TouchableOpacity
          onPress={() => setScreen('home')}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 50,
            marginRight: 4,
          }}
        >
          <Text style={{ color: 'white', fontFamily: 'ProstoOne' }}>
            For You
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setScreen('explore')}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 50,
            marginLeft: 4,
          }}
        >
          <Text style={{ color: 'white', fontFamily: 'ProstoOne' }}>
            Explore
          </Text>
        </TouchableOpacity>
      </View>

      {/* <Filters /> */}
      {prompt && canAnswerPrompt && <AnswerPrompt />}
      {screen === 'home' ? (
        <HomeFeed navigation={navigation} />
      ) : (
        <View className='z-50 px-6 py-12 relative'>
          <TouchableOpacity className='bg-accent w-16 h-16 rounded-full justify-center items-center absolute top-[65%] right-5 z-50'>
            <Plus color='#fff' size={21} weight='fill' />
          </TouchableOpacity>
          <Text className='text-white text-2xl font-ProstoOne mb-4'>
            Explore
          </Text>
          <FlatList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 400 }}
            data={[1, 2, 3, 4, 5, 6, 7, 8]}
            renderItem={({ item }) => (
              <TouchableOpacity className='bg-secondaryDark rounded-3xl p-4 mb-4'>
                <View className='flex-row  items-center mb-2'>
                  <View className='flex-row items-center'>
                    <View className='w-6 h-6 bg-tertiaryDark rounded-full mr-2' />
                    <Text className='text-white text-md font-ProstoOne'>
                      Name
                    </Text>
                  </View>
                  <Text className='text-tertiaryDark text-xs font-MontserratRegular ml-auto'>
                    Yesterday, 25th April
                  </Text>
                </View>
                <View>
                  <Text className='text-white font-MontserratRegular'>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      )}
    </Layout>
  );
}
