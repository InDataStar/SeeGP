import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('Map'); // Adjust to your route name
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image
        style={styles.logo}
        source={require('../assets/SeeGPDoctor.png')}
      />
      <Text style={styles.title}>Welcome to SeeGP</Text>
      <Text style={styles.subtitle}>
        Quickly find available GPs near you – no waiting, no guesswork.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleGetStarted}>
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logo: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 2.5,
    borderColor: '#48e5c2',
    marginBottom: 20,
    resizeMode: 'stretch',
  },
  title: {
    fontSize: 28,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: '#48e5c2',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'monospace',
    textAlign: 'center',
    color: '#333',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#48e5c2',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'monospace',
    fontWeight: 'bold',
    color: 'white',
  },
});

export default WelcomeScreen;
