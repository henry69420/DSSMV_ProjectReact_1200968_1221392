import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { api } from '../api/api';

const BookDetailScreen = ({ route }) => {
    const { isbn } = route.params;
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const data = await api.getBookByIsbn(isbn);
                setBook(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [isbn]);

    if (loading) return <ActivityIndicator size="large" style={{flex:1}} />;
    if (!book) return <Text>Livro não encontrado.</Text>;

    return (
        <ScrollView style={styles.container}>
            <Image
                source={{ uri: `http://193.136.62.24/v1/assets/cover/${book.cover?.largeUrl?.split('/').pop()}` }}
                style={styles.bigCover}
            />
            <View style={styles.content}>
                <Text style={styles.title}>{book.title}</Text>
                <Text style={styles.authors}>Por: {book.authors?.map(a => a.name).join(', ')}</Text>

                <View style={styles.section}>
                    <Text style={styles.label}>Resumo:</Text>
                    <Text style={styles.description}>{book.description || "Sem descrição disponível."}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>ISBN:</Text>
                    <Text>{book.isbn}</Text>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#FFF' },
    bigCover: { width: '100%', height: 300, resizeMode: 'contain', backgroundColor: '#F3F4F6' },
    content: { padding: 20 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#1F2937' },
    authors: { fontSize: 16, color: '#059669', marginBottom: 20 },
    section: { marginTop: 15 },
    label: { fontWeight: 'bold', fontSize: 16, color: '#4B5563' },
    description: { lineHeight: 22, color: '#374151', marginTop: 5 }
});

export default BookDetailScreen;