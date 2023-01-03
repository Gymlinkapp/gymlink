import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useMutation } from 'react-query';
import { z } from 'zod';
import Button from '../../components/button';
import { COLORS } from '../../utils/colors';
import api from '../../utils/axiosStore';
import { save, getValueFor } from '../../utils/secureStore';
import { useEffect, useState } from 'react';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { useAuth } from '../../utils/context';

const userDetailsSchema = z.object({
  firstName: z.string().min(1).max(20),
  lastName: z.string().min(1).max(20),
  email: z.string().email(),
  age: z.number().min(16).max(100),
  password: z.string().min(8).max(20),
});

export default function UserAuthDetailsScreen({ route, navigation }) {
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const { token, setToken } = useAuth();
  useEffect(() => {
    getItemAsync('long').then((long) => {
      setLongitude(parseFloat(long));
    });
    getItemAsync('lat').then((lat) => {
      setLatitude(parseFloat(lat));
    });
  }, [latitude, longitude]);
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      age: 18,
      password: '',
    },
  });
  const { code, phoneNumber } = route.params;
  console.log(phoneNumber);
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;

  console.log(errors);

  const saveUserDetails = useMutation(
    async (data: z.infer<typeof userDetailsSchema>) => {
      try {
        return await api.post(
          '/auth/details',
          {
            phoneNumber: phoneNumber,
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            age: data.age,
            password: data.password,
            longitude: longitude,
            latitude: latitude,
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
      onSuccess: async (data) => {
        if (data) {
          console.log(data.data);
          await setItemAsync('token', data.data.token).then((res) => {
            console.log('token saved', res);
          });
          setToken(data.data.token);
          navigation.navigate('UserBaseAccount', {
            token: data.data.token,
          });
        }
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const onSubmit = async (data: z.infer<typeof userDetailsSchema>) => {
    try {
      Number(data.age);
      return saveUserDetails.mutateAsync(data);
      //   console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className='flex-1 px-12'>
      <View className='py-12'>
        <Text className='text-2xl font-MontserratBold text-primaryWhite'>
          Setup your Account
        </Text>
        <Text className='text-base font-MontserratRegular text-secondaryWhite'>
          Enter your details to continue
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior='position'
        keyboardVerticalOffset={keyboardVerticalOffset}
      >
        <FlatList
          className='bg-primaryDark'
          data={[1]}
          renderItem={() => (
            <>
              <Controller
                control={control}
                name='firstName'
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error, isTouched },
                }) => (
                  <View className='my-2'>
                    <Text className='text-white py-2 text-l font-MontserratMedium'>
                      First Name
                    </Text>
                    <TextInput
                      className={`bg-secondaryDark rounded-md p-4 w-full border-none text-white font-[MontserratMedium] ${
                        isTouched && 'border-2 border-tertiaryDark'
                      }`}
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
                )}
              />
              <Controller
                control={control}
                name='lastName'
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error, isTouched },
                }) => (
                  <View className='my-2'>
                    <Text className='text-white py-2 text-l font-MontserratMedium'>
                      Last Name
                    </Text>
                    <TextInput
                      className={`bg-secondaryDark rounded-md p-4 w-full border-none text-white font-[MontserratMedium] ${
                        isTouched && 'border-2 border-tertiaryDark'
                      }`}
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
                )}
              />
              <View className='flex-row'>
                <Controller
                  control={control}
                  name='email'
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { isTouched, error },
                  }) => (
                    <View className='my-2 flex-1'>
                      <Text className='text-white py-2 text-l font-MontserratMedium'>
                        Email
                      </Text>
                      <TextInput
                        className={`bg-secondaryDark rounded-md p-4 w-full border-none text-white font-[MontserratMedium] ${
                          isTouched && 'border-2 border-tertiaryDark'
                        }`}
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
                  )}
                />
                <Controller
                  control={control}
                  name='age'
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { isTouched, error },
                  }) => (
                    <View className='my-2 flex-[0.35] ml-4'>
                      <Text className='text-white py-2 text-l font-MontserratMedium'>
                        Age
                      </Text>
                      <TextInput
                        className={`bg-secondaryDark rounded-md p-4 w-full border-none text-white font-[MontserratMedium] ${
                          isTouched && 'border-2 border-tertiaryDark'
                        }`}
                        cursorColor={COLORS.mainWhite}
                        value={value.toString() || ''}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(parseInt(value) || 0)}
                        keyboardType='numeric'
                      />
                      {error && (
                        <Text className='text-red-500 font-MontserratRegular'>
                          {error.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>
              <Controller
                control={control}
                name='password'
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error, isTouched },
                }) => (
                  <View className='my-2'>
                    <Text className='text-white py-2 text-l font-MontserratMedium'>
                      Password
                    </Text>
                    <TextInput
                      secureTextEntry
                      className={`bg-secondaryDark rounded-md p-4 w-full border-none text-white font-[MontserratMedium] ${
                        isTouched && 'border-2 border-tertiaryDark'
                      }`}
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
                )}
              />
            </>
          )}
        />
      </KeyboardAvoidingView>
      {Object.keys(errors).length === 0 && (
        <SafeAreaView className='flex-1 justify-end'>
          <Button variant='primary' onPress={handleSubmit(onSubmit)}>
            Continue
          </Button>
        </SafeAreaView>
      )}
    </View>
  );
}
