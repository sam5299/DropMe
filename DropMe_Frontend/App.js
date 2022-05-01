import 'react-native-gesture-handler';
import { Box, NativeBaseProvider } from "native-base";
import { StyleSheet, Text, View, Platform, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";


import Home from './Screens/Home';


export default function App() {
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    setAnimating(true);
    setTimeout(() => {
      setAnimating(false);
    }, 3000);
  }, []);
  return (
    <SafeAreaProvider>
      
      <NativeBaseProvider style={styles.container}>
      <Home/>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
