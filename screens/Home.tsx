import { Dimensions, FlatList, Text, View } from 'react-native';
import Person from '../components/person';
import Layout from '../layouts/layout';
import { User } from '../utils/users';
import React, { useEffect, useRef, useState } from 'react';
import { calculateCardHeight, calculateSnapInterval } from '../utils/ui';
import { useUsers } from '../hooks/useUsers';
import useToken from '../hooks/useToken';
import Loading from '../components/Loading';
import Button from '../components/button';
import { ArrowBendDoubleUpLeft, ArrowBendLeftUp } from 'phosphor-react-native';
import { useMutation, useQueryClient } from 'react-query';
import api from '../utils/axiosStore';
import { useAuth } from '../utils/context';
import { snapToInterval } from '../utils/snapToInterval';
import { getFeedScrollIndex } from '../utils/getFeedScrollIndex';
import { LinearGradient } from 'expo-linear-gradient';

export default function HomeScreen({ navigation, route }) {
  const { token, user, setUser } = useAuth();
  const [feed, setFeed] = useState<User[]>(user?.feed || []);
  const { height } = Dimensions.get('window');
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);

  const queryClient = useQueryClient();

  const { data: users, isLoading, error } = useUsers(token);

  const returnToTop = () => {
    flatListRef.current.scrollToIndex({ index: 0, animated: true });
  };

  const onGoNext = (index: number) => {
    setTimeout(() => {
      flatListRef.current.scrollToIndex({ index: index + 1, animated: true });
    }, 250);
  };

  const seenUser = useMutation(
    async (id: string) => {
      try {
        return await api.post('/users/seeUser', {
          seenUserId: id,
          token,
        });
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: async (data) => {
        queryClient.invalidateQueries('user');

        flatListRef.current.scrollToIndex({
          index: currentIndex + 1,
          animated: true,
        });
      },
    }
  );

  const onScroll = async (e) => {
    const index = getFeedScrollIndex(e, height);

    if (index < currentIndex) {
      // seenUser.mutateAsync(feed[index - 1].id);

      // when the user scrolls, we want to not allow them to scroll back up
      flatListRef.current.scrollToIndex({
        index: currentIndex,
        animated: true,
        viewPosition: 0,
      });
    }
    setCurrentIndex(index);
  };

  if (isLoading) return <Loading />;
  return (
    <Layout navigation={navigation}>
      <LinearGradient
        pointerEvents='none'
        colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
        className='absolute -top-[100px] z-50 w-full h-80'
        start={[0, 0]}
        end={[0, 1]}
      />
      <FlatList
        ref={flatListRef}
        data={feed}
        keyExtractor={(item) => item.id}
        numColumns={3}
        renderItem={({ item: user, index }) => (
          <View className='bg-secondaryDark h-[250px] m-1 w-[33.33%]'>
            <View className=''></View>
          </View>
        )}
      />
    </Layout>
  );
}
