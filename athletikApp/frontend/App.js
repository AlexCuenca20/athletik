import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from './src/Login.js';
import LandingPage from './src/LandingPage';
import SignUp from './src/SignUp';
import HomePage from './src/HomePage';
import Activity from './src/Activity.js';
import Ionicons from 'react-native-vector-icons/Ionicons';

function Home() {
  const Tab = createBottomTabNavigator();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomePage') {
            iconName = focused
              ? 'ios-information-circle'
              : 'ios-information-circle-outline';
          } else if (route.name === 'Activity') {
            iconName = focused ? 'bicycle' : 'bicycle-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person-circle' : 'person-circle-outline';
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'green',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="HomePage"
        component={HomePage}
        options={{ title: 'Inicio' }}
      />
      <Tab.Screen
        name="Activity"
        component={Activity}
        options={{ title: 'Actividad' }}
      />
      <Tab.Screen
        name="Profile"
        component={Activity}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator>
  );
}

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
            name="Home"
            component={Home}
            options={{ headerShown: false }}
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
