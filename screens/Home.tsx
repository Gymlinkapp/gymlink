import {
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import Layout from '../layouts/layout';
import React, { useEffect, useRef, useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import Loading from '../components/Loading';
import { useAuth } from '../utils/context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Filters from '../components/Filters';
import { defaultFilters } from '../utils/types/filter';
import FeedLoading from '../components/FeedLoading';

export default function HomeScreen({ navigation, route }) {
  const INITIAL_COL_OFFSETS = [50, 150, 100];
  const LIMIT = 9;
  const INITIAL_SCROLL_POSITION = 250;
  const USER_HEIGHT = 250;
  const { token, user, setUser, filters, setFilters, feed, setFeed } =
    useAuth();
  const flatListRef = useRef(null);
  const [columnData, setColumnData] = useState([]);
  const [scrollPosition, setScrollPosition] = useState(INITIAL_SCROLL_POSITION);
  const [offset, setOffset] = useState(0);
  const { data, isLoading, isFetching } = useUsers(token, offset, LIMIT);
  const [animatedScrolls, setAnimatedScrolls] = useState(
    INITIAL_COL_OFFSETS.map((offset) => new Animated.Value(offset))
  );
  const [hasInitialScrolled, setHasInitialScrolled] = useState(false);

  function splitArrayIntoColumns(array: any[] = [], numColumns: number) {
    const columnArrays = Array.from({ length: numColumns }, () => []);
    array.forEach((item, index) => {
      columnArrays[index % numColumns].push(item);
    });
    return columnArrays;
  }

  useEffect(() => {
    if (user) {
      setFilters(defaultFilters);
    }
    if (!isLoading && data && data.users) {
      setFeed(data.users);

      setTimeout(() => {
        flatListRef.current?.scrollToOffset({
          offset: INITIAL_SCROLL_POSITION - 200,
          animated: true,
        });
        setHasInitialScrolled(true);
      }, 500);
    }
  }, [isLoading, data, user]);

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

    const newAnimatedScrolls = columnData.map(
      (column) => new Animated.Value(0)
    );
    setAnimatedScrolls(newAnimatedScrolls);
  }, [feed, data, isFetching]);

  const handleScroll = (event, columnIndex) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    animatedScrolls[columnIndex].setValue(offsetY);
  };

  // const updateFeed = (newData: User[]) => {
  //   const updatedFeed = newData.filter((incomingUser) => {
  //     return !feed.find((user) => user.id === incomingUser.id);
  //   });
  //   setFeed(updatedFeed);
  //   const updatedColumns = splitArrayIntoColumns(updatedFeed, 3);
  //   const updatedColumnData = updatedColumns.map((column, index) => {
  //     return {
  //       data: column,
  //       scrollFactor: columnData[index].scrollFactor,
  //     };
  //   });
  //   setColumnData(updatedColumnData);
  // };

  if (isLoading) {
    return <FeedLoading />;
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
        initialScrollIndex={0}
        initialNumToRender={10}
        removeClippedSubviews={true}
        showsVerticalScrollIndicator={false}
        className='min-h-full'
        onEndReached={() => {
          if (hasInitialScrolled && offset < data.totalUsers) {
            setOffset((prev) => prev + LIMIT);
          }
        }}
        ListFooterComponent={() => isFetching && <Loading />}
        onEndReachedThreshold={0.1}
        renderItem={({ item: column, index }) => {
          const scrollY = animatedScrolls[index];

          return (
            <Animated.FlatList
              data={column.data} // use the filtered arrays for each column
              keyExtractor={(item) => item.id}
              onScroll={(event) => handleScroll(event, index)}
              scrollEventThrottle={128}
              className='flex-1'
              listKey={`column-${index}-${column.id}-${Date.now()}`}
              renderItem={({ item: user, index }) => (
                <TouchableOpacity
                  key={index}
                  className='h-[250px] m-[0.5px] relative bg-transparent  justify-end'
                  onPress={() => {
                    navigation.navigate('Profile', {
                      user: user,
                    });
                  }}
                >
                  <Animated.View
                    className='h-full overflow-hidden justify-end rounded-3xl'
                    style={{
                      transform: [
                        {
                          translateY: scrollY.interpolate({
                            inputRange: [0, 1],
                            outputRange: [0, -column.scrollFactor],
                          }),
                        },
                      ],
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
                  </Animated.View>
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
