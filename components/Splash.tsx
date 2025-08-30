import {
  Text,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  View,
  Animated,
  Image
} from 'react-native';
import { useEffect, useCallback, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';

// ];
//heart-outline, medkit,heart-outline
const Splash = () => {
  const navigation = useNavigation();

  const goToMain = useCallback(() => {
    navigation.navigate('Map');
  }, [navigation]);

  useEffect(() => {
    // console.log('Splash');
    const timeout = setTimeout(goToMain, 3000); // 2 seconds

    return () => clearTimeout(timeout); // Cleanup if unmounted early
  }, [goToMain]);

  return (
    <View style={styles.container}>
      <Image style={styles.splashImageContainer} source={require('../assets/seeGP3.png')}/> 
      <Text style={styles.titleText}>SeeGP</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'column',
  },
  titleText: {
    fontSize: 30,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#48e5c2',
  },
  splashImageContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignItems: 'center',
    justifyContent: 'center', 
    backgroundColor:'white',
    borderColor: '#48e5c2',
    borderWidth:5,
    resizeMode: 'stretch',
    marginBottom:5
  },
});
export default Splash;
