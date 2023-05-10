import { View } from "moti";
import { Modal} from "react-native";
import { UseMutationResult } from "react-query";
import Button from "./button";

type Props = {
  setModalVisible: (visible: boolean) => void;
  modalVisible: boolean;
  isLoading?: boolean;
  blockUser: UseMutationResult<any, unknown, string, unknown>; 
  userId: string;
}

export default function UserProfileOptionsModal({ setModalVisible, isLoading, modalVisible, blockUser, userId }: Props) {
  return (
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View className="flex-1 justify-end items-end w-full">
          <View className="bg-primaryDark w-full h-1/2 p-12 rounded-3xl border-[0.5px] border-secondaryDark">
            <View className="mb-4 h-full justify-end">
              <Button
                isLoading={isLoading}
                variant="danger"
                className="my-4 border-0"
                onPress={() => {
                  blockUser.mutate(userId);
                  setModalVisible(false);
                }
              }
              >
                Block
              </Button>
              <Button
                variant="secondary"
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
  )
}
