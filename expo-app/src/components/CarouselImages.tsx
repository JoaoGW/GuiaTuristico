import { useState } from 'react';
import { Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import { View, Image } from '@gluestack-ui/themed';

type CarouselImagesProps = {
  images: string[];
};

const { width } = Dimensions.get('window');

function CustomPagination({ length, activeIndex }: { length: number; activeIndex: number }) {
  return (
    <View flexDirection="row" justifyContent="center" alignItems="center" mb={8}>
      { Array.from({ length }).map((_, index) => (
        <View
          key={index}
          width={10}
          height={10}
          borderRadius={4}
          mx={4}
          bg={activeIndex === index ? "#E9AD2D" : '#E0E0E0'}
          opacity={activeIndex === index ? 1 : 0.5}
        />
      ))}
    </View>
  );
}

export function CarouselImages({ images }: CarouselImagesProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <View flex={1} justifyContent="center" alignItems="center">
      <View width={width} height={525} position="relative">
        <Carousel
          loop
          width={width}
          height={525}
          autoPlay={true}
          data={images}
          scrollAnimationDuration={3000}
          onSnapToItem={(index) => setActiveIndex(index)}
          renderItem={({ item }) => (
            <View
              flex={1}
              justifyContent="center"
              alignItems="center"
              overflow="hidden"
              style={{ borderTopWidth: 0, borderWidth: 0, shadowOpacity: 0, backgroundColor: 'transparent' }}
            >
              <Image
                source={{ uri: item }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="cover"
                alt="Imagens da cidade"
              />
            </View>
          )}
        />
        <View position="absolute" bottom={8} left={0} right={0}>
          <CustomPagination length={images.length} activeIndex={activeIndex} />
        </View>
      </View>
    </View>
  );
}