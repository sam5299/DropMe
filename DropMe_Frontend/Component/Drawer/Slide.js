import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Menu from "../../Screens/Menu";
import Rides from "../Rides/Rides";
import { Text, View } from "native-base";
import Balance from "../Wallet/Balance";
import AddRemoveStack from "../Vehicle/AddRemoveStack";
import TripsStack from "../Trips/TripsStack";
import ViewProfile from "../Profile/ViewProfile";
import RideStack from "../Rides/RideStack";
import NotificationScreen from "../../Screens/NotificationScreen";
import WalletStack from "../Wallet/WalletStack";
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
          component={RideStack}
          options={{ headerShown: false }}
        />
        <SliderStack.Screen
          name="WalletStack"
          component={WalletStack}
          options={{ headerShown: false }}
        />
        <SliderStack.Screen
          name="Vehicles"
          component={AddRemoveStack}
          options={{ headerShown: false }}
        />
        <SliderStack.Screen
          name="TripsStack"
          component={TripsStack}
          options={{ headerShown: false }}
        />
        <SliderStack.Screen name="Profile" component={ViewProfile} />
        <SliderStack.Screen
          name="Notification"
          component={NotificationScreen}
        />
      </SliderStack.Navigator>
    </View>
  );
};

export default Slide;
