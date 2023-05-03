import * as Progress from "react-native-progress";
import { COLORS } from "../utils/colors";

type Props = {
  color?: string;
  size?: number;
}
export default function Spinner({color, size}: Props) {
  return (
    <Progress.Circle
      size={size || 18}
      indeterminate={true}
      color={color || COLORS.mainWhite}
      shouldRasterizeIOS
    />
  );
}
