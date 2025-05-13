import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View } from '@gluestack-ui/themed';

export function Maps() {
  return (
    <View flex={1}>
      <MapView
        style={{ width: '100%', height: '100%' }}
        initialRegion={{
          latitude: -23.549171,
          longitude: -46.649815,
          latitudeDelta: 0.0122,
          longitudeDelta: 0.0041,
        }}
        zoomEnabled
      >
        {/* Os marcadores precisam ser mapeados e adicionados dinamicamente
        após integração completa da OpenAI */}
        <Marker
          coordinate={{
            latitude: -23.549171,
          longitude: -46.649815
          }}
          title="São Paulo"
          description="Um destino popular no Brasil"
        />
      </MapView>
    </View>
  )
}