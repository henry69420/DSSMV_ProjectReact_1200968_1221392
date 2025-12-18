import React, { useState, useEffect } from 'react';
import {
    View, FlatList, Text, StyleSheet, Image, RefreshControl,
    Alert, TextInput, TouchableOpacity, SafeAreaView, ActivityIndicator
} from 'react-native';
import CheckoutStore from '../stores/CheckoutStore';
import { LibraryActions } from '../actions/LibraryActions';

const getBookCoverUrl = (coverObj) => {
    const path = coverObj?.mediumUrl || coverObj?.smallUrl || coverObj;
    if (!path || typeof path !== 'string') return null;
    const fileName = path.replace('/api/v1/assets/cover/', '');
    return `http://193.136.62.24/v1/assets/cover/${fileName}`;
};

export default function CheckedOutBooksScreen() {
    const [userId, setUserId] = useState('');
    const [checkouts, setCheckouts] = useState(CheckoutStore.getCheckouts());
    const [isLoading, setIsLoading] = useState(CheckoutStore.isLoading());

    useEffect(() => {
        const onChange = () => {
            setCheckouts(CheckoutStore.getCheckouts());
            setIsLoading(CheckoutStore.isLoading());
        };
        CheckoutStore.addChangeListener(onChange);
        return () => CheckoutStore.removeChangeListener(onChange);
    }, []);

    const handleSearch = () => {
        if (!userId.trim()) {
            Alert.alert('Error', 'Please enter a valid User ID');
            return;
        }
        LibraryActions.getCheckedOutBooks(userId);
    };

    const formatDueDate = (dueDate) => {
        return new Date(dueDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
        });
    };

    const getDaysUntilDue = (dueDate) => {
        const diffTime = new Date(dueDate) - new Date();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const renderItem = ({ item }) => {
        const daysUntilDue = getDaysUntilDue(item.dueDate);
        const isDueOrOverdue = daysUntilDue <= 0;

        // Estrutura de dados baseada no teu DTO original
        const coverPath = item.book?.cover || item.cover;
        const libraryName = item.libraryName || item.library?.name || `Library ${item.libraryId}`;

        return (
            <View style={styles.card}>
                <View style={styles.itemContent}>

                    {/* Detalhes à Esquerda */}
                    <View style={styles.bookDetails}>
                        <Text style={styles.title} numberOfLines={2}>{item.book?.title || item.title}</Text>
                        <Text style={styles.author}>
                            {item.book?.authors?.map(a => a.name).join(', ') || 'Unknown Author'}
                        </Text>

                        <View style={styles.infoSection}>
                            <Text style={styles.libraryLabel}>📍 {libraryName}</Text>
                            <Text style={[styles.statusText, isDueOrOverdue && styles.overdue]}>
                                ⏳ {isDueOrOverdue ? `Overdue by ${Math.abs(daysUntilDue)} days` : `Due in ${daysUntilDue} days`}
                            </Text>
                            <Text style={styles.dateLabel}>Return: {formatDueDate(item.dueDate)}</Text>
                        </View>
                    </View>

                    {/* Capa à Direita */}
                    <View style={styles.coverContainer}>
                        {coverPath ? (
                            <Image
                                source={{ uri: getBookCoverUrl(coverPath) }}
                                style={styles.coverImage}
                            />
                        ) : (
                            <Text style={{fontSize: 24}}>📖</Text>
                        )}
                    </View>
                </View>

                {/* Botões de Ação */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.extendBtn]}
                        onPress={() => LibraryActions.extendCheckout(item.id)}
                    >
                        <Text style={styles.actionButtonText}>EXTEND</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.checkInBtn]}
                        onPress={() => LibraryActions.checkInBook(item.libraryId, item.book.isbn, userId)}
                    >
                        <Text style={styles.actionButtonText}>RETURN</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchHeader}>
                <Text style={styles.instructionText}>User Identification</Text>
                <View style={styles.searchRow}>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Enter User ID..."
                        placeholderTextColor="#999"
                        value={userId}
                        onChangeText={setUserId}
                        autoCapitalize="none"
                    />
                    <TouchableOpacity style={styles.fetchButton} onPress={handleSearch}>
                        <Text style={styles.fetchButtonText}>FETCH</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {isLoading && <ActivityIndicator size="large" color="#D97706" style={{ marginVertical: 20 }} />}

            <FlatList
                data={checkouts}
                renderItem={renderItem}
                keyExtractor={item => `${item.id}`}
                contentContainerStyle={styles.listPadding}
                ListEmptyComponent={
                    userId !== '' && !isLoading && (
                        <Text style={styles.emptyText}>No books found for this user.</Text>
                    )
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#E5E7EB' },
    searchHeader: { backgroundColor: 'white', padding: 15, elevation: 4, borderBottomWidth: 1, borderColor: '#ccc' },
    instructionText: { fontWeight: 'bold', marginBottom: 5, fontSize: 12, color: '#666' },
    searchRow: { flexDirection: 'row' },
    searchInput: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 4, color: '#000', backgroundColor: '#F9FAFB' },
    fetchButton: { backgroundColor: '#4B5563', paddingHorizontal: 20, justifyContent: 'center', marginLeft: 10, borderRadius: 4 },
    fetchButtonText: { color: 'white', fontWeight: 'bold' },

    listPadding: { padding: 10 },
    card: { backgroundColor: 'white', borderRadius: 4, padding: 12, marginBottom: 12, elevation: 3, borderRightWidth: 5, borderRightColor: '#D97706' },
    itemContent: { flexDirection: 'row' },
    bookDetails: { flex: 1, marginRight: 15 },
    coverContainer: { width: 70, height: 100, backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center', borderRadius: 4, overflow: 'hidden' },
    coverImage: { width: '100%', height: '100%', resizeMode: 'cover' },

    title: { fontSize: 16, fontWeight: 'bold', color: '#111' },
    author: { color: '#666', fontSize: 13, marginTop: 2 },
    infoSection: { marginTop: 8, borderTopWidth: 1, borderColor: '#f0f0f0', paddingTop: 5 },
    libraryLabel: { fontSize: 12, color: '#444', fontWeight: 'bold' },
    statusText: { fontSize: 12, color: '#2196F3', fontWeight: 'bold', marginTop: 2 },
    overdue: { color: '#f44336' },
    dateLabel: { fontSize: 11, color: '#888' },

    actionsContainer: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 10, borderTopWidth: 1, borderColor: '#eee', paddingTop: 10 },
    actionButton: { paddingVertical: 8, paddingHorizontal: 12, borderRadius: 2, marginLeft: 10, minWidth: 80, alignItems: 'center' },
    extendBtn: { backgroundColor: '#D97706' },
    checkInBtn: { backgroundColor: '#B91C1C' },
    actionButtonText: { color: 'white', fontWeight: 'bold', fontSize: 11 },
    emptyText: { textAlign: 'center', marginTop: 50, color: '#666' }
});