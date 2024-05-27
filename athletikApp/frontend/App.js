import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Button } from '@rneui/themed';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Login from './src/Login.js';
import LandingPage from './src/LandingPage';
import SignUp from './src/SignUp';
import HomePage from './src/HomePage';
import Activity from './src/Activity.js';
import SaveActivityForm from './src/SaveActivityForm.js';
import Post from './src/Post.js';
import Profile from './src/Profile.js';
import ProfileActivities from './src/ProfileActivities.js';

function HomePageStackScreen() {
  const HomePageStack = createNativeStackNavigator();

  return (
    <HomePageStack.Navigator>
      <HomePageStack.Screen
        name="HomePage"
        component={HomePage}
        options={{ headerShown: false }}
      />
      <HomePageStack.Screen
        name="Post"
        component={Post}
        options={{ title: '', headerBackTitleVisible: false, headerTintColor: 'black' }}
      />
    </HomePageStack.Navigator>
  );
}

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
        options={{ title: 'Guardar actividad', headerBackTitleVisible: false, headerTintColor: 'black' }}
      />
    </ActivityStack.Navigator>
  );
}

function ProfileActivitiesStackScreen() {
  const ProfileActivitiesStack = createNativeStackNavigator();

  return (
    <ProfileActivitiesStack.Navigator>
      <ProfileActivitiesStack.Screen
        name="ProfileActivities"
        component={ProfileActivities}
        options={{
          title: 'Actividades',
          headerShown: false
        }}
      />
      <ProfileActivitiesStack.Screen
        name="ProfilePost"
        component={Post}
        options={{
          title: 'Publicación',
          headerRight: () => (
            <Button
              color='white'
              containerStyle={{ marginRight: -10 }}
              iconPosition='right'
              icon={<Ionicons name='ellipsis-horizontal-outline' size={20} />} />
          )
        }}
      />
      <ProfileActivitiesStack.Screen
        name="ModifyActivityForm"
        component={SaveActivityForm}
        options={{ title: 'Modificar actividad' }}
      />
    </ProfileActivitiesStack.Navigator >
  );
}

function ProfileStackScreen() {
  const Tab = createMaterialTopTabNavigator();

  return (
    <Tab.Navigator screenOptions={{
      tabBarIndicatorStyle: { backgroundColor: 'green' }
    }} options={{ title: 'Tú' }}>
      <Tab.Screen
        name="ProfileActivitiesStack"
        component={ProfileActivitiesStackScreen}
        options={{ title: 'Actividades' }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{ title: 'Perfil' }}
      />
    </Tab.Navigator >
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
              ? 'home'
              : 'home-outline';
          } else if (route.name === 'ActivityStack') {
            iconName = focused ? 'duplicate' : 'duplicate-outline';
          } else if (route.name === 'ProfileStack') {
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
        name="ActivityStack"
        component={ActivityStackScreen}
        options={{ title: 'Actividad', headerShown: false }}
      />
      <Tab.Screen
        name="ProfileStack"
        component={ProfileStackScreen}
        options={{ title: 'Tú' }}
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
            options={{ title: '', headerBackTitleVisible: false, headerTintColor: 'black' }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ title: '', headerBackTitleVisible: false, headerTintColor: 'black' }}
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
