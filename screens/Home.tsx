import { Text, TouchableOpacity, View } from 'react-native';
import Layout from '../layouts/layout';
import React, { useState } from 'react';

import { useAuth } from '../utils/context';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { COLORS } from '../utils/colors';
import HomeFeed from '../components/HomeFeed';
import AnswerPrompt from '../components/AnswerPrompt';
import PostsFeed from '../components/PostsFeed';

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
        <PostsFeed navigation={navigation} />
      )}
    </Layout>
  );
}
