import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Menu from "../../Screens/Menu";
import { View } from "native-base";
import ViewProfile from "../Profile/ViewProfile";
import NotificationScreen from "../../Screens/NotificationScreen";
import WalletStack from "../Wallet/WalletStack";
import RideTopBar from "../Rides/RideTopBar";
import TripsTopBar from "../Trips/TripsTopBar";
import VehicleTopBar from "../Vehicle/VehicleTopBar";
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
        <SliderStack.Screen
          name="RideStack"
          component={RideTopBar}
          options={{ headerShown: false }}
        />
        <SliderStack.Screen
          name="WalletStack"
          component={WalletStack}
          options={{ headerShown: false }}
        />
        <SliderStack.Screen
          name="Vehicle"
          component={VehicleTopBar}
          options={{ headerShown: false }}
        />
        <SliderStack.Screen
          name="TripsStack"
          component={TripsTopBar}
          options={{ headerShown: false }}
        />
        <SliderStack.Screen name="Profile" component={ViewProfile} />
        <SliderStack.Screen
          name="Notifications"
          component={NotificationScreen}
        />
      </SliderStack.Navigator>
    </View>
  );
};

export default Slide;
