import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, FlatList, Image,
    StyleSheet, ActivityIndicator, SafeAreaView, TouchableOpacity
} from 'react-native';
import BookStore from '../stores/BookStore';
import { LibraryActions } from '../actions/LibraryActions';

// Função auxiliar para construir URL da capa
const getBookCoverUrl = (coverObj) => {
    // Tenta obter a URL média, se não existir tenta a pequena, se não existir usa o campo direto
    const path = coverObj?.mediumUrl || coverObj?.smallUrl || coverObj;

    if (!path || typeof path !== 'string') return null;

    const fileName = path.replace('/api/v1/assets/cover/', '');
    const finalUrl = `http://193.136.62.24/v1/assets/cover/${fileName}`;

    return finalUrl;
};

// =================================================================
// COMPONENTE PRINCIPAL (RECEBE NAVIGATION)
// =================================================================
const BookSearchScreen = ({ navigation }) => {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState(BookStore.getBooks());
    const [loading, setLoading] = useState(BookStore.isLoading());

    useEffect(() => {
        const onChange = () => {
            setBooks(BookStore.getBooks());
            setLoading(BookStore.isLoading());
        };
        BookStore.addChangeListener(onChange);
        return () => BookStore.removeChangeListener(onChange);
    }, []);

    const handleSearch = (text) => {
        setQuery(text);
        if (text.length > 0) {
            LibraryActions.searchBooks(text);
        } else {
            setBooks([]);
        }
    };

    // =================================================================
    // FUNÇÃO DE RENDERIZAÇÃO DO ITEM (DENTRO DO COMPONENTE)
    // =================================================================
    const renderBook = ({ item }) => {
        const coverPath = item.cover?.mediumUrl || item.coverUrl;

        return (
            <TouchableOpacity
                style={styles.bookCard}
                onPress={() => navigation.navigate('BookDetail', { isbn: item.isbn })}
            >
                <View style={styles.coverContainer}>
                    {coverPath ? (
                        <Image
                            source={{ uri: getBookCoverUrl(item.cover) }}
                            style={styles.cover}
                            onError={(e) => console.log(`Falha ao carregar imagem para ${item.title}:`, e.nativeEvent.error)}
                        />
                    ) : (
                        <Text style={{ fontSize: 30 }}>📖</Text>
                    )}
                </View>

                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.isbn}>ISBN: {item.isbn}</Text>
                    <Text style={styles.author} numberOfLines={1}>
                        👤 {item.authors?.map(a => a.name).join(', ') || 'Autor desconhecido'}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchHeader}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search books..."
                    placeholderTextColor="#9CA3AF"
                    value={query}
                    onChangeText={handleSearch}
                    autoFocus={true}
                />
            </View>

            {loading && (<ActivityIndicator size="large" color="#059669" style={styles.loader} />)}

            <FlatList
                data={books}
                keyExtractor={(item) => item.isbn}
                renderItem={renderBook}
                contentContainerStyle={styles.list}
                ListEmptyComponent={
                    !loading && query.length > 0 && (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>Nenhum resultado para "{query}"</Text>
                        </View>
                    )
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    searchHeader: {
        padding: 16,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB'
    },
    searchInput: {
        backgroundColor: '#F3F4F6',
        paddingHorizontal: 15,
        paddingVertical: 12,
        borderRadius: 12,
        fontSize: 16,
        color: '#1F2937'
    },
    loader: { marginTop: 20 },
    list: { padding: 16 },
    bookCard: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        borderRadius: 15,
        padding: 12,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
    },
    coverContainer: {
        width: 80,
        height: 110,
        borderRadius: 8,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden'
    },
    cover: { width: '100%', height: '100%' },
    info: { flex: 1, marginLeft: 15, justifyContent: 'center' },
    title: { fontSize: 16, fontWeight: 'bold', color: '#1F2937' },
    isbn: { fontSize: 12, color: '#9CA3AF', marginTop: 4 },
    author: { fontSize: 14, color: '#4B5563', marginTop: 8 },
    emptyContainer: { alignItems: 'center', marginTop: 40 },
    emptyText: { color: '#6B7280', fontSize: 16 }
});

export default BookSearchScreen;