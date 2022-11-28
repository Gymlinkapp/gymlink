import React from 'react';
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { COLORS } from '../utils/colors';

type ButtonProps = {
  children: React.ReactNode;
  type: 'primary' | 'secondary';
};

export default function Button({ children, type }: ButtonProps) {
  function getButtonStyleBg(): ViewStyle {
    const defaultStyle: ViewStyle = {
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderRadius: 999,
      display: 'flex',
      alignItems: 'center',
      marginVertical: 4,
      flex: 1,
    };
    switch (type) {
      case 'primary':
        return {
          backgroundColor: COLORS.mainWhite,
          ...defaultStyle,
        };
      case 'secondary':
        return {
          backgroundColor: COLORS.secondaryDark,
          borderWidth: 1,
          borderColor: COLORS.tertiaryDark,
          ...defaultStyle,
        };
    }
  }
  function getButtonTextColor(): StyleProp<TextStyle> {
    const defaultStyle: StyleProp<TextStyle> = {
      fontFamily: 'MontserratBold',
      fontSize: 16,
    };
    switch (type) {
      case 'primary':
        return {
          color: COLORS.primaryDark,
          ...defaultStyle,
        };
      case 'secondary':
        return {
          color: COLORS.mainWhite,
          ...defaultStyle,
        };
    }
  }
  return (
    <TouchableOpacity style={getButtonStyleBg()}>
      <Text style={getButtonTextColor()}>{children}</Text>
    </TouchableOpacity>
  );
}
