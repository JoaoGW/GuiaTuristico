import { useRef, useState } from 'react';
import { Dimensions } from 'react-native';

import Carousel, { Pagination } from 'react-native-snap-carousel';

import { View, Image } from '@gluestack-ui/themed';

type ImageCarouselProps = {
  images: string[];
}

const { width } = Dimensions.get('window');

export function ImageCarousel({ images }: ImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<any>(null);

  return (
    <View>
      {/** Corrigido por GPT4.1: uso de React.createElement para Carousel */}
      {(
        // @ts-ignore
        // O problema de tipagem é conhecido no react-native-snap-carousel
        // https://github.com/meliorence/react-native-snap-carousel/issues/972
        // https://github.com/meliorence/react-native-snap-carousel/issues/932
        // O uso de React.createElement contorna o erro de tipagem
        require('react').createElement(Carousel, {
          ref: carouselRef,
          data: images,
          renderItem: ({ item }: { item: string }) => (
            <Image
              source={{ uri: item }}
              width={width}
              height={220}
              borderRadius={15}
              alt="Imagem do destino"
              resizeMode="cover"
            />
          ),
          sliderWidth: width,
          itemWidth: width,
          onSnapToItem: (index: number) => setActiveIndex(index),
          inactiveSlideScale: 0.95,
          inactiveSlideOpacity: 0.8,
          loop: true,
        })
      )}
      <View
        position="absolute"
        bottom={18}
        width="100%"
        alignItems="center"
        zIndex={2}
      >
        {/** Corrigido: uso de React.createElement para Pagination */}
        {(
          // @ts-ignore
          require('react').createElement(Pagination, {
            dotsLength: images.length,
            activeDotIndex: activeIndex,
            containerStyle: { backgroundColor: 'transparent', paddingVertical: 0 },
            dotStyle: {
              width: 10,
              height: 10,
              borderRadius: 5,
              marginHorizontal: 4,
              backgroundColor: '#e9ad2d',
            },
            inactiveDotStyle: {
              backgroundColor: '#fffbe6',
            },
            inactiveDotOpacity: 0.4,
            inactiveDotScale: 0.8,
          })
        )}
      </View>
    </View>
  );
}