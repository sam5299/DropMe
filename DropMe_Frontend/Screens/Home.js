import { View, Text } from "react-native";
import React from "react";
import BottomBar from "../Component/BottomBar";
import SideBar from "../Component/SideBar/SideBar";


const Home = () => {
  return (
    <>
      <NavigationContainer>
    
      <SideBar/>
      
        
      </NavigationContainer>
      <NavigationContainer>
    
     
      
        <BottomBar />
      </NavigationContainer>
    </>
  );
};

export default Home;
