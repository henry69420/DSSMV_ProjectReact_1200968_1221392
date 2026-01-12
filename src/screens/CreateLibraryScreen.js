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
    ActivityIndicator,
    Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LibraryActions } from '../actions/LibraryActions';

const CreateLibraryScreen = ({ navigation }) => {

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [openDays, setOpenDays] = useState('Mon-Fri');

    const [openTime, setOpenTime] = useState(new Date());
    const [closeTime, setCloseTime] = useState(new Date());

    const [showOpenTimePicker, setShowOpenTimePicker] = useState(false);
    const [showCloseTimePicker, setShowCloseTimePicker] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);


    const formatTime = (date) => {
        return date.toTimeString().slice(0, 5); // Returns "HH:MM"
    };

    const handleOpenTimeChange = (event, selectedTime) => {
        setShowOpenTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            setOpenTime(selectedTime);
        }
    };

    const handleCloseTimeChange = (event, selectedTime) => {
        setShowCloseTimePicker(Platform.OS === 'ios');
        if (selectedTime) {
            setCloseTime(selectedTime);
        }
    };

    const handleSave = async () => {

        if (!name.trim() || !address.trim()) {
            Alert.alert("Error", "Please fill at least the Name and Address.");
            return;
        }

        setIsSubmitting(true);

        try {

            const newLibrary = {
                name: name,
                address: address,
                openDays: openDays,
                openTime: formatTime(openTime),
                closeTime: formatTime(closeTime),
                open: true
            };


            await LibraryActions.createLibrary(newLibrary);

            Alert.alert("Success", "Library created successfully!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);

        } catch (error) {
            Alert.alert("Error", "Could not create the library.\n" + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.label}>Library Name *</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Ex: Central Library"
            />

            <Text style={styles.label}>Address *</Text>
            <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="Ex: 123 Main Street"
            />

            <Text style={styles.label}>Opening Days</Text>
            <TextInput
                style={styles.input}
                value={openDays}
                onChangeText={setOpenDays}
                placeholder="Ex: Mon-Fri"
            />

            <View style={styles.row}>
                <View style={styles.column}>
                    <Text style={styles.label}>Opening Time</Text>
                    <TouchableOpacity
                        style={styles.timeInput}
                        onPress={() => setShowOpenTimePicker(true)}
                    >
                        <Text style={styles.timeText}>{formatTime(openTime)}</Text>
                    </TouchableOpacity>
                    {showOpenTimePicker && (
                        <DateTimePicker
                            value={openTime}
                            mode="time"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleOpenTimeChange}
                            is24Hour={true}
                        />
                    )}
                </View>

                <View style={styles.column}>
                    <Text style={styles.label}>Closing Time</Text>
                    <TouchableOpacity
                        style={styles.timeInput}
                        onPress={() => setShowCloseTimePicker(true)}
                    >
                        <Text style={styles.timeText}>{formatTime(closeTime)}</Text>
                    </TouchableOpacity>
                    {showCloseTimePicker && (
                        <DateTimePicker
                            value={closeTime}
                            mode="time"
                            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                            onChange={handleCloseTimeChange}
                            is24Hour={true}
                        />
                    )}
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
                    <Text style={styles.buttonText}>Save Library</Text>
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
    timeInput: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#D1D5DB',
        justifyContent: 'center',
    },
    timeText: {
        fontSize: 16,
        color: '#000',
        textAlign: 'center',
    },
    button: { backgroundColor: '#DB2777', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 30, marginBottom: 50 },
    buttonDisabled: { backgroundColor: '#F9A8D4' },
    buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});

export default CreateLibraryScreen;
