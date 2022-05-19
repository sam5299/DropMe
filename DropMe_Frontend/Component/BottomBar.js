import { View, Text } from "react-native";
import React from "react";
import BookRide from "../Screens/BookRide";
import CreateRide from "../Screens/CreateRide";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Menu from "../Screens/Menu";
import Slide from "./Drawer/Slide";
import BookeRideStack from "../Screens/BookeRideStack";

const Tab = createMaterialBottomTabNavigator();

export default function BottomBar() {
  return (
    <>
      <Tab.Navigator
        style={{
          height: 20,
          marginTop: 20,
        }}
        activeColor="white"
        inactiveColor="#36454f"
        barStyle={{ backgroundColor: "rgba(6,182,212,1.00)" }}
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
          name="BookRideStack"
          component={BookeRideStack}
          options={{
            tabBarLabel: "Book Ride",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="bell" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Slide"
          component={Slide}
          options={{
            tabBarLabel: "Menu",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="menu-open"
                color={color}
                size={26}
              />
            ),
          }}
        />
      </Tab.Navigator>
    </>
  );
}
