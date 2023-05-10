import {
  ClockClockwise,
  Eye,
  Gear,
  SignOut,
  User,
} from "phosphor-react-native";
import { SafeAreaView, Text, View } from "react-native";
import Button from "../components/button";
import { COLORS } from "../utils/colors";
import api from "../utils/axiosStore";
import * as SecureStore from "expo-secure-store";
import useSignout from "../hooks/useSignout";
import { useAuth } from "../utils/context";
import useDeleteUser from "../hooks/useDeleteUser";

export default function SettingsScreen({ navigation }) {
  const { setIsVerified, token, user } = useAuth();
  const signout = useSignout(token);
  const deleteUser = useDeleteUser(user.id)

  return (
    <SafeAreaView className="w-full h-full items-center flex-col-reverse">
      {__DEV__ && (
        <>
          <Button
            onPress={() => {
              SecureStore.deleteItemAsync("token");
              signout.mutate();

              navigation.popToTop();
              setIsVerified(false);
            }}
            variant="menu"
            icon={<ClockClockwise weight="fill" color={COLORS.mainWhite} />}
          >
            Reset
          </Button>
        </>
      )}

      <Button
        onPress={() => {
          SecureStore.deleteItemAsync("token");

          deleteUser.mutate();

          navigation.popToTop();
          setIsVerified(false);
        }}
        variant="danger"
        icon={<User weight="fill" color="rgb(239, 68, 68)" />}
      >
        Delete
      </Button>

      <Button
        onPress={() => {
          navigation.navigate("EditAccount");
        }}
        variant="menu"
        icon={<Gear weight="fill" color={COLORS.mainWhite} />}
      >
        Edit
      </Button>
      <Button
        onPress={() => {
          navigation.popToTop();

          navigation.navigate("Profile", {
            user: user,
          });
        }}
        variant="menu"
        icon={<Eye weight="fill" color={COLORS.mainWhite} />}
      >
        Preview
      </Button>
      <Button
        onPress={() => {
          SecureStore.deleteItemAsync("token");

          signout.mutate();

          navigation.popToTop();
          setIsVerified(false);
        }}
        variant="menu"
        icon={<SignOut weight="fill" color={COLORS.mainWhite} />}
      >
        Signout
      </Button>
    </SafeAreaView>
  );
}
