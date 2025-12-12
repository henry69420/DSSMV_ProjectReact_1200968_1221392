
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import LibraryListScreen from './src/screens/LibraryListScreen';

// import CreateLibraryScreen from './src/screens/CreateLibraryScreen';

const Stack = createNativeStackNavigator();

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="LibraryList"
                screenOptions={{
                    headerStyle: { backgroundColor: '#22C55E' }, // green_main do seu colors.xml
                    headerTintColor: '#fff',
                    headerTitleStyle: { fontWeight: 'bold' },
                }}
            >
                {/* Aqui você define as "Activities" da sua app */}
                <Stack.Screen
                    name="LibraryList"
                    component={LibraryListScreen}
                    options={{ title: 'Bibliotecas' }}
                />

                {/* Exemplo de como adicionaria a tela de Update mais tarde */}
                {/* <Stack.Screen name="UpdateLibrary" component={UpdateLibraryScreen} /> */}
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
