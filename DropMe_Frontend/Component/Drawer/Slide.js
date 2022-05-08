import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Menu from "../../Screens/Menu";
import Rides from "../Rides/Rides";
import { Text, View } from "native-base";
import Balance from "../Wallet/Balance";

const SliderStack = createNativeStackNavigator();

const Slide = () => {
  return (
    <View style={{ flex: 1 }} collapsable={false}>
      <SliderStack.Navigator>
        <SliderStack.Screen
          name="Menu"
          component={Menu}
          options={{ headerShown: false }}
        />
        <SliderStack.Screen name="Rides" component={Rides} />
        <SliderStack.Screen name="Balance" component={Balance} />
      </SliderStack.Navigator>
    </View>
  );
};

export default Slide;
