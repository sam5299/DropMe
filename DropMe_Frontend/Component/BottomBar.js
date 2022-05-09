import { View, Text } from "react-native";
import React from "react";
import BookRide from "../Screens/BookRide";
import CreateRide from "../Screens/CreateRide";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createMaterialBottomTabNavigator();

export default function BottomBar() {
  return (
    <>
      <Tab.Navigator
        style={{
          height: 20,
          marginTop: 20,
          elevation: 0,
        }}
      >
        <Tab.Screen
          name="Create Ride"
          component={CreateRide}
          options={{
            tabBarLabel: "Create Ride",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="car" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Book Ride"
          component={BookRide}
          options={{
            tabBarLabel: "Book Ride",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="bell" color={color} size={26} />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}
