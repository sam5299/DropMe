import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RideTab from "./RideTab";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Button, Icon } from "native-base";
import Rides from "./Rides";
//import RequestRide from "./RequestRide";

const rideStack = createNativeStackNavigator();

const RideStack = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <Button
        variant={"outline"}
        w={"50%"}
        size={"md"}
        leftIcon={
          <Icon as={<MaterialCommunityIcons name="arrow-left" />} size={"md"} />
        }
        onPress={() => navigation.navigate("Menu")}
      >
        Go Back
      </Button>
      <rideStack.Navigator>
        <rideStack.Screen
          name="RideTab"
          component={RideTab}
          options={{ headerShown: false }}
        />
        <rideStack.Screen
          name="Rides"
          component={Rides}
          options={{ headerShown: false }}
        />
      </rideStack.Navigator>
    </View>
  );
};

export default RideStack;
