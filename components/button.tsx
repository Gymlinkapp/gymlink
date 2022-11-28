import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

const buttonStyle = cva('py-3 px-5 rounded-full flex-1 my-2', {
  variants: {
    variant: {
      primary: 'bg-primaryWhite text-primaryDark',
      secondary: 'bg-secondaryDark border-1 border-tertiaryDark',
    },
  },
});

const buttonTextStyle = cva('font-[MontserratBold] text-xl text-center', {
  variants: {
    variant: {
      primary: 'text-primaryDark',
      secondary: 'text-primaryWhite',
    },
  },
});

interface ButtonProps
  extends TouchableOpacityProps,
    VariantProps<typeof buttonStyle>,
    VariantProps<typeof buttonTextStyle> {
  children: React.ReactNode;
  variant: 'primary' | 'secondary';
}

export default function Button({ children, variant }: ButtonProps) {
  return (
    <TouchableOpacity className={buttonStyle({ variant })}>
      <Text className={buttonTextStyle({ variant })}>{children}</Text>
    </TouchableOpacity>
  );
}
