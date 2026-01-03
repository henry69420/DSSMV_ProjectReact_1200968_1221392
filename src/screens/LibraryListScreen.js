import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    StyleSheet,
    SafeAreaView
} from 'react-native';
import LibraryStore from '../stores/LibraryStore';
import { LibraryActions } from '../actions/LibraryActions';

const LibraryListScreen = ({ navigation }) => {
    // 1. Estado local sincronizado com o Store
    const [libraries, setLibraries] = useState(LibraryStore.getLibraries());
    const [loading, setLoading] = useState(LibraryStore.isLoading());
    const [error, setError] = useState(LibraryStore.getError());

    // 2. Função de callback chamada quando o Store emite uma mudança
    const handleStoreChange = () => {
        setLibraries(LibraryStore.getLibraries());
        setLoading(LibraryStore.isLoading());
        setError(LibraryStore.getError());
    };

    useEffect(() => {
        // 3. Subscrever-se ao Store ao montar o ecrã
        LibraryStore.addChangeListener(handleStoreChange);

        // Inicia o carregamento das bibliotecas (UC2)
        // Equivalente ao loadLibraries() no onCreate/onResume do Android
        LibraryActions.loadLibraries();

        // 4. Limpeza (Unsubscribe) ao desmontar
        return () => {
            LibraryStore.removeChangeListener(handleStoreChange);
        };
    }, []);

    const handleDelete = (id) => {
        // Exibe diálogo de confirmação como no Android
        Alert.alert(
            "Delete Library",
            "Are you sure you want to delete this library?",
            [
                { text: "No", style: "cancel" },
                { text: "Yes", onPress: () => LibraryActions.deleteLibrary(id) }
            ]
        );
    };

    const isLibraryOpen = (library) => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTimeInMinutes = currentHour * 60 + currentMinute;

        if (!library.openTime || !library.closeTime) return false;

        const [openH, openM] = library.openTime.split(':').map(Number);
        const [closeH, closeM] = library.closeTime.split(':').map(Number);

        const openInMinutes = openH * 60 + openM;
        const closeInMinutes = closeH * 60 + closeM;

        const isOpenTime = currentTimeInMinutes >= openInMinutes && currentTimeInMinutes <= closeInMinutes;

        return isOpenTime;
    };

    const renderLibraryItem = ({ item }) => {
        const isOpen = isLibraryOpen(item);

        return (
            <View style={styles.card}>
                <View style={styles.infoContainer}>
                    <View style={styles.nameRow}>
                        <Text style={styles.name}>{item.name}</Text>
                        <View style={[styles.statusBadge, { backgroundColor: isOpen ? '#DCFCE7' : '#FEE2E2' }]}>
                            <Text style={[styles.statusText, { color: isOpen ? '#166534' : '#991B1B' }]}>
                                {isOpen ? '● OPEN' : '○ CLOSED'}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.address}>{item.address}</Text>
                    <Text style={styles.details}>📅 {item.openDays}</Text>
                    <Text style={styles.details}>🕒 {item.openTime} - {item.closeTime}</Text>
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={[styles.button, styles.updateButton]}
                        onPress={() => navigation.navigate('UpdateLibrary', { library: item })}
                    >
                        <Text style={styles.buttonText}>Update</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.button, styles.deleteButton]}
                        onPress={() => handleDelete(item.id)}
                    >
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Library List</Text>
                <View style={styles.divider} />
            </View>

            {loading && libraries.length === 0 ? (
                <ActivityIndicator size="large" color="#22C55E" style={styles.loader} />
            ) : (
                <FlatList
                    data={libraries}
                    keyExtractor={(item) => item.id}
                    renderItem={renderLibraryItem}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={<Text style={styles.emptyText}>No libraries found</Text>}
                    onRefresh={() => LibraryActions.loadLibraries()}
                    refreshing={loading}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FAFC' },
    header: { padding: 20, alignItems: 'center' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
    divider: { width: 60, height: 3, backgroundColor: '#22C55E', marginTop: 6 },
    listContent: { padding: 16 },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4
    },
    infoContainer: { marginBottom: 12 },
    name: { fontSize: 18, fontWeight: 'bold', color: '#1F2937' },
    address: { fontSize: 14, color: '#555555', marginTop: 2 },
    details: { fontSize: 13, color: '#666666', marginTop: 4 },
    actions: { flexDirection: 'row', justifyContent: 'flex-end' },
    button: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 12, marginLeft: 8 },
    updateButton: { backgroundColor: '#2196F3' },
    deleteButton: { backgroundColor: '#EF4444' },
    buttonText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },
    loader: { flex: 1, justifyContent: 'center' },
    emptyText: { textAlign: 'center', marginTop: 20, color: '#6B7280' }
});

export default LibraryListScreen;