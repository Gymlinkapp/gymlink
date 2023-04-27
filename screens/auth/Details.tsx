import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { FlatList, Text, TouchableOpacity } from 'react-native';
import { z } from 'zod';
import Button from '../../components/button';
import { useAuth } from '../../utils/context';
import AuthLayout from '../../layouts/AuthLayout';
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
  firstName: z.string().min(1).max(20),
  lastName: z.string().min(1).max(20),
});

export default function InitialUserDetails({ route, navigation }) {
  const { phoneNumber } = useAuth();
  const {
    control,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userDetailsSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
    },
  });

  console.log(errors);

  console.log('phoneNumber', phoneNumber);

  return (
    <AuthLayout
      title='Setup your Account'
      description='Enter your details to continue'
    >
      <>
        <FlatList
          className='bg-primaryDark flex-1'
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
                  <OnboardingInput
                    label='First Name'
                    value={value}
                    onBlur={onBlur}
                    onChange={(value) => onChange(value)}
                    error={error}
                    isTouched={isTouched}
                  />
                )}
              />
              <Controller
                control={control}
                name='lastName'
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error, isTouched },
                }) => (
                  <OnboardingInput
                    label='Last Name'
                    value={value}
                    onBlur={onBlur}
                    onChange={(value) => onChange(value)}
                    error={error}
                    isTouched={isTouched}
                  />
                )}
              />
            </>
          )}
        />
        <Button
          variant='primary'
          onPress={() =>
            navigation.navigate('InitialUserDetailsPartTwo', {
              phoneNumber: phoneNumber,
              firstName:
                getValues('firstName').charAt(0).toUpperCase() +
                getValues('firstName').slice(1),
              lastName:
                getValues('lastName').charAt(0).toUpperCase() +
                getValues('lastName').slice(1),
            })
          }
        >
          Continue
        </Button>
      </>
    </AuthLayout>
  );
}
