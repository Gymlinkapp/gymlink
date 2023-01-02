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

const userDetailsSchema = z.object({
  // experience: z.string().min(1).max(20),
  enteredGymLocation: z.string().min(1).max(100),
  gymLocation: z.object({
    name: z.string().min(1).max(100),
    latitude: z.number(),
    longitude: z.number(),
  }),
  bio: z.string(),
});

export default function UserAccountPrompts({ navigation }) {
  const [token, setToken] = useState('');
  const [longitude, setLongitude] = useState(0);
  const [latitude, setLatitude] = useState(0);
  const [placesURL, setPlacesURL] = useState('');
  const [nearGyms, setNearGyms] = useState([]);
  useEffect(() => {
    getItemAsync('token').then((token) => {
      setToken(token);
    });
    getItemAsync('long').then((long) => {
      setLongitude(parseFloat(long));
    });
    getItemAsync('lat').then((lat) => {
      setLatitude(parseFloat(lat));
    });
  }, [longitude, latitude]);
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
    const URL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=gym&location=${latitude}%2C${longitude}&radius=500&key=${apiKey}`;
    console.log(URL);
    try {
      const res = await axios.get(URL);
      setNearGyms(res.data.predictions);
      // console.log(nearGyms);
    } catch (error) {
      console.log(error);
    }
  };

  const onSubmit = async (data: z.infer<typeof userDetailsSchema>) => {
    try {
      const res = await api.post(`/users/${token}`, {
        bio: data.bio,
        authSteps: 5,
        gym: data.gymLocation,
        tempJWT: token,
      });

      if (res.status === 200) {
        navigation.navigate('UserFavoriteMovements');
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(getValues('gymLocation'));
  console.log(errors);

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
                                      longitude: longitude,
                                      latitude: latitude,
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

      {/* {Object.keys(errors).length === 0 && ( */}
      <View className='flex-1 justify-end'>
        <Button variant='primary' onPress={handleSubmit(onSubmit)}>
          Continue
        </Button>
      </View>
      {/* )} */}
    </SafeAreaView>
  );
}
