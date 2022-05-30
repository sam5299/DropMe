import * as React from "react";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { Box } from "native-base";
import TripBooked from "./TripBooked";
import TripHistory from "./TripHistory";

const Tab = createMaterialTopTabNavigator();

export default function TripsTopBar() {
  return (
    <Box flex={1} mt={"1"}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: { fontSize: 12 },
          tabBarStyle: { backgroundColor: "#F0F8FF" },
        }}
        initialRouteName="Booked Trips"
      >
        <Tab.Screen name="Booked Trips" component={TripBooked} />
        <Tab.Screen name="History" component={TripHistory} />
      </Tab.Navigator>
    </Box>
  );
}
