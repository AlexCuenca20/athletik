import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './src/Login.js';
import LandingPage from './src/LandingPage';
import SignUp from './src/SignUp';
import HomePage from './src/HomePage';
import Activity from './src/Activity.js';
import FooterTabs from './src/FooterTabs.js';

export default function App() {
  const Stack = createNativeStackNavigator();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{
          headerStyle: {
            backgroundColor: '#DAF7A6',
          },
          headerTintColor: '#aaa',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} >
          <Stack.Screen
            name="LandingPage"
            component={LandingPage}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: '' }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: 'CREA TU CUENTA' }}
          />
          <Stack.Screen
            name="HomePage"
            component={HomePage}
            options={{ title: 'Inicio' }}
          />
          <Stack.Screen
            name="Activity"
            component={Activity}
            options={{ title: '' }}
          />
        </Stack.Navigator>
      </NavigationContainer >
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
