import { View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RequestRide from "./RequestRide";
import AcceptRejectRequest from "./AcceptRejectRequest";

const rideStack = createNativeStackNavigator();

const RideStack = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <rideStack.Navigator>
        <rideStack.Screen
          name="RequestRide"
          component={RequestRide}
          options={{ headerShown: false }}
        />
        <rideStack.Screen
          name="ViewRequest"
          component={AcceptRejectRequest}
          options={{ headerShown: false }}
        />
      </rideStack.Navigator>
    </View>
  );
};

export default RideStack;
