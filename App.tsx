// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, Text, View } from 'react-native';

// Importa os teus ecrãs
import HomeScreen from './src/screens/HomeScreen';
import LibraryListScreen from './src/screens/LibraryListScreen';
import BookSearchScreen from './src/screens/BookSearchScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import CreateLibraryScreen from './src/screens/CreateLibraryScreen';
import UpdateLibraryScreen from "./src/screens/UpdateLibraryScreen";
import CheckedOutScreen from "./src/screens/CheckedOutScreen";

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
          options={{ title: 'Libraries' }}
        />

        <Stack.Screen
          name="BookSearch"
          component={BookSearchScreen}
          options={{ title: 'Search Books' }}
        />

        <Stack.Screen
          name="BookDetail"
          component={BookDetailScreen}
          options={{ title: 'Book Details' }}
        />

        <Stack.Screen
              name="UpdateLibrary"
              component={UpdateLibraryScreen}
              options={{ title: 'Edit Livrary' }}
        />

        <Stack.Screen
          name="CreateLibrary"
          component={CreateLibraryScreen}
          options={{ title: 'New Livrary' }}
        />

        <Stack.Screen
            name="CheckedOut"
            component={CheckedOutScreen}
            options={{ title: 'Checked Out Books' }}
        />

        {/* Ecrãs "Em Construção" para os botões não darem erro */}

          {/*<Stack.Screen name="LibraryMap" component={PlaceholderScreen} options={{ title: 'Mapa' }} />*/}

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
