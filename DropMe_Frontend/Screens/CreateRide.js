import { Alert, View } from "react-native";
import React, { useEffect, useReducer } from "react";
import SourceDestination from "../Component/SourceDestination";
import GoogleMap from "../Component/GoogleMap";
import DateTime from "../Component/DateTime";
import VehicleAndClass from "../Component/VehicleAndClass";
import RideForType from "../Component/RideForType";
import { Button, FormControl, Text } from "native-base";

const initialState = {
  source: "",
  destination: "",
  date: "",
  time: "",
  vehicle: "",
  vehicleClass: "",
  vehicleSeats: "",
  rideFor: "Both",
  rideType: "Paid",
};

const reducer = (state, action) => {
  switch (action.type) {
    case "source":
      return {
        ...state,
        source: action.payload,
      };
    case "destination":
      return {
        ...state,
        destination: action.payload,
      };
    case "date":
      return {
        ...state,
        date: action.payload,
      };
    case "time":
      return {
        ...state,
        time: action.payload,
      };
    case "vehicle":
      return {
        ...state,
        vehicle: action.payload,
      };
    case "vehicleClass":
      return {
        ...state,
        vehicleClass: action.payload,
      };
    case "vehicleSeats":
      return {
        ...state,
        vehicleSeats: action.payload,
      };
    case "rideFor":
      return {
        ...state,
        rideFor: action.payload,
      };
    case "rideType":
      return {
        ...state,
        rideType: action.payload,
      };
    default:
      return state;
  }
};

const CreateRide = () => {
  // useEffect(() => {
  //   alert(state.vehicleSeats);
  // }, state);
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleForm = () => {
    for (const key in state) {
      if (state[key] === "" || state[key] === 0) {
        const k = key.toString();
        Alert.alert("Error", `"${k}" field is missing`);
        return;
      }
    }
    Alert.alert("Success", "Ride Created...!");
  };

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "#f5f5f5",
        height: "100%",
        flexDirection: "column",
        marginTop: "0%",
      }}
    >
      <GoogleMap />
      <FormControl>
        <SourceDestination dispatch={dispatch} />
        <DateTime dispatch={dispatch} />
        <VehicleAndClass dispatch={dispatch} />
        <RideForType dispatch={dispatch} />
        <Button size="md" mt={"6"} w="95%" mx={3} onPress={handleForm}>
          <Text fontSize={"lg"} color="white">
            Submit
          </Text>
        </Button>
      </FormControl>
    </View>
  );
};

export default CreateRide;
