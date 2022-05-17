import { View } from "react-native";
import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import RideTab from "./RideTab";
import Rides from "./Rides";
import RequestRide from "./RequestRide";
import AcceptRejectRequest from "./AcceptRejectRequest";
import BookedRides from "./BookedRides";
import RideHistory from "./RideHistory";

const rideStack = createNativeStackNavigator();

const RideStack = ({ navigation }) => {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
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
        <rideStack.Screen
          name="BookedRides"
          component={BookedRides}
          options={{ headerShown: false }}
        />
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
        <rideStack.Screen
          name="RideHistory"
          component={RideHistory}
          options={{ headerShown: false }}
        />
      </rideStack.Navigator>
    </View>
  );
};

export default RideStack;
