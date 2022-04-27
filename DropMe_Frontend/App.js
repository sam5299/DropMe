import { NativeBaseProvider } from "native-base";
import { StyleSheet, Text, View, Platform, StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import BookRide from "./Screens/BookRide";

export default function App() {
  return (
    <SafeAreaProvider>
      <NativeBaseProvider>
        <View style={styles.container}>
          <BookRide />
        </View>
      </NativeBaseProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
