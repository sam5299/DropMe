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
import HelpPage from "../../Screens/HelpPage";
const SliderStack = createNativeStackNavigator();

const Slide = ({route,navigation}) => {



  React.useEffect(()=> {
    if(route.params) {
      console.log("navigated to slide!");
      const {notificationType} = route.params;
      console.log("notificationType:",notificationType)
      switch(notificationType) {
        case "Ride":
          console.log("Ride notification and redirecting to Ride");
          navigation.navigate("RideStack",{notificationType:notificationType})
          break;
        case "Trip":
          console.log("navigating to TripStack");
          navigation.navigate("TripsStack",{notificationType:notificationType})
          break;
        case "Wallet":
          navigation.navigate("WalletStack");
          break;
        // case "Login":
        //   console.log("Login notification but redirecting to Ride");
        //   navigation.navigate("RideStack",{notificationType:notificationType})
        //   break;
        default:
          break;
      }
    }
  },[route.params])

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
        <SliderStack.Screen 
        name="Profile" 
        component={ViewProfile} 
        />
        <SliderStack.Screen
          name="Notifications"
          component={NotificationScreen}
        />
        <SliderStack.Screen
          name="Help"
          component={HelpPage}
        />
      </SliderStack.Navigator>
    </View>
  );
};

export default Slide;
