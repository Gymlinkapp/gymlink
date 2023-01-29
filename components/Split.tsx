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
import Button from './button';

export default function Split({
  split,
  navigation,
}: {
  split: WeekSplit[];
  navigation?: any;
}) {
  const { height, width } = Dimensions.get('window');

  if (split.length === 0) return null;
  return (
    <View className='mt-12'>
      <View className='py-4 flex-row justify-between items-center'>
        <Text className='font-MontserratBold text-white text-2xl'>Split</Text>
        <Button
          variant='primary'
          textSize='sm'
          onPress={() => {
            navigation.navigate('EditSplit', { split });
          }}
        >
          Edit
        </Button>
      </View>
      <ScrollView
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
    </View>
  );
}
