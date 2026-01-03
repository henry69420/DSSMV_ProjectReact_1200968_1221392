// src/screens/UpdateLibraryScreen.js
import React, { useState, useEffect } from 'react';
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, ScrollView, Alert, SafeAreaView,
    Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { LibraryActions } from '../actions/LibraryActions';

const UpdateLibraryScreen = ({ route, navigation }) => {
    // 1. Retrieve the library passed by LibraryListScreen
    const { library } = route.params;

    // 2. Form state initialized with current data
    const [name, setName] = useState(library.name);
    const [address, setAddress] = useState(library.address);
    const [openDays, setOpenDays] = useState(library.openDays);

    // Time states as Date objects
    const [openTime, setOpenTime] = useState(new Date());
    const [closeTime, setCloseTime] = useState(new Date());

    // State to control picker visibility
    const [showOpenTimePicker, setShowOpenTimePicker] = useState(false);
    const [showCloseTimePicker, setShowCloseTimePicker] = useState(false);

    // Initialize time states from library data
    useEffect(() => {
        if (library.openTime) {
            const [hours, minutes] = library.openTime.split(':').map(Number);
            const openDate = new Date();
            openDate.setHours(hours, minutes, 0, 0);
            setOpenTime(openDate);
        }

        if (library.closeTime) {
            const [hours, minutes] = library.closeTime.split(':').map(Number);
            const closeDate = new Date();
            closeDate.setHours(hours, minutes, 0, 0);
            setCloseTime(closeDate);
        }
    }, [library]);

    // Function to format time as string "HH:MM"
    const formatTime = (date) => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    };

    // Handlers for time pickers
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

    const handleUpdate = async () => {
        if (!name || !address) {
            Alert.alert("Error", "Name and Address are required.");
            return;
        }

        const updatedData = {
            id: library.id,
            name,
            address,
            openDays,
            openTime: formatTime(openTime),
            closeTime: formatTime(closeTime)
        };

        try {
            // Call to Flux Action (which we already have in LibraryActions.js)
            await LibraryActions.updateLibrary(library.id, updatedData);

            Alert.alert("Success", "Library updated successfully!", [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            Alert.alert("Error", "Could not update: " + error.message);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scroll}>
                <Text style={styles.label}>Library Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Ex: Central Library"
                />

                <Text style={styles.label}>Address</Text>
                <TextInput
                    style={styles.input}
                    value={address}
                    onChangeText={setAddress}
                    placeholder="Street..."
                />

                <Text style={styles.label}>Opening Days</Text>
                <TextInput
                    style={styles.input}
                    value={openDays}
                    onChangeText={setOpenDays}
                    placeholder="Ex: Mon-Fri"
                />

                <View style={styles.row}>
                    <View style={styles.flex1}>
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

                    <View style={{ width: 20 }} />

                    <View style={styles.flex1}>
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

                <TouchableOpacity style={styles.button} onPress={handleUpdate}>
                    <Text style={styles.buttonText}>💾 SAVE CHANGES</Text>
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
    timeInput: {
        backgroundColor: '#FFF',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        minHeight: 48,
    },
    timeText: {
        color: '#1F2937',
        fontSize: 16,
        textAlign: 'center',
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