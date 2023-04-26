import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { getItemAsync } from 'expo-secure-store';

const PromptCountdown = () => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const calculateTimeRemaining = async () => {
      const randomHour = await getItemAsync('randomHour');
      const randomMinute = await getItemAsync('randomMinute');

      const currentDate = new Date();
      const targetDate = new Date();

      targetDate.setHours(Number(randomHour));
      targetDate.setMinutes(Number(randomMinute));
      targetDate.setSeconds(0);

      if (currentDate > targetDate) {
        targetDate.setDate(targetDate.getDate() + 1);
      }

      const timeDiff = targetDate.getTime() - currentDate.getTime();
      setTimeRemaining(timeDiff);
    };

    calculateTimeRemaining();

    const interval = setInterval(calculateTimeRemaining, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimeRemaining = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <View className='bg-secondaryDark py-2 px-4 rounded-full border-[1px] border-dashed border-tertiaryDark'>
      <Text className='font-ProstoOne text-tertiaryDark '>
        {formatTimeRemaining(timeRemaining)}
      </Text>
    </View>
  );
};

export default PromptCountdown;
