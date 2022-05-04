import "react-native-gesture-handler";
import { Box, NativeBaseProvider } from "native-base";
import {
  StyleSheet,
  Platform,
  StatusBar,
  useWindowDimensions,
  Dimensions,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Main from "./Component/Authentication/Main";
import { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

export default function App() {
  const [animating, setAnimating] = useState(false);

  return (
    <SafeAreaProvider>
      <NativeBaseProvider style={styles.container}>
        <NavigationContainer>
          <Main />
        </NavigationContainer>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
