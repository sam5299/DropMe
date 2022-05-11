import { View, Text } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RideTab from "./rideTab";

const rideStack = createNativeStackNavigator();

const RideStack = () => {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <rideStack.Navigator>
        <rideStack.Screen
          name="RideTab"
          component={RideTab}
          options={{ headerShown: false }}
        />
      </rideStack.Navigator>
    </View>
  );
};

export default RideStack;
