import { useMutation, useQueryClient } from "react-query";
import { useAuth } from "../utils/context";
import api from "../utils/axiosStore";

export default function useDeleteUser(userId: string) {
  const queryClient = useQueryClient();
  return useMutation(
    async () => {
      try {
        return await api.post(
          '/users/delete',
          {
            userId: userId,
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
        try {
          console.log(data);
          await queryClient.invalidateQueries('users');
          await queryClient.invalidateQueries('user');
          await queryClient.invalidateQueries('userProfile')
          
        } catch (error) {
          console.log(error);
        }
      },
    }
  );
}
