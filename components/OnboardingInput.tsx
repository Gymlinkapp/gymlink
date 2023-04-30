import { Text, TextInput, View } from 'react-native';
import { COLORS } from '../utils/colors';

export default function OnboardingInput({
  value,
  onChange,
  onBlur,
  error,
  isTouched,
  label,
  ...props
}: {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error: any;
  isTouched: boolean;
  label: string;
}) {
  return (
    <View className='my-2'>
      <Text className='text-white py-2 text-l font-MontserratMedium'>
        {label}
      </Text>
      <TextInput
        {...props}
        className={`border-[1px] border-secondaryDark rounded-md p-4 w-full border-none text-white font-[MontserratMedium]`}
        cursorColor={COLORS.mainWhite}
        value={value}
        onBlur={onBlur}
        onChangeText={(value) => onChange(value)}
      />
      {error && (
        <Text className='text-red-500 font-MontserratRegular'>
          {error.message}
        </Text>
      )}
    </View>
  );
}
