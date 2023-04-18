import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import Layout from '../layouts/layout';
import React, { useEffect, useRef, useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import Loading from '../components/Loading';
import { useAuth } from '../utils/context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Filters from '../components/Filters';
import { FilterType, defaultFilters } from '../utils/types/filter';
import { useMutation } from 'react-query';
import api from '../utils/axiosStore';

export default function HomeScreen({ navigation, route }) {
  const LIMIT = 9;
  const INITIAL_SCROLL_POSITION = 250;
  const { token, user, setUser, filters, setFilters, feed, setFeed } =
    useAuth();
  const flatListRef = useRef(null);
  const [columnData, setColumnData] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(INITIAL_SCROLL_POSITION);
  const [offset, setOffset] = useState(0);
  const { data: users } = useUsers(token);
  const [isOffsetFeedLoading, setIsOffsetFeedLoading] = useState(false);

  const [hasInitialScrolled, setHasInitialScrolled] = useState(false);

  function splitArrayIntoColumns(array: any[] = [], numColumns: number) {
    const columnArrays = Array.from({ length: numColumns }, () => []);
    array.forEach((item, index) => {
      columnArrays[index % numColumns].push(item);
    });
    return columnArrays;
  }

  const isLoading = !users;

  function handlescroll(e) {
    setScrollPosition(e.nativeEvent.contentOffset.y);
  }

  useEffect(() => {
    if (user) {
      setFilters(defaultFilters);
    }
    if (!isLoading && users) {
      setFeed(users);

      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: INITIAL_SCROLL_POSITION - 200,
          animated: true,
        });
        setHasInitialScrolled(true);
      }, 500);
    }
  }, [isLoading, users, user]);

  useEffect(() => {
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
    setColumnData(columnData);
  }, [feed]);

  const updateFeed = (newData) => {
    const updatedFeed = [...feed, ...newData];
    setFeed(updatedFeed);
    const updatedColumns = splitArrayIntoColumns(updatedFeed, 3);
    const updatedColumnData = updatedColumns.map((column, index) => {
      return {
        data: column,
        scrollFactor: columnData[index].scrollFactor,
      };
    });
    setColumnData(updatedColumnData);
  };

  const loadMoreMutation = useMutation(
    async () => {
      try {
        return await api.post(
          '/users/findNearUsers',
          {
            token,
            offset,
            limit: LIMIT,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: async (data) => {
        if (data) {
          try {
            const newData = data.data.users;
            if (newData.length === 0) {
              console.log('no more');
              return;
            }

            if (newData.length < LIMIT) {
              console.log('less than limit');
            }
            updateFeed(newData);
            setOffset((prev) => prev + LIMIT);
          } catch (error) {
            console.log('here', error);
          }
        }
      },
      onError: (error) => {
        console.log('uh', error);
      },
    }
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Layout navigation={navigation}>
      <LinearGradient
        pointerEvents='none'
        colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0)']}
        className='absolute -top-[100px] z-50 w-full h-80'
        start={[0, 0]}
        end={[0, 1]}
      />

      <Filters />
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
        onEndReached={() => {
          if (hasInitialScrolled) {
            setIsOffsetFeedLoading(true);
            loadMoreMutation.mutate();
          }
        }}
        ListFooterComponent={() => loadMoreMutation.isLoading && <Loading />}
        onEndReachedThreshold={0.1}
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

{
  /* <TouchableOpacity>
                <Text>Load More</Text>
              </TouchableOpacity> */
}
