import { zodResolver } from '@hookform/resolvers/zod';
import api from '../../utils/axiosStore';
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
import { z } from 'zod';
import Button from '../../components/button';
import { COLORS } from '../../utils/colors';
import { useMutation, useQueryClient } from 'react-query';
import { setItemAsync } from 'expo-secure-store';
import { useAuth } from '../../utils/context';
import AuthLayout from '../../layouts/AuthLayout';
import OnboardingInput from '../../components/OnboardingInput';
const userLoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

export default function EmailLoginScreen({ navigation }) {
  const { setIsVerified, setToken } = useAuth();
  const queryClient = useQueryClient();
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 100 : 0;
  const {
    handleSubmit,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const signIn = useMutation(
    async (data: any) => {
      try {
        return await api.post('/auth/signin', data);
      } catch (error) {
        console.log(error);
      }
    },
    {
      onSuccess: (data) => {
        if (data) {
          setItemAsync('token', data.data.token);
          setToken(data.data.token);
          setIsVerified(true);
          queryClient.invalidateQueries('user');
        }
      },
    }
  );
  const onSubmit = async (data: z.infer<typeof userLoginSchema>) => {
    try {
      signIn.mutate(data);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <AuthLayout
      title='Login with Email'
      description='Enter your email and password to login'
    >
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
                name='email'
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error, isTouched },
                }) => (
                  <OnboardingInput
                    label='Email'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={error}
                    isTouched={isTouched}
                  />
                )}
              />
              <Controller
                control={control}
                name='password'
                render={({
                  field: { onChange, onBlur, value },
                  fieldState: { error, isTouched },
                }) => (
                  <OnboardingInput
                    label='Password'
                    value={value}
                    onBlur={onBlur}
                    onChange={onChange}
                    error={error}
                    isTouched={isTouched}
                    // @ts-expect-error -- TSCONVERSION
                    secureTextEntry
                  />
                )}
              />
            </>
          )}
        />

        <Button
          isLoading={signIn.isLoading}
          variant='primary'
          onPress={handleSubmit(onSubmit)}
        >
          Login
        </Button>
      </KeyboardAvoidingView>
    </AuthLayout>
    // </SafeAreaView>
  );
}
