import { useForm, Controller } from 'react-hook-form';
import { KeyboardAvoidingView, SafeAreaView, Text, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PhoneInput from 'react-native-phone-number-input';
import { COLORS } from '../../utils/colors';
import Button from '../../components/button';
import api from '../../utils/axiosStore';
import { useMutation } from 'react-query';
import { useAuth } from '../../utils/context';

let phoneNumberSchema = z.object({
  phoneNumber: z.string().min(10).max(10),
  callingCode: z.string().min(1).max(3),
});

export default function RegisterScreen({ navigation }) {
  const { setPhoneNumber, phoneNumber } = useAuth();
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(phoneNumberSchema),
    defaultValues: {
      phoneNumber: '',
      callingCode: '1',
    },
  });
  const sendSMS = useMutation(
    async (phoneNumber: string) => {
      setPhoneNumber(phoneNumber);
      try {
        return await api.post(
          '/auth/sendsms',
          {
            phoneNumber: phoneNumber,
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
      onSuccess: (data) => {
        if (data) {
          navigation.navigate('OTPScreen', {
            code: data.data.code,
            phoneNumber: phoneNumber,
          });
        }
      },
    }
  );

  const onSubmit = async (data: z.infer<typeof phoneNumberSchema>) => {
    return await sendSMS.mutateAsync(data.callingCode + data.phoneNumber);
    // mutation.mutate({
    //   phoneNumber: data.callingCode + data.phoneNumber,
    // });
  };

  return (
    <SafeAreaView className='justify-between h-full'>
      <KeyboardAvoidingView className='justify-center mt-12 p-4'>
        <Controller
          control={control}
          name='phoneNumber'
          rules={{ maxLength: 10 }}
          render={({ field: { onChange, onBlur, value, name } }) => (
            <View>
              <View className='pb-12 px-6'>
                <Text className='text-2xl font-MontserratBold text-primaryWhite'>
                  Enter your phone number to get started.
                </Text>
                <Text className='text-base font-MontserratRegular text-secondaryWhite'>
                  We will send you a code to verify your phone number and get
                  started on your account.
                </Text>
              </View>
              <PhoneInput
                onChangeCountry={(country) => {
                  setValue('callingCode', country.callingCode[0]);
                }}
                value={value}
                onChangeText={(val) => {
                  setValue('phoneNumber', val);
                }}
                defaultCode='US'
                withDarkTheme
                placeholder='902 291 011'
                codeTextStyle={{ color: COLORS.mainWhite }}
                disableArrowIcon
                containerStyle={{
                  borderRadius: 999,
                  width: '100%',
                  backgroundColor: COLORS.secondaryDark,
                }}
                textInputStyle={{
                  color: COLORS.mainWhite,
                  fontFamily: 'MontserratRegular',
                }}
                textContainerStyle={{
                  backgroundColor: COLORS.secondaryDark,
                  borderRadius: 999,
                }}
              />
              {errors.phoneNumber && (
                <Text className='text-red-500 text-sm'>
                  {errors.phoneNumber.message}
                </Text>
              )}
            </View>
          )}
        />
        <Button
          variant='primary'
          isLoading={sendSMS.isLoading}
          onPress={handleSubmit(onSubmit)}
          className='mt-4'
        >
          Send code
        </Button>
      </KeyboardAvoidingView>
      <View className='mb-4'>
        <Button
          variant='secondary'
          className='mt-4'
          onPress={() => navigation.navigate('InitialUserDetails')}
        >
          Signup with Email
        </Button>
        <Button
          variant='ghost'
          className='mt-4'
          onPress={() => {
            navigation.navigate('EmailLoginScreen');
          }}
        >
          Signin with Email
        </Button>
      </View>
    </SafeAreaView>
  );
}
