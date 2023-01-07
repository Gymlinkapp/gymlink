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
import axios from 'axios';
import { useAuth } from '../../utils/context';
import { useMutation } from 'react-query';
import { useLocation } from '../../hooks/useLocation';

const userGymLocationSchema = z.object({
  // experience: z.string().min(1).max(20),
  enteredGymLocation: z.string().min(1).max(100),
  gymLocation: z.object({
    name: z.string().min(1).max(100),
    latitude: z.number(),
    longitude: z.number(),
  }),
  bio: z.string().min(1).max(1000),
});

export default function UserAccountPrompts({ navigation }) {
  const location = useLocation();
  const [placesURL, setPlacesURL] = useState('');
  const [nearGyms, setNearGyms] = useState([]);
  const { token, long, lat, setLat, setLong } = useAuth();
  const [d, setD] = useState({});

  useEffect(() => {
    if (location) {
      setLat(location.coords.latitude);
      setLong(location.coords.longitude);
    }
  }, [location]);

  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userGymLocationSchema),
    defaultValues: {
      // experience: '',
      enteredGymLocation: '',
      gymLocation: null,
      bio: '',
    },
  });
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;
  const bottomOfScreen = Dimensions.get('window').height - 100;

  const autoCompleteGymLocations = async (input: string) => {
    // const apiKey = process.env.GOOGLE_API_KEY;
    const apiKey = 'AIzaSyBeVNaKylQx0vKkZ4zW8T_J01s2rUK7KQA&';
    const URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=gym&location=${lat}%2C${long}&radius=500&key=${apiKey}`;
    console.log(URL);
    try {
      const res = await axios.get(URL);
      setNearGyms(res.data.predictions);
      // console.log(nearGyms);
    } catch (error) {
      console.log(error);
    }
  };

  const saveUserGymLocation = useMutation(
    async (data: z.infer<typeof userGymLocationSchema>) => {
      try {
        return await api.post(
          `/users/${token}`,
          {
            bio: data.bio,
            authSteps: 5,
            gym: data.gymLocation,
            tempJWT: token,
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
        if (data && (data.data.step === 5 || data.data.gymId)) {
          setD(data.data);
          navigation.navigate('UserFavoriteMovements');
        }
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  const onSubmit = async (data: z.infer<typeof userGymLocationSchema>) => {
    console.log(data);
    await saveUserGymLocation.mutateAsync(data);
  };

  console.log(getValues('gymLocation'));
  console.log(errors);

  return (
    <SafeAreaView className='w-full h-full flex-1 relative'>
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
                      returnKeyType='done'
                      returnKeyLabel='done'
                      enablesReturnKeyAutomatically
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
                  name='enteredGymLocation'
                  render={({
                    field: { onChange, onBlur, value },
                    fieldState: { isTouched, error },
                  }) => (
                    <View className='my-2 flex-1'>
                      <Text className='text-white py-2 text-l font-MontserratMedium'>
                        What gym you at?
                      </Text>
                      <View className='flex-1'>
                        <TextInput
                          className={`bg-secondaryDark rounded-t-md p-4 w-full border-none text-white font-[MontserratMedium] ${
                            isTouched && 'border-2 border-tertiaryDark'
                          }`}
                          cursorColor={COLORS.mainWhite}
                          value={value}
                          onBlur={onBlur}
                          onChangeText={(value) => {
                            onChange(value);
                            autoCompleteGymLocations(value);
                          }}
                        />
                        {nearGyms.length > 0 && (
                          <View className='bg-secondaryDark rounded-b-md'>
                            <FlatList
                              data={nearGyms}
                              renderItem={({ item }) => (
                                <TouchableOpacity
                                  className='px-2 py-6 border-b-2 border-tertiaryDark'
                                  onPress={() => {
                                    setValue('gymLocation', {
                                      name: item.description,
                                      longitude: long,
                                      latitude: lat,
                                    });
                                    setValue(
                                      'enteredGymLocation',
                                      getValues('gymLocation').name
                                    );
                                    setNearGyms([]);
                                  }}
                                >
                                  <Text className='text-white font-MontserratMedium'>
                                    {item.description}
                                  </Text>
                                </TouchableOpacity>
                              )}
                            />
                          </View>
                        )}
                      </View>
                      {error && (
                        <Text className='text-red-500 font-MontserratRegular'>
                          {error.message}
                        </Text>
                      )}
                    </View>
                  )}
                />
              </View>

              {/* debugging stats for testflight // act as logs */}
              {/* <Text className='text-white'>
                Errors: {JSON.stringify(errors)}
              </Text> */}
              {/* <Text className='text-white'>Response: {JSON.stringify(d)}</Text>
              <Text className='text-white'>Lat: {lat}</Text>
              <Text className='text-white'>Long: {long}</Text> */}
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
