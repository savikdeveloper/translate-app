import 'react-native-gesture-handler';
import * as React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import SettingsScreen from './screens/SettingsScreen';
import SavedScreen from './screens/SavedScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Entypo } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import * as SplashScreen from 'expo-splash-screen';
import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import { useCallback } from 'react';
import LanguageSelectScreen from './screens/LanguageSelectScreen';
import colors from './utils/colors'
import { Provider } from 'react-redux';
import store from './store/store';

// import AsyncStorage from '@react-native-async-storage/async-storage';
// AsyncStorage.clear();

SplashScreen.preventAutoHideAsync();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return(
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => {
            return <Entypo name="home" size={24} color="black" />
          }
        }}
      />
      <Tab.Screen 
        name="Saved" 
        component={SavedScreen}
        options={{ 
          tabBarLabel: "Saved",
          tabBarIcon: () => {
            return <Entypo name="star" size={24} color="black" />
          }
        }} 
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen} 
        options={{ 
          tabBarLabel: "Settings",
          tabBarIcon: () => {
            return <Ionicons name="settings" size={24} color="black" />
          }
        }} 
      />
    </Tab.Navigator>
  )
}

const Stack = createNativeStackNavigator();

function App() {
  const [appIsLoad, setAppIsload] = useState();

  useEffect(() => {
    const prepare = async () => {
      try {
        await Font.loadAsync({
          black: require("./assets/fonts//Roboto-Black.ttf"),
          blackItalic: require("./assets/fonts/Roboto-BlackItalic.ttf"),
          bold: require("./assets/fonts/Roboto-Bold.ttf"),
          boldItalic: require("./assets/fonts/Roboto-BoldItalic.ttf"),
          italic: require("./assets/fonts/Roboto-Italic.ttf"),
          light: require("./assets/fonts/Roboto-Light.ttf"),
          lightItalic: require("./assets/fonts/Roboto-LightItalic.ttf"),
          medium: require("./assets/fonts/Roboto-Medium.ttf"),
          mediumItalic: require("./assets/fonts/Roboto-MediumItalic.ttf"),
          regular: require("./assets/fonts/Roboto-Regular.ttf"),
          thin: require("./assets/fonts/Roboto-Thin.ttf"),
          thinItalic: require("./assets/fonts/Roboto-ThinItalic.ttf"),
        })
      }
      catch(e) {
        console.log(e);
      }
      finally {
        setAppIsload(true);
      }
    }
    prepare();
  }, [])

  const onLayout = useCallback(async () => {
    if(appIsLoad) {
      await SplashScreen.hideAsync();
    }
  }, [appIsLoad]);

  if(!appIsLoad) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <View onLayout={onLayout} style={{ flex: 1 }}>
          <Stack.Navigator
            screenOptions={{
              headerTitleStyle: {
                fontFamily: 'medium',
                color: "white"
              },
              headerStyle: {
                backgroundColor: '#1a73e8'
              }
            }}
          >           
            <Stack.Group>
              <Stack.Screen
                name='main'
                component={TabNavigator}
                options={{
                  headerTitle: "Translate",
                }}
              />
            </Stack.Group>

            <Stack.Group
              screenOptions={{
                presentation: 'containedModal',
                headerStyle: {
                  backgroundColor: 'white'
                },
                headerTitleStyle: {
                  color: colors.textColor,
                  fontFamily: 'medium'
                },
                // headerShadowVisible: false
              }}
            >
              <Stack.Screen
                name='languageSelect'
                component={LanguageSelectScreen}
              />
            </Stack.Group>
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </Provider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignContent: "center",
    justifyContent: 'center'
  }
})

export default App;