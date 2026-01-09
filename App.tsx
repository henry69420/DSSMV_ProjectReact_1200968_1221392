import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'react-native';

// imports dos ecrãs
import HomeScreen from './src/screens/HomeScreen';
import LibraryListScreen from './src/screens/LibraryListScreen';
import BookSearchScreen from './src/screens/BookSearchScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import CreateLibraryScreen from './src/screens/CreateLibraryScreen';
import UpdateLibraryScreen from "./src/screens/UpdateLibraryScreen";
import CheckedOutScreen from "./src/screens/CheckedOutScreen";

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Stack.Navigator initialRouteName="Home">

        {/* O Menu Principal */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />

        {/* Listagem */}
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
          options={{ title: 'Edit Library' }}
        />

        <Stack.Screen
          name="CreateLibrary"
          component={CreateLibraryScreen}
          options={{ title: 'New Library' }}
        />

        <Stack.Screen
          name="CheckedOut"
          component={CheckedOutScreen}
          options={{ title: 'Checked Out Books' }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
