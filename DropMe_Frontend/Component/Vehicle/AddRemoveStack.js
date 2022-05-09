import { View, Text } from "react-native";
import React from "react";
import { Box, Button, Icon } from "native-base";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AddRemoveScreen from "./AddRemoveScreen";
import AddVehicle from "../Vehicle/AddVehicle";
import UploadDocumentForVehicle from "../Vehicle/UploadDocumentForVehicle";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ViewVehicles from "./ViewVehicles";

const Stack = createNativeStackNavigator();

const AddRemoveStack = ({ navigation }) => {
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
        Vehicles
      </Button>
      <Stack.Navigator>
        <Stack.Screen
          name="AddRemove"
          component={AddRemoveScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ViewVehicles"
          component={ViewVehicles}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddVehicle"
          component={AddVehicle}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="UploadDocumentForVehicle"
          component={UploadDocumentForVehicle}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </View>
  );
};

export default AddRemoveStack;
