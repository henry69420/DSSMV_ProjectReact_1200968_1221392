import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ScrollView,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';

// Import Stores and Actions
import LibraryStore from '../stores/LibraryStore';
import BookStore from '../stores/BookStore';
import QuoteStore from '../stores/QuoteStore'; // 👈 NOVO IMPORT
import { LibraryActions } from '../actions/LibraryActions';
import { QuoteActions } from '../actions/QuoteActions'; // 👈 NOVO IMPORT

const HomeScreen = ({ navigation }) => {
  // State for counters
  const [libraryCount, setLibraryCount] = useState(0);
  const [bookCount, setBookCount] = useState(0);

  // State for Quote (Agora vem da Store!)
  const [quote, setQuote] = useState(QuoteStore.getQuote());
  const [loadingQuote, setLoadingQuote] = useState(QuoteStore.isLoading());

  useEffect(() => {
    // 1. Funções de atualização
    const updateLibraryState = () => setLibraryCount(LibraryStore.getLibraries().length);
    const updateBookState = () => setBookCount(BookStore.getBooks().length);

    // Atualiza a quote quando a Store mudar
    const updateQuoteState = () => {
      setQuote(QuoteStore.getQuote());
      setLoadingQuote(QuoteStore.isLoading());
    };

    // 2. Subscribe to stores
    LibraryStore.addChangeListener(updateLibraryState);
    BookStore.addChangeListener(updateBookState);
    QuoteStore.addChangeListener(updateQuoteState); // 👈 Ouve a QuoteStore

    // 3. Initial Data Fetch
    LibraryActions.loadLibraries();
    LibraryActions.searchBooks('');

    // Se não houver quote, pede uma à Action
    if (!QuoteStore.getQuote()) {
      QuoteActions.fetchRandomQuote();
    }

    // 4. Cleanup
    return () => {
      LibraryStore.removeChangeListener(updateLibraryState);
      BookStore.removeChangeListener(updateBookState);
      QuoteStore.removeChangeListener(updateQuoteState);
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
      title: 'Search Books',
      subtitle: 'Find by ISBN/Title',
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
      title: 'Checked Out',
      subtitle: 'Pending Books',
      icon: '📅',
      screen: 'CheckedOut',
      color: '#f0932b'
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />

      <ScrollView contentContainerStyle={styles.container}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, Manager 👋</Text>
          <Text style={styles.subGreeting}>System Overview</Text>
        </View>

        {/* Quote Card */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteTitle}>💡 Quote of the Day</Text>
          {loadingQuote ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <View>
              <Text style={styles.quoteText}>“{quote?.content || "Loading..."}”</Text>
              <Text style={styles.quoteAuthor}>— {quote?.author || ""}</Text>
            </View>
          )}
        </View>

        {/* Stats Container */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{libraryCount}</Text>
            <Text style={styles.statLabel}>Libraries</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{bookCount}</Text>
            <Text style={styles.statLabel}>Total Books</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Quick Access</Text>

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
  // Quote Styles
  quoteCard: {
    backgroundColor: '#6c5ce7', // Roxo bonito
    borderRadius: 16,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#6c5ce7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  quoteTitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  quoteText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'italic',
    marginBottom: 10,
    lineHeight: 24,
  },
  quoteAuthor: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  // End Quote Styles
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d3436',
    marginBottom: 15,
    marginTop: 5,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 20,
    marginBottom: 30,
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
    color: '#2d3436',
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#b2bec3',
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
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
