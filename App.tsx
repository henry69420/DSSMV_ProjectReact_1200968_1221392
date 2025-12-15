// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, Text, View } from 'react-native';

// Importa os teus ecrãs
import HomeScreen from './src/screens/HomeScreen';
import LibraryListScreen from './src/screens/LibraryListScreen';

// === PLACEHOLDER SEGURO (CORREÇÃO DO ERRO) ===
const PlaceholderScreen = (props: any) => {
    // Se 'route' existir usa o nome, senão usa 'Ecrã'
    const screenName = props.route?.name || "Em Construção";

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F3F4F6' }}>
            <Text style={{ fontSize: 40 }}>🚧</Text>
            <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>{screenName}</Text>
            <Text style={{ color: 'gray', marginTop: 5 }}>Funcionalidade a caminho...</Text>
        </View>
    );
};
// ===============================================

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
    return (
        <NavigationContainer>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            <Stack.Navigator initialRouteName="Home">

                {/* O Menu Principal (Header escondido para ficar mais bonito) */}
                <Stack.Screen
                    name="Home"
                    component={HomeScreen}
                    options={{ headerShown: false }}
                />

                {/* Ecrã de Listagem (JÁ FUNCIONA COM A API) */}
                <Stack.Screen
                    name="LibraryList"
                    component={LibraryListScreen}
                    options={{ title: 'Bibliotecas' }}
                />

                {/* Ecrãs "Em Construção" para os botões não darem erro */}
                <Stack.Screen name="BookSearch" component={PlaceholderScreen} options={{ title: 'Pesquisa' }} />
                <Stack.Screen name="CheckedOut" component={PlaceholderScreen} options={{ title: 'Empréstimos' }} />
                <Stack.Screen name="CreateLibrary" component={PlaceholderScreen} options={{ title: 'Nova Biblioteca' }} />
                <Stack.Screen name="LibraryMap" component={PlaceholderScreen} options={{ title: 'Mapa' }} />

            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;
