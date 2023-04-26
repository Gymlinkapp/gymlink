import { Text, View } from 'react-native';
import { Prompt } from '../utils/types/prompt';
import PromptCountdown from './PromptCountdown';

export default function UserPrompt({
  prompt,
  answer,
}: {
  prompt: string;
  answer: string;
}) {
  return (
    <View>
      <View className='w-full flex-row justify-end'>
        <PromptCountdown />
      </View>
      <View className='border-[1px] border-dashed border-tertiaryDark rounded-[15px] p-6 mt-4'>
        <Text className='font-ProstoOne text-secondaryWhite text-md'>
          {prompt}
        </Text>
        {answer ? (
          <Text className='font-ProstoOne text-white text-xl'>{answer}</Text>
        ) : (
          <Text className='font-ProstoOne text-tertiaryDark text-xl'>
            No vibes here, yet... stay tuned...
          </Text>
        )}
      </View>
    </View>
  );
}
