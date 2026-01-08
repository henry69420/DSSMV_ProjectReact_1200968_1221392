import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_OSMDROID } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import LibraryStore from '../stores/LibraryStore';

const LibraryMapScreen = () => {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Região inicial (Porto)
  const [region, setRegion] = useState({
    latitude: 41.1579,
    longitude: -8.6291,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // 1. Lógica do GPS
  useEffect(() => {
    const requestLocation = async () => {
      // Se for Android, pede permissão
      if (Platform.OS === 'android') {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          );
          if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
            console.log("Permissão de localização negada");
            return;
          }
        } catch (err) {
          console.warn(err);
          return;
        }
      }

      //posição atual
      Geolocation.getCurrentPosition(
        (info) => {
          setRegion({
            latitude: info.coords.latitude,
            longitude: info.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        },
        (error) => console.log("Erro ao obter localização:", error),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    };

    requestLocation();
  }, []);

  // 2. Carregar Bibliotecas da Store e Converter Endereços
  useEffect(() => {
    const onChange = () => {
      const libs = LibraryStore.getLibraries();
      convertAddressesToCoords(libs);
    };

    LibraryStore.addChangeListener(onChange);

    // Carrega dados iniciais se já existirem
    if (LibraryStore.getLibraries().length > 0) {
      convertAddressesToCoords(LibraryStore.getLibraries());
    }

    return () => LibraryStore.removeChangeListener(onChange);
  }, []);

  // Função para converter moradas em coordenadas (Nominatim)
  const convertAddressesToCoords = async (libs) => {
    setLoading(true);
    const newMarkers = [];

    for (const lib of libs) {
      if (lib.address) {
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(lib.address)}`,
            { headers: { 'User-Agent': 'ProjectReactStudentApp/1.0' } }
          );
          const data = await response.json();

          if (data && data.length > 0) {
            newMarkers.push({
              id: lib.id,
              title: lib.name,
              description: lib.address,
              coordinate: {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
              },
            });
          }
        } catch (error) {
          console.warn(`Erro no endereço de ${lib.name}`);
        }
      }
    }
    setMarkers(newMarkers);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>A carregar bibliotecas...</Text>
        </View>
      )}

      <MapView
        style={styles.map}
        provider={PROVIDER_OSMDROID} // <--- Isto ativa o OpenStreetMap (Gratuito)
        region={region}
        onRegionChangeComplete={(r) => setRegion(r)}
        showsUserLocation={true}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            description={marker.description}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { ...StyleSheet.absoluteFillObject, justifyContent: 'flex-end', alignItems: 'center' },
  map: { ...StyleSheet.absoluteFillObject },
  loaderContainer: {
    position: 'absolute', top: 50, backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 10, borderRadius: 10, zIndex: 1, alignItems: 'center', elevation: 5
  }
});

export default LibraryMapScreen;
