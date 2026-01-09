import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  SafeAreaView
} from 'react-native';

// Importar Stores e Actions
import LibraryStore from '../stores/LibraryStore';
import BookStore from '../stores/BookStore'; // Importar o Store de Livros
import { LibraryActions } from '../actions/LibraryActions';

const HomeScreen = ({ navigation }) => {
  // Estado para guardar os números
  const [libraryCount, setLibraryCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);

  useEffect(() => {
    // 1. Funções de atualização
    const updateLibraryState = () => {
      setLibraryCount(LibraryStore.getLibraries().length);
    };

    const updateBookState = () => {
      // Vai buscar o tamanho da lista de livros que está no Store
      setBookCount(BookStore.getBooks().length);
    };

    // 2. Subscrever (Ouvir alterações)
    LibraryStore.addChangeListener(updateLibraryState);
    BookStore.addChangeListener(updateBookState);

    // 3. Pedir dados à API ao iniciar
    LibraryActions.loadLibraries();
    LibraryActions.searchBooks('');

    // 4. Limpar subscrições ao sair do ecrã
    return () => {
      LibraryStore.removeChangeListener(updateLibraryState);
      BookStore.removeChangeListener(updateBookState);
    };
  }, []);

  const dashboardItems = [
    {
      id: 1,
      title: 'Libraries',
      subtitle: 'All Libraries',
      icon: '🏛️',
      screen: 'LibraryList',
      color: '#4834d4'
    },
    {
      id: 2,
      title: 'Search books',
      subtitle: 'Find books by ISBN or title',
      icon: '🔍',
      screen: 'BookSearch',
      color: '#eb4d4b'
    },
    {
      id: 3,
      title: 'New Library',
      subtitle: 'Add to system',
      icon: '➕',
      screen: 'CreateLibrary',
      color: '#6ab04c'
    },
    {
      id: 4,
      title: 'Landed Books',
      subtitle: 'Pending Books',
      icon: '📅',
      screen: 'CheckedOut',
      color: '#f0932b'
    },
    {
      id: 5,
      title: 'Map',
      subtitle: 'Localion',
      icon: '🗺️',
      screen: 'LibraryMap',
      color: '#0984e3'
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

      <ScrollView contentContainerStyle={styles.container}>

        {/* Cabeçalho */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá, Gestor 👋</Text>
          <Text style={styles.subGreeting}>Resumo do Sistema</Text>
        </View>

        {/* Estatísticas (Agora com dados REAIS de ambos) */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{libraryCount}</Text>
            <Text style={styles.statLabel}>Bibliotecas</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{bookCount}</Text>
            <Text style={styles.statLabel}>Total Livros</Text>
          </View>
        </View>


        <Text style={styles.sectionTitle}>Acesso Rápido</Text>


        <View style={styles.grid}>
          {dashboardItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() => navigation.navigate(item.screen)}
              activeOpacity={0.7}
            >
              <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>

              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  container: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  subGreeting: {
    fontSize: 16,
    color: '#636e72',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 15,
    marginTop: 10,
  },
  // Estatísticas
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 30,
    // Sombra suave
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 4,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#dfe6e9',
    height: '60%',
    alignSelf: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2d3436', // Cinza escuro quase preto
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#b2bec3', // Cinza claro
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  // Grelha
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: 'white',
    width: '48%',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 46,
    height: 46,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 22,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: '#95a5a6',
    lineHeight: 16,
  },
});

export default HomeScreen;
