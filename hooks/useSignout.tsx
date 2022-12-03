import { useMutation } from 'react-query';
import api from '../utils/axiosStore';

export default function useSignout(token: string, navigation: any) {
  return useMutation(
    async () => {
      try {
        return await api.post(
          '/auth/signout',
          {
            token: token,
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
      onSuccess: async () => {
        try {
        } catch (error) {
          console.log(error);
        }

        navigation.navigate('Register');
      },
    }
  );
}
