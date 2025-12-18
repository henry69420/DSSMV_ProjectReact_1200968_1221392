import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';

const HomeScreen = ({ navigation }) => {

  // Função auxiliar para criar botões com estilo
  const MenuButton = ({ title, screenName, color }) => (
    <TouchableOpacity
      style={[styles.button, { backgroundColor: color }]}
      onPress={() => navigation.navigate(screenName)}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        {/* Podes adicionar o logo do ISEP aqui se o tiveres na pasta assets */}
        <Text style={styles.title}>📚 DSSMV Project</Text>
        <Text style={styles.subtitle}>React Native Edition</Text>
      </View>

      <View style={styles.menuContainer}>
        {/* Mapeamento direto dos botões do MainActivity.java */}

        {/* btnLibraries -> LibraryListActivity */}
        <MenuButton
          title="🏢 List Libraries"
          screenName="LibraryList"
          color="#4F46E5"
        />

        {/* btnSearchBooks -> BookSearchActivity */}
        <MenuButton
          title="🔍 Search Books"
          screenName="BookSearch"
          color="#059669"
        />

        {/* btnCheckedOutBooks -> CheckedOutBooksActivity */}
        <MenuButton
          title="📖 My Checked Out Books"
          screenName="CheckedOut"
          color="#D97706"
        />

        {/* btnAddLibrary -> CreateLibraryActivity */}
        <MenuButton
          title="➕ Add Library"
          screenName="CreateLibrary"
          color="#DB2777"
        />

        {/* btnLibraryLocations -> LibraryMapActivity */}
          {/*<MenuButton
          title="📍 Library Locations (Map)"
          screenName="LibraryMap"
          color="#4B5563"
        />*/}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F3F4F6' },
  logoContainer: { alignItems: 'center', marginTop: 40, marginBottom: 40 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1F2937' },
  subtitle: { fontSize: 16, color: '#6B7280', marginTop: 5 },
  menuContainer: { paddingHorizontal: 20 },
  button: {
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 3, // Sombra no Android
    shadowColor: '#000', // Sombra no iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4
  },
  buttonText: { color: 'white', fontSize: 18, fontWeight: '600' }
});

export default HomeScreen;
