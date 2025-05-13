import { useContext } from 'react';
import MapView, { Marker } from 'react-native-maps';

import { View, Text } from '@gluestack-ui/themed';

import { LocationContext } from '@utils/requestDeviceLocation';
import { Loading } from '@components/Loading';

export function Maps() {
  const { location } = useContext(LocationContext);
  
  return (
    <View flex={1}>
      { location ? (
        <MapView
          style={{ width: '100%', height: '100%' }}
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0102,
            longitudeDelta: 0.0021,
          }}
          zoomEnabled
        >
          {/* Os marcadores precisam ser mapeados e adicionados dinamicamente
          após integração completa da OpenAI */}
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
            title="São Paulo"
            description="Um destino popular no Brasil"
          />
        </MapView>
      ) : (
        <View flex={1} justifyContent="center" alignItems="center">
          <Text>Carregando localização no mapa...</Text>
          <Loading />
        </View>
      )}
    </View>
  )
}