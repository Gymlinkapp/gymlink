import { cva, VariantProps } from 'class-variance-authority';
import React from 'react';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

const buttonStyle = cva(
  'py-3 px-5 rounded-full my-2 flex-row items-center justify-evenly',
  {
    variants: {
      variant: {
        primary: 'bg-primaryWhite text-primaryDark',
        secondary: 'bg-secondaryDark border-1 border-tertiaryDark',
        menu: 'bg-transparent rounded-none border-t-2 border-tertiaryDark',
      },
    },
  }
);

const buttonTextStyle = cva('font-[MontserratBold] text-xl text-center', {
  variants: {
    variant: {
      primary: 'text-primaryDark',
      secondary: 'text-primaryWhite',
      menu: 'text-primaryWhite',
    },
  },
});

interface ButtonProps
  extends TouchableOpacityProps,
    VariantProps<typeof buttonStyle>,
    VariantProps<typeof buttonTextStyle> {
  children: React.ReactNode;
  variant: 'primary' | 'secondary' | 'menu';
  icon?: React.ReactNode;
}

export default function Button({
  children,
  variant,
  icon,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity {...props} className={buttonStyle({ variant })}>
      {icon && icon}
      <Text className={buttonTextStyle({ variant })}>{children}</Text>
    </TouchableOpacity>
  );
}
