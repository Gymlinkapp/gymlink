import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import {
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { z } from 'zod';
import Button from '../../components/button';
import { COLORS } from '../../utils/colors';
import api from '../../utils/axiosStore';
import { useEffect, useState } from 'react';
import { getItemAsync } from 'expo-secure-store';

const userDetailsSchema = z.object({
  // experience: z.string().min(1).max(20),
  gymLocation: z.string(),
  bio: z.string(),
});

export default function UserAccountPrompts({ navigation }) {
  const [token, setToken] = useState('');
  useEffect(() => {
    getItemAsync('token').then((token) => {
      setToken(token);
    });
  }, []);
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      // experience: '',
      gymLocation: '',
      bio: '',
    },
  });
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;
  const bottomOfScreen = Dimensions.get('window').height - 100;

  const onSubmit = () => {
    (data: z.infer<typeof userDetailsSchema>) => {
      api.post(`/users/${token}`, {
        bio: data.bio,
        // experience: data.experience,
        // gymLocation: data.gymLocation,
        tempJWT: token,
      });
    };
    navigation.navigate('UserFavoriteMovements');
  };

  // console.log(Object.keys(errors).length);

  return (
    <SafeAreaView className='w-full h-full flex-1 relative '>
      <View className='py-6'>
        <Text className='text-2xl font-MontserratBold text-primaryWhite'>
          Final Touches
        </Text>
        <Text className='text-base font-MontserratRegular text-secondaryWhite'>
          Add some extra touches to your profile
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
                name='bio'
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error, isTouched },
                }) => (
                  <View className='my-2'>
                    <Text className='text-white py-2 text-l font-MontserratMedium'>
                      Bio
                    </Text>
                    <TextInput
                      className={`bg-secondaryDark rounded-md p-4 w-full border-none text-white font-[MontserratMedium] ${
                        isTouched && 'border-2 border-tertiaryDark'
                      }`}
                      cursorColor={COLORS.mainWhite}
                      value={value}
                      onBlur={onBlur}
                      multiline
                      numberOfLines={10}
                      onChangeText={onChange}
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
                  name='gymLocation'
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { isTouched, error },
                  }) => (
                    <View className='my-2 flex-1'>
                      <Text className='text-white py-2 text-l font-MontserratMedium'>
                        What gym you at?
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
                {/* <Controller
                  control={control}
                  name='experience'
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { isTouched, error },
                  }) => (
                    <View className='my-2 flex-1 ml-4'>
                      <Text className='text-white py-2 text-l font-MontserratMedium'>
                        Years of experience
                      </Text>
                      <TextInput
                        className={`bg-secondaryDark rounded-md p-4 w-full border-none text-white font-[MontserratMedium] ${
                          isTouched && 'border-2 border-tertiaryDark'
                        }`}
                        cursorColor={COLORS.mainWhite}
                        value={value.toString()}
                        onBlur={onBlur}
                        onChangeText={(value) => onChange(parseInt(value))}
                        keyboardType='numeric'
                      />
                      {error && (
                        <Text className='text-red-500 font-MontserratRegular'>
                          {error.message}
                        </Text>
                      )}
                    </View>
                  )}
                /> */}
              </View>
            </>
          )}
        />
      </KeyboardAvoidingView>

      {Object.keys(errors).length === 0 && (
        <View className='flex-1 justify-end'>
          <Button variant='primary' onPress={handleSubmit(onSubmit)}>
            Continue
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}
