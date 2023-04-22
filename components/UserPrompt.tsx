import { Text, View } from 'react-native';

export default function UserPrompt({
  prompt,
  answer,
}: {
  prompt: string;
  answer: string;
}) {
  return (
    <View className='border-[1px] border-dashed border-tertiaryDark rounded-[15px] p-6 mt-4'>
      <Text className='font-ProstoOne text-secondaryWhite text-md'>
        {prompt}
      </Text>
      <Text className='font-ProstoOne text-white text-xl'>{answer}</Text>
    </View>
  );
}
