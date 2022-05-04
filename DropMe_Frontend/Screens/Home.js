import { View, Text } from "react-native";
import React, { useContext } from "react";
import BottomBar from "../Component/BottomBar";
import { Button } from "native-base";
import { AuthContext } from "../Component/Context";

const Home = () => {
  const { signOut } = useContext(AuthContext);
  return (
    <>
      <BottomBar />
      <Button onPress={() => signOut()}>Sign Out</Button>
    </>
  );
};

export default Home;
