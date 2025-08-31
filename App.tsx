import { Text,   StyleSheet,StatusBar,View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import Splash from './components/Splash';
import Map from './components/Map';
 
export default function App() {
  const Stack = createNativeStackNavigator();


  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <StatusBar/>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}> 
          <Stack.Screen name="Splash" component={Splash}  />
          <Stack.Screen name="Map" component={Map}  />
        </Stack.Navigator>
      </NavigationContainer> 
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
  }, 
});
