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
  TouchableOpacity,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import { useMutation, useQueryClient } from 'react-query';
import { z } from 'zod';
import Button from '../../components/button';
import { COLORS } from '../../utils/colors';
import api from '../../utils/axiosStore';
import { save, getValueFor } from '../../utils/secureStore';
import { useEffect, useState } from 'react';
import { getItemAsync, setItemAsync } from 'expo-secure-store';
import { useAuth } from '../../utils/context';
import AuthLayout from '../../layouts/AuthLayout';
import { CustomSelect } from '../../components/CustomSelect';

export const UserGenderBox = ({
  gender,
  isSelected,
  setSelected,
}: {
  gender: string;
  isSelected: boolean;
  setSelected: (gender: string) => void;
}) => {
  return (
    <TouchableOpacity
      className={`h-12 flex-1 mr-1 rounded-md border-[1px] border-secondaryDark ${
        isSelected ? 'bg-white' : 'bg-transparent'
      } justify-center items-center`}
      onPress={() => setSelected(gender)}
    >
      <Text
        className={`${
          isSelected ? 'text-primaryDark' : 'text-white'
        } font-MontserratRegular text-xs`}
      >
        {gender}
      </Text>
    </TouchableOpacity>
  );
};

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
  bio: z.string().min(1).max(1000),
  age: z.number().min(16).max(100),
});

export default function InitialUserDetailsPartTwo({ route, navigation }) {
  const { firstName, lastName } = route.params;
  const [gender, setGender] = useState('');
  const [genderError, setGenderError] = useState(false);
  const {
    control,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      age: 18,
      bio: '',
    },
  });
  console.log(errors);

  return (
    <AuthLayout
      title={`${firstName}, everyone loves doing bios 😑`}
      description='Let people know why you are here and what you like about the gym the most.'
    >
      <>
        <FlatList
          className='bg-primaryDark flex-1'
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
                      onChangeText={onChange}
                      onBlur={onBlur}
                      placeholder='Why are ya here? What do you like about the gym the most?'
                      placeholderTextColor={COLORS.tertiaryDark}
                      multiline
                      numberOfLines={4}
                      textAlignVertical='top' // This will align the text to the top of the TextInput
                      style={{
                        maxHeight: 120,
                        color: COLORS.mainWhite,
                        borderWidth: 1,
                        borderColor: COLORS.secondaryDark,
                        borderRadius: 10,
                        paddingHorizontal: 20,
                        paddingVertical: 50,
                        paddingTop: 15,
                        fontFamily: 'MontserratRegular',
                      }}
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
                  <View className='my-2 w-1/4'>
                    <Text className='text-white py-2 text-l font-MontserratMedium'>
                      Age
                    </Text>
                    <TextInput
                      className={`border-[1px] border-secondaryDark rounded-md p-4 w-full text-white font-[MontserratMedium]`}
                      cursorColor={COLORS.mainWhite}
                      value={value?.toString() || ''}
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

              <View className='my-2 mr-1 flex-[1.5]'>
                <Text className='text-white py-2 text-l font-MontserratMedium'>
                  Gender
                </Text>
                <View className='flex-row'>
                  <UserGenderBox
                    gender='Male'
                    isSelected={gender === 'Male'}
                    setSelected={setGender}
                  />
                  <UserGenderBox
                    gender='Female'
                    isSelected={gender === 'Female'}
                    setSelected={setGender}
                  />
                  <UserGenderBox
                    gender='Other'
                    isSelected={gender === 'Other'}
                    setSelected={setGender}
                  />
                </View>

                {genderError && (
                  <Text className='text-red-500 font-MontserratRegular'>
                    Must be selected
                  </Text>
                )}
              </View>
            </>
          )}
        />
        <Button
          variant='primary'
          onPress={() =>
            navigation.navigate('InitialUserDetailsPartThree', {
              firstName,
              lastName,
              bio: getValues('bio'),
              gender,
              age: getValues('age'),
            })
          }
        >
          Continue
        </Button>
      </>
    </AuthLayout>
  );
}
