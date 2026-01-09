import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Text, PermissionsAndroid, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_OSMDROID } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import LibraryStore from '../stores/LibraryStore';

const LibraryMapScreen = () => {
  const [markers, setMarkers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Região inicial (Porto - Aliados)
  const [region, setRegion] = useState({
    latitude: 41.1579,
    longitude: -8.6291,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  // 1. Lógica GPS (Pedir permissão e centrar no user)
  useEffect(() => {
    const requestLocation = async () => {
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

  // 2. Carregar Bibliotecas da Store
  useEffect(() => {
    const onChange = () => {
      const libs = LibraryStore.getLibraries();
      convertAddressesToCoords(libs);
    };

    LibraryStore.addChangeListener(onChange);

    if (LibraryStore.getLibraries().length > 0) {
      convertAddressesToCoords(LibraryStore.getLibraries());
    }

    return () => LibraryStore.removeChangeListener(onChange);
  }, []);

  // 3. Converter Moradas em Coordenadas (Com "Plano B" para a Demo)
  const convertAddressesToCoords = async (libs) => {
    setLoading(true);
    const newMarkers = [];

    for (const lib of libs) {
      if (lib.address) {
        try {
          // TRUQUE 1: Adicionar ", Portugal" para ajudar a API
          const fullAddress = `${lib.address}, Portugal`;

          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`,
            { headers: { 'User-Agent': 'ProjectReactStudentApp/1.0' } }
          );
          const data = await response.json();

          if (data && data.length > 0) {
            // SUCESSO: Morada encontrada
            newMarkers.push({
              id: lib.id,
              title: lib.name,
              description: lib.address,
              coordinate: {
                latitude: parseFloat(data[0].lat),
                longitude: parseFloat(data[0].lon),
              },
              pinColor: 'red' // Cor normal
            });
          } else {
            // FALHA SILENCIOSA: Morada não encontrada -> Usa coordenadas default
            throw new Error("Morada não encontrada");
          }

        } catch (error) {
          console.warn(`A usar localização de recurso para: ${lib.name}`);

          // TRUQUE 2: "Plano B" para a Demo (Mete o pino no Porto para não falhar)
          newMarkers.push({
            id: lib.id,
            title: `⚠️ ${lib.name} (Local Aprox.)`, // Aviso visual
            description: `Morada não detetada: ${lib.address}`,
            coordinate: {
              // Coordenadas fixas (Aliados/Porto) com ligeiro random para não ficarem todos empilhados
              latitude: 41.1579 + (Math.random() * 0.005),
              longitude: -8.6291 + (Math.random() * 0.005)
            },
            pinColor: 'orange' // Cor diferente para avisar que é aproximado
          });
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
          <Text>A geocodificar endereços...</Text>
        </View>
      )}

      <MapView
        style={styles.map}
        provider={PROVIDER_OSMDROID} // Usa OpenStreetMap
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
            pinColor={marker.pinColor || 'red'}
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
