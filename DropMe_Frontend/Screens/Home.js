import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import BottomBar from "../Component/BottomBar";

const Home = () => {
  return (
    <NavigationContainer>
      <BottomBar />
    </NavigationContainer>
  );
};

export default Home;
