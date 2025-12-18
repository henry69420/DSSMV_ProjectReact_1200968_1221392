// src/screens/CreateLibraryScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { LibraryActions } from '../actions/LibraryActions';

const CreateLibraryScreen = ({ navigation }) => {
  // Estado do formulário
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [openDays, setOpenDays] = useState('Seg-Sex');
  const [openTime, setOpenTime] = useState('09:00');
  const [closeTime, setCloseTime] = useState('18:00');

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    // Validação simples
    if (!name.trim() || !address.trim()) {
      Alert.alert("Erro", "Por favor preenche pelo menos o Nome e a Morada.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Objeto DTO para enviar à API
      const newLibrary = {
        name: name,
        address: address,
        openDays: openDays,
        openTime: openTime,
        closeTime: closeTime,
        open: true // Assumimos que abre por defeito
      };

      // Chama a Action (que chama a API)
      await LibraryActions.createLibrary(newLibrary);

      Alert.alert("Sucesso", "Biblioteca criada com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() } // Volta para a lista
      ]);

    } catch (error) {
      Alert.alert("Erro", "Não foi possível criar a biblioteca.\n" + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nome da Biblioteca *</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Ex: Biblioteca Central"
      />

      <Text style={styles.label}>Morada *</Text>
      <TextInput
        style={styles.input}
        value={address}
        onChangeText={setAddress}
        placeholder="Ex: Rua do ISEP, 123"
      />

      <Text style={styles.label}>Dias de Abertura</Text>
      <TextInput
        style={styles.input}
        value={openDays}
        onChangeText={setOpenDays}
        placeholder="Ex: Seg-Sex"
      />

      <View style={styles.row}>
        <View style={styles.column}>
          <Text style={styles.label}>Abertura</Text>
          <TextInput
            style={styles.input}
            value={openTime}
            onChangeText={setOpenTime}
            placeholder="09:00"
          />
        </View>
        <View style={styles.column}>
          <Text style={styles.label}>Fecho</Text>
          <TextInput
            style={styles.input}
            value={closeTime}
            onChangeText={setCloseTime}
            placeholder="18:00"
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, isSubmitting && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFF" />
        ) : (
          <Text style={styles.buttonText}>Gravar Biblioteca</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#F3F4F6' },
  label: { fontSize: 16, fontWeight: '600', color: '#374151', marginBottom: 5, marginTop: 10 },
  input: { backgroundColor: 'white', padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#D1D5DB', fontSize: 16, color: '#000' },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 15 },
  column: { flex: 1 },
  button: { backgroundColor: '#DB2777', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30, marginBottom: 50 },
  buttonDisabled: { backgroundColor: '#F9A8D4' },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});

export default CreateLibraryScreen;
