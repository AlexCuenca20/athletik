import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Login from './src/Login.js';
import LandingPage from './src/LandingPage';
import SignUp from './src/SignUp';
import HomePage from './src/HomePage';
import Activity from './src/Activity.js';
import SaveActivityForm from './src/SaveActivityForm.js';
import Post from './src/Post.js';

function ActivityStackScreen() {
  const ActivityStack = createNativeStackNavigator();

  return (
    <ActivityStack.Navigator>
      <ActivityStack.Screen
        name="Activity"
        component={Activity}
        options={{ title: 'Actividad' }}
      />
      <ActivityStack.Screen
        name="SaveActivityForm"
        component={SaveActivityForm}
        options={{ title: 'Guardar actividad' }}
      />
      <ActivityStack.Screen
        name="Post"
        component={Post}
        options={{ title: 'Publicación' }}
      />
    </ActivityStack.Navigator>
  );
}

function HomePageStackScreen() {
  const HomePageStack = createNativeStackNavigator();

  return (
    <HomePageStack.Navigator>
      <HomePageStack.Screen
        name="HomePage"
        component={HomePage}
        options={{ title: 'Inicio' }}
      />
      <HomePageStack.Screen
        name="Post"
        component={Post}
        options={{
          title: 'Publicación',
          headerRight: () => (
            <Button title="Post actions" />
          ),
        }}
      />
    </HomePageStack.Navigator>
  );
}

function Home() {
  const Tab = createBottomTabNavigator();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomePageStack') {
            iconName = focused
              ? 'ios-information-circle'
              : 'ios-information-circle-outline';
          } else if (route.name === 'ActivityHome') {
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
        name="HomePageStack"
        component={HomePageStackScreen}
        options={{ title: 'Inicio', headerShown: false }}
      />
      <Tab.Screen
        name="ActivityHome"
        component={ActivityStackScreen}
        options={{ title: 'Actividad', headerShown: false }}
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
        <Stack.Navigator>
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
