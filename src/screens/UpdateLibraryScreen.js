import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ScrollView, Alert, SafeAreaView
} from 'react-native';
import { LibraryActions } from '../actions/LibraryActions';

const UpdateLibraryScreen = ({ route, navigation }) => {
    // 1. Recuperar a biblioteca passada pelo LibraryListScreen
    const { library } = route.params;

    // 2. Estado do formulário inicializado com os dados atuais
    const [name, setName] = useState(library.name);
    const [address, setAddress] = useState(library.address);
    const [openDays, setOpenDays] = useState(library.openDays);
    const [openTime, setOpenTime] = useState(library.openTime);
    const [closeTime, setCloseTime] = useState(library.closeTime);

    const handleUpdate = async () => {
        if (!name || !address) {
            Alert.alert("Erro", "Nome e Endereço são obrigatórios.");
            return;
        }

        const updatedData = {
            id: library.id,
            name,
            address,
            openDays,
            openTime,
            closeTime
        };

        try {
            // Chamada à Action do Flux (que já temos no LibraryActions.js)
            await LibraryActions.updateLibrary(library.id, updatedData);

            Alert.alert("Sucesso", "Biblioteca atualizada com sucesso!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível atualizar: " + error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.label}>Nome da Biblioteca</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Ex: Biblioteca Central"
                />

                <Text style={styles.label}>Endereço</Text>
                <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Rua..."
                />

                <Text style={styles.label}>Dias de Funcionamento</Text>
                <TextInput
                    style={styles.input}
                    value={openDays}
                    onChangeText={setOpenDays}
                    placeholder="Ex: Seg-Sex"
                />

                <View style={styles.row}>
                    <View style={styles.flex1}>
                        <Text style={styles.label}>Abertura</Text>
                        <TextInput
                            style={styles.input}
                            value={openTime}
                            onChangeText={setOpenTime}
                            placeholder="09:00"
                        />
                    </View>
                    <View style={{ width: 20 }} />
                    <View style={styles.flex1}>
                        <Text style={styles.label}>Fecho</Text>
                        <TextInput
                            style={styles.input}
                            value={closeTime}
                            onChangeText={setCloseTime}
                            placeholder="18:00"
                        />
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>💾 GUARDAR ALTERAÇÕES</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F3F4F6' },
    scroll: { padding: 20 },
    label: { fontSize: 14, fontWeight: 'bold', color: '#4B5563', marginBottom: 5, marginTop: 15 },
    input: {
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        color: '#1F2937'
    },
    row: { flexDirection: 'row' },
    flex1: { flex: 1 },
    button: {
        backgroundColor: '#2196F3',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 30,
        elevation: 2
    },
    buttonText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 }
});

export default UpdateLibraryScreen;