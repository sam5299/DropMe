import "react-native-gesture-handler";
import { Box, NativeBaseProvider } from "native-base";
import { StyleSheet, Text, View, Platform, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Main from "./Component/Authentication/Main";
import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Splash from "./Screens/Splash";

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
        <NavigationContainer>
          {animating ? <Splash /> : <Main />}
        </NavigationContainer>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});