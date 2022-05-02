import { Alert, View } from "react-native";
import React, { useEffect, useReducer, useState } from "react";
import SourceDestination from "../Component/SourceDestination";
import GoogleMap from "../Component/GoogleMap";
import DateTime from "../Component/DateTime";
import VehicleAndClass from "../Component/VehicleAndClass";
import RideForType from "../Component/RideForType";
import { Button, FormControl, Text, WarningOutlineIcon } from "native-base";

const initialState = {
  source: "",
  destination: "",
  date: "",
  time: "",
  vehicle: "",
  vehicleClass: "",
  vehicleSeats: "1",
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
  const [error, setError] = useState({ isError: false, missingField: "" });

  const handleForm = () => {
    for (const key in state) {
      if (state[key] === "") {
        const k = key.toString();
        setError({ isError: true, missingField: k });
        setTimeout(() => setError({ isError: false, missingField: "" }), 4000);
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
      <FormControl isInvalid={error.isError}>
        <SourceDestination dispatch={dispatch} />
        <DateTime dispatch={dispatch} />
        <VehicleAndClass dispatch={dispatch} />
        <RideForType dispatch={dispatch} />
        <Button size="md" mt={"6"} w="95%" mx={3} onPress={handleForm}>
          <Text fontSize={"lg"} color="white">
            Submit
          </Text>
        </Button>
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          Please enter {error.missingField} field.
        </FormControl.ErrorMessage>
      </FormControl>
    </View>
  );
};

export default CreateRide;
