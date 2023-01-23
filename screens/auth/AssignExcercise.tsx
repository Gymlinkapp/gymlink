import { TouchableOpacity, View, Text } from "react-native";
import AuthLayout from "../../layouts/AuthLayout";
import DropDownPicker from "react-native-dropdown-picker";
import { useState } from "react";
import Button from "../../components/button";

export default function AssignExcercise({ route, navigation }) {
  const [value, setValue] = useState<string[]>([]);
  const [items, setItems] = useState([
    { label: "Monday", value: "monday" },
    { label: "Tuesday", value: "tuesday" },
    { label: "Wednesday", value: "wednesday" },
    { label: "Thursday", value: "thursday" },
    { label: "Friday", value: "friday" },
    { label: "Saturday", value: "saturday" },
    { label: "Sunday", value: "sunday" },
  ]);
  const { exercise } = route.params;

  return (
    <AuthLayout
      title={`Assign ${exercise}`}
      description="Select day of the week."
    >
      <View className="flex-row flex-wrap">
        {items.map((item) => (
          <TouchableOpacity
            className={`${
              value.includes(item.value) ? "bg-white" : "bg-secondaryDark"
            } m-1 px-6 py-4 rounded-full`}
            onPress={() => {
              if (value.includes(item.value)) {
                // if the item is already selected, remove it from the array
                setValue(value.filter((val) => val !== item.value));
              } else {
                // if the item is not selected, add it to the array
                setValue([...value, item.value]);
              }
            }}
          >
            <Text
              className={`${
                value.includes(item.value) ? "text-primaryDark" : "text-white"
              }`}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button variant="primary" onPress={() => {
        // navigate back and pass the `value` array to the previous screen
        navigation.navigate("UserGymSplit", { value });
      }}>
        Done
      </Button>
    </AuthLayout>
  );
}
