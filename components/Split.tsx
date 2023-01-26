import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { WeekSplit } from '../utils/split';

export default function Split({ split }: { split: WeekSplit[] }) {
  const { height, width } = Dimensions.get('window');
  console.log(split);

  return (
    <ScrollView
      className='mt-12'
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ height: height / 1.25, paddingBottom: 50 }}
    >
      {split.map(
        (day, idx) =>
          day !== undefined && (
            <View key={idx} className='mb-2 flex-row'>
              <View className='bg-secondaryDark w-16 h-16 rounded-md justify-center items-center'>
                <Text className='text-white font-MontserratBold'>
                  {day.day[0].toUpperCase()}
                </Text>
              </View>
              <ScrollView
                horizontal
                className='ml-2 bg-secondaryDark rounded-md'
                contentContainerStyle={{
                  alignItems: 'center',
                  paddingHorizontal: 8,
                }}
              >
                {day.exercises.map((exercise, idx) => (
                  <TouchableOpacity
                    key={idx}
                    className='bg-primaryDark rounded-full px-6 py-4'
                  >
                    <Text className='text-white font-MontserratRegular'>
                      {exercise}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )
      )}
    </ScrollView>
  );
}
