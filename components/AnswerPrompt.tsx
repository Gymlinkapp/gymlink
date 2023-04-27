import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import PromptCountdown from './PromptCountdown';
import { useMutation, useQueryClient } from 'react-query';
import { useState } from 'react';
import { useAuth } from '../utils/context';
import api from '../utils/axiosStore';
import * as Haptics from 'expo-haptics';

export default function AnswerPrompt() {
  const queryClient = useQueryClient();
  const [userPromptAnswer, setUserPromptAnswer] = useState('');
  const { user, canAnswerPrompt, prompt, setCanAnswerPrompt } = useAuth();

  const answerPromptMutation = useMutation(
    (answer: string) =>
      api.post('/social/answerPrompt', {
        answer,
        userId: user.id,
        promptId: prompt.id,
      }),
    {
      onSuccess: (data) => {
        setCanAnswerPrompt(false);
        queryClient.invalidateQueries('user');
        queryClient.invalidateQueries('users');
      },
    }
  );
  return (
    <View className='z-50 mt-20 bg-transparent'>
      <View className='w-full flex-row justify-end mb-2'>
        <PromptCountdown />
      </View>
      <View className='border-[1px] border-dashed border-tertiaryDark rounded-3xl'>
        <View className='px-6 pt-4'>
          <Text className='font-ProstoOne text-tertiaryDark'>
            Let people know your Vibe
          </Text>
          <Text className='font-ProstoOne text-white'>{prompt.prompt}</Text>

          <TextInput
            className='w-full p-4 bg-secondaryDark rounded-md mt-4 font-MontserratMedium text-white'
            onChangeText={(text) => setUserPromptAnswer(text)}
          />
        </View>

        <TouchableOpacity
          className='w-full border-t-[1px] border-secondaryDark items-center mt-4 py-4'
          onPress={() => {
            answerPromptMutation.mutate(userPromptAnswer);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          }}
        >
          <Text className='font-ProstoOne text-white'>Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
