import { SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import { COLORS } from '../../utils/colors';
import { z } from 'zod';
import { useEffect } from 'react';
import { save } from '../../utils/secureStore';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '../../components/button';
import api from '../../utils/axiosStore';

import { useMutation } from 'react-query';
import { setItemAsync } from 'expo-secure-store';

let OTPSchema = z.object({
  otp: z.string().min(6).max(6),
});
export default function OTPScreen({ navigation, route }) {
  const { code, phoneNumber } = route.params;
  console.log('phoneNumber', phoneNumber);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(OTPSchema),
    defaultValues: {
      otp: '',
    },
  });

  const verifyCode = useMutation(
    async (data: z.infer<typeof OTPSchema>) => {
      try {
        return await api.post(
          '/auth/verificationcode',
          {
            phoneNumber: phoneNumber,
            verificationCode: data.otp,
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
          if (data.data.token) {
            setItemAsync('token', data.data.token);
            navigation.navigate('Root', { screen: 'Home' });
          } else {
            navigation.navigate('UserAuthDetails', {
              phoneNumber: phoneNumber,
            });
          }
        }
      },
    }
  );

  const onSubmit = async (data: z.infer<typeof OTPSchema>) => {
    try {
      return await verifyCode.mutateAsync(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <SafeAreaView className='w-full px-6 flex-col'>
      <View className='pt-12'>
        <Text className='font-[MontserratBold] text-xl text-white'>
          Verification Code
        </Text>
        <Text className='font-MontserratRegular text-secondaryWhite'>
          We have sent a verification code to your phone number. Please enter
          the code below.
        </Text>
      </View>
      <View className='h-1/3'>
        <Controller
          control={control}
          name='otp'
          render={({ field: { onChange, onBlur, value } }) => (
            <OTPInputView
              style={{ width: '100%' }}
              pinCount={6}
              code={value}
              onCodeChanged={onChange}
              // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
              // onCodeChanged = {code => { this.setState({code})}}
              autoFocusOnLoad
              codeInputFieldStyle={styles.underlineStyleBase}
              codeInputHighlightStyle={styles.borderStyleHighLighted}
              onCodeFilled={(c) => {
                onSubmit({ otp: c });
              }}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  borderStyleHighLighted: {
    borderColor: COLORS.secondaryWhite,
    borderWidth: 2,
    borderRadius: 10,
  },

  underlineStyleBase: {
    borderRadius: 10,
    width: 45,
    height: 45,
    borderWidth: 2,
    borderColor: COLORS.tertiaryDark,
  },
});
