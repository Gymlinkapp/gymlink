import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { FlatList, Platform, Text, TextInput, View } from 'react-native';
import { useMutation, useQueryClient } from 'react-query';
import { z } from 'zod';
import Button from '../../components/button';
import { COLORS } from '../../utils/colors';
import api from '../../utils/axiosStore';
import { useState } from 'react';
import { useAuth } from '../../utils/context';
import AuthLayout from '../../layouts/AuthLayout';
import { setItemAsync } from 'expo-secure-store';
import OnboardingInput from '../../components/OnboardingInput';

const races = [
  { value: 'asian', label: 'Asian' },
  { value: 'black', label: 'Black or African American' },
  { value: 'hispanic', label: 'Hispanic or Latino' },
  { value: 'native', label: 'Native American or Alaska Native' },
  { value: 'pacific', label: 'Native Hawaiian or Pacific Islander' },
  { value: 'white', label: 'White' },
  { value: 'multiracial', label: 'Multiracial' },
  { value: 'other', label: 'Other' },
];

const userDetailsSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export default function InitialUserDetailsPartThree({ route, navigation }) {
  const { firstName, bio, gender, age, lastName } = route.params;
  const [longitude, setLongitude] = useState(0);
  const { token, setToken, phoneNumber } = useAuth();
  const queryClient = useQueryClient();
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  console.log(firstName, bio, gender, age, lastName);

  console.log(errors);

  console.log('phoneNumber', phoneNumber);

  const saveUserDetails = useMutation(
    async (data: z.infer<typeof userDetailsSchema>) => {
      try {
        return await api.post(
          '/auth/initialUserDetails',
          {
            password: data.password,
            firstName: firstName,
            bio: bio,
            lastName: lastName,
            age: age,
            email: data.email,
            gender: gender.toLowerCase(),
            phoneNumber: phoneNumber || null,
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
        console.log('data', data.data);
        if (data.data.authStep === 3) {
          try {
            setItemAsync('token', data.data.token)
              .then(() => {
                setToken(data.data.token);
                if (token) {
                  queryClient.invalidateQueries('user');
                }
              })
              .catch((err) => {
                console.log(err);
              });
          } catch (error) {
            console.log('here', error);
          }
        }
      },
      onError: (error) => {
        console.log('uh', error);
      },
    }
  );

  const onSubmit = async (data: z.infer<typeof userDetailsSchema>) => {
    try {
      Number(age);
      return saveUserDetails.mutateAsync(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthLayout
      title={`${firstName}, alright let's secure your account.`}
      description='Enter your email and password to create an account.'
    >
      <>
        <FlatList
          className='bg-primaryDark flex-1'
          data={[1]}
          renderItem={() => (
            <>
              <Controller
                control={control}
                name='email'
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { isTouched, error },
                }) => (
                  <OnboardingInput
                    error={error}
                    label='Email'
                    isTouched={isTouched}
                    onBlur={onBlur}
                    onChange={(value) => onChange(value)}
                    value={value}
                  />
                )}
              />

              <Controller
                control={control}
                name='password'
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { isTouched, error },
                }) => (
                  <View className='my-2 flex-1 mr-2'>
                    <Text className='text-white py-2 text-l font-MontserratMedium'>
                      Password
                    </Text>
                    <TextInput
                      secureTextEntry
                      passwordRules='minlength: 8; required: lower; required: upper; required: digit;'
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
                )}
              />
            </>
          )}
        />
        <Button
          variant='primary'
          isLoading={saveUserDetails.isLoading}
          onPress={handleSubmit(onSubmit)}
        >
          Continue
        </Button>
      </>
    </AuthLayout>
  );
}
