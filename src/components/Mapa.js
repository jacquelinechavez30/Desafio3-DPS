import { View, Text, StyleSheet, Dimensions, Button, TouchableOpacity } from 'react-native';
import React, { useRef } from 'react';
import MapView, { Marker } from 'react-native-maps';

export default function Mapa() {
  const mapRef = useRef(null);

  const initialRegion = {
    latitude: (13.716075464217147 + 13.67437837682251) / 2,
    longitude: (-89.15375771281167 + -89.23702221384295) / 2,
    latitudeDelta: Math.abs(13.716075464217147 - 13.67437837682251) + 0.1,
    longitudeDelta: Math.abs(-89.15375771281167 - -89.23702221384295) + 0.1,
  };

  const locations = [
    {
      latitude: 13.716075464217147,
      longitude: -89.15375771281167,
      title: 'Universidad Don Bosco',
      description: 'Campus Soyapango',
    },
    {
      latitude: 13.67437837682251,
      longitude: -89.23702221384295,
      title: 'Universidad Don Bosco',
      description: 'Campus Antiguo Cuscatlán',
    },
  ];

  const closeUpMap = (location) => {
    mapRef.current.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  };

  const botonRegreso = () => {
    mapRef.current.animateToRegion(initialRegion, 1000);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Retirá tus productos en nuestras siguientes sucursales!</Text>
      <View style={styles.mapContainer}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={initialRegion}
          scrollEnabled={false}
          zoomEnabled={false}
        >
          {locations.map((location, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title={location.title}
              description={location.description}
              onPress={() => closeUpMap(location)}
            />
          ))}
        </MapView>
      </View>
      <TouchableOpacity style={styles.button} onPress={botonRegreso}>
        <Text style={styles.buttonText}>Volver a vista general</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderColor: '#002d70',
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    backgroundColor: '#002d70',
    padding: 10,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});