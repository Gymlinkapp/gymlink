import {
  Skia,
  BackdropBlur,
  Canvas,
  Fill,
  Image,
  useFont,
  useImage,
  vec,
  Text as SkiaText,
  Group,
  rrect,
  rect,
  useValue,
  useComputedValue,
  Path,
} from '@shopify/react-native-skia';
import { useEffect, useMemo, useState } from 'react';
import { Dimensions, Text, View, Image as RNImage } from 'react-native';
import { COLORS } from '../utils/colors';
import { NAVBAR_HEIGHT, SPACING } from '../utils/sizes';
import { calculateCardHeight } from '../utils/ui';
import { User } from '../utils/users';
import Button from './button';

export default function Person({ user }: { user: Partial<User> }) {
  const image = useImage(user.images[0]);
  const { width, height } = Dimensions.get('window');

  const CARD_WIDTH = width;

  const CARD_HEIGHT = calculateCardHeight(height);
  const BLUR_CLIP_HEIGHT = CARD_WIDTH - -CARD_HEIGHT * 0.285;

  // person' info on card
  const NAME_POSITION = vec(30, -60);
  const NAME_SIZE = 21;
  const LOCATION_POSITION = vec(45, -42);
  const LOCATION_SIZE = 12;
  const LOCATION_ICON = vec(600, -1050);
  const LOCATION_ICON_SIZE = 0.05;

  const x = useValue((width - CARD_WIDTH) / 2);
  const y = useValue((height - CARD_HEIGHT) / 2);

  const clip = useMemo(
    () => rrect(rect(8, -90, CARD_WIDTH / 1.15, CARD_HEIGHT / 9.5), 999, 999),
    [CARD_WIDTH, CARD_HEIGHT]
  );
  const transform = useComputedValue(
    () => [{ translateY: BLUR_CLIP_HEIGHT }, { translateX: 0 }],
    [x, y]
  );

  const mainNameFont = useFont(
    require('../assets/fonts/Montserrat-Bold.ttf'),
    NAME_SIZE
  );

  const locationFont = useFont(
    require('../assets/fonts/Montserrat-Regular.ttf'),
    LOCATION_SIZE
  );

  const locationSVG = Skia.Path.MakeFromSVGString(
    'M128,16a88.1,88.1,0,0,0-88,88c0,75.3,80,132.2,83.4,134.6a8.3,8.3,0,0,0,9.2,0C136,236.2,216,179.3,216,104A88.1,88.1,0,0,0,128,16Zm0,56a32,32,0,1,1-32,32A32,32,0,0,1,128,72Z'
  );

  return (
    <View
      className='overflow-hidden rounded-2xl relative'
      style={{ width: '100%', height: CARD_HEIGHT, marginVertical: SPACING }}
    >
      <Canvas
        style={{
          zIndex: 2,
          flex: 1,
        }}
      >
        {!!image && (
          <Image image={image} width={width} height={CARD_HEIGHT} fit='cover' />
        )}
        <BackdropBlur blur={6} clip={clip} transform={transform}>
          <Fill color='rgba(255, 255, 255, 0.05)' />
          <SkiaText
            text={`${user.firstName} ${user.lastName}`}
            font={mainNameFont}
            x={NAME_POSITION.x}
            y={NAME_POSITION.y}
            color={COLORS.mainWhite}
          />
          <Path
            path={locationSVG}
            color={COLORS.secondaryWhite}
            transform={[
              { scale: LOCATION_ICON_SIZE },
              { translateX: LOCATION_ICON.x },
              { translateY: LOCATION_ICON.y },
            ]}
          />
          <SkiaText
            text={`${user.gymId}`}
            font={locationFont}
            x={LOCATION_POSITION.x}
            y={LOCATION_POSITION.y}
            color={COLORS.secondaryWhite}
          />
        </BackdropBlur>
      </Canvas>
      <View className={`absolute bottom-0 left-0 flex flex-row z-20 p-2`}>
        <Button variant='secondary'>Go Next</Button>
        <Button variant='primary'>Go Gym</Button>
      </View>
    </View>
  );
}
