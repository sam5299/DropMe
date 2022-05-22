import { View, Text, ImageBackground, StyleSheet } from "react-native";
import React from "react";
import dropme from "../assets/dropme.jpg";

const Splash = () => {
  const image = {
    uri: "https://i.pinimg.com/originals/ef/54/1a/ef541a91981d33021b53b63efa6bf71d.jpg",
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={dropme}
        style={styles.image}
        imageStyle={{ opacity: 0.8 }}
      >
        <Text style={styles.text}>Welcome To DropMe</Text>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "flex-end",
  },
  text: {
    color: "white",
    fontSize: 30,
    lineHeight: 84,
    fontWeight: "bold",
    textAlign: "center",
    backgroundColor: "#000000c0",
  },
});
export default Splash;
