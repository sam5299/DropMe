import React from "react";
import CreateRide from "../Screens/CreateRide";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Slide from "./Drawer/Slide";
import BookeRideStack from "../Screens/BookeRideStack";
import Notification from "../Screens/NotificationScreen";
import { Badge, VStack } from "native-base";

const Tab = createMaterialBottomTabNavigator();

function getNotificationCount() {
  return 2;
}

export default function BottomBar() {
  return (
    <>
      <Tab.Navigator
        activeColor="rgba(6,182,212,1.00)"
        inactiveColor="rgb(132,132,130)"
        style={{
          marginTop: 20,
        }}
        barStyle={{
          height: 60,
          backgroundColor: "white",
          position: "absolute",
          overflow: "hidden",
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
        initialRouteName="Create Ride"
      >
        <Tab.Screen
          name="Create Ride"
          component={CreateRide}
          options={{
            tabBarLabel: "Create Ride",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons
                name="bike-fast"
                color={color}
                size={25}
              />
            ),
          }}
        />
        <Tab.Screen
          name="BookRideStack"
          component={BookeRideStack}
          options={{
            tabBarLabel: "Book Ride",
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons name="car" color={color} size={26} />
            ),
          }}
        />
        <Tab.Screen
          name="Notification"
          component={Notification}
          options={{
            tabBarLabel: "Notifications",
            tabBarIcon: ({ color }) => (
              <VStack>
                <Badge // bg="red.400"
                  colorScheme="green"
                  rounded="full"
                  mb={-4}
                  mr={-4}
                  zIndex={1}
                  variant="solid"
                  alignSelf="flex-end"
                  _text={{
                    fontSize: 10,
                  }}
                >
                  {getNotificationCount()}
                </Badge>
                <MaterialCommunityIcons name="bell" color={color} size={26} />
              </VStack>
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
