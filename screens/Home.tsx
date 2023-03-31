import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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
import { BlurView } from 'expo-blur';

// const onScroll = async (e) => {
//   const index = getFeedScrollIndex(e, height);

//   if (index < currentIndex) {
//     // seenUser.mutateAsync(feed[index - 1].id);

//     // when the user scrolls, we want to not allow them to scroll back up
//     flatListRef.current.scrollToIndex({
//       index: currentIndex,
//       animated: true,
//       viewPosition: 0,
//     });
//   }
//   setCurrentIndex(index);
// };

const FeedColumn = ({ data, index }) => {
  return (
    <FlatList
      data={data} // use the filtered arrays for each column
      keyExtractor={(item) => item.id}
      listKey={index + Math.random()}
      className='flex-1'
      renderItem={({ item: user, index }) => (
        <View className='h-[250px] m-[0.5px] relative overflow-hidden rounded-3xl'>
          <Image
            source={{ uri: user.images[0] }}
            className='absolute top-0 left-0 w-full h-full object-cover'
          />
        </View>
      )}
    />
  );
};

function splitArrayIntoColumns(array, numColumns) {
  const columnArrays = Array.from({ length: numColumns }, () => []);
  array.forEach((item, index) => {
    columnArrays[index % numColumns].push(item);
  });
  return columnArrays;
}

export default function HomeScreen({ navigation, route }) {
  const INITIAL_SCROLL_POSITION = 250;
  const { token, user, setUser } = useAuth();
  const flatListRef = useRef(null);
  const [columnData, setColumnData] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(INITIAL_SCROLL_POSITION);
  const { data: users } = useUsers(token);
  const [feed, setFeed] = useState<User[]>(user?.feed || users);
  // const [feed, setFeed] = useState<User[]>(users);
  const [hasInitialScrolled, setHasInitialScrolled] = useState(false);

  const isLoading = !users;

  function handlescroll(e) {
    setScrollPosition(e.nativeEvent.contentOffset.y);
  }

  useEffect(() => {
    if (!isLoading && users) {
      const numColumns = 3;
      const scrollFactors = Array.from({ length: numColumns }, (__, index) => {
        if (index === 1) {
          return Math.random() * 0.1 + 0.05;
        } else {
          return Math.random() * 0.2 + 0.1;
        }
      });

      const columns = splitArrayIntoColumns(feed, numColumns);
      const columnData = columns.map((column, index) => {
        return {
          data: column,
          scrollFactor: scrollFactors[index],
        };
      });

      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: INITIAL_SCROLL_POSITION - 200,
          animated: true,
        });
        setHasInitialScrolled(true);
      }, 500);

      setColumnData(columnData);
    }
  }, [isLoading, users, feed]);

  if (isLoading) {
    return <Loading />;
  }

  console.log(feed[0]);

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
        data={columnData}
        keyExtractor={(item) => item.id}
        numColumns={3}
        columnWrapperStyle={{ flex: 1 }}
        onScroll={handlescroll}
        initialScrollIndex={0}
        initialNumToRender={10}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        className='min-h-full'
        renderItem={({ item: column, index }) => {
          return (
            <FlatList
              data={column.data} // use the filtered arrays for each column
              keyExtractor={(item) => item.id}
              className='flex-1'
              listKey={`${index + Math.random()}`}
              style={{
                transform: [
                  {
                    translateY:
                      -(scrollPosition - INITIAL_SCROLL_POSITION) *
                      column.scrollFactor,
                  },
                ],
              }}
              renderItem={({ item: user, index }) => (
                <TouchableOpacity
                  className='h-[250px] m-[0.5px] relative overflow-hidden rounded-3xl justify-end'
                  onPress={() => {
                    navigation.navigate('Profile', {
                      user: user,
                    });
                  }}
                >
                  <View className='z-50 p-4'>
                    <View className='overflow-hidden rounded-full w-8 h-8'>
                      <BlurView
                        className='bg-primaryDark/20 w-full h-full rounded-full justify-center items-center'
                        intensity={25}
                      >
                        <Text className=' text-white font-MontserratRegular'>
                          {user.age}
                        </Text>
                      </BlurView>
                    </View>
                    <Text className='text-white font-MontserratBold text-xl'>
                      {user.firstName}
                    </Text>
                  </View>
                  <View className='absolute top-0 left-0 w-full h-full'>
                    <LinearGradient
                      pointerEvents='none'
                      colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
                      className='absolute bottom-0 left-0 z-50 w-full h-full'
                      locations={[0, 0.5]}
                      // bottom to top
                      start={[0, 1]}
                      end={[1, 0]}
                    />
                    <Image
                      source={{ uri: user.images[0] }}
                      className='w-full h-full object-cover'
                    />
                  </View>
                </TouchableOpacity>
              )}
            />
          );
        }}
      />
    </Layout>
  );
}
