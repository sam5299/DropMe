import { Alert, View } from "react-native";
import React, { useContext, useEffect, useReducer, useState } from "react";
import SourceDestination from "../Component/SourceDestination";
import GoogleMap from "../Component/GoogleMap";
import DateTime from "../Component/DateTime";
import VehicleAndClass from "../Component/VehicleAndClass";
import RideForType from "../Component/RideForType";
import {
  Box,
  Button,
  FormControl,
  Text,
  WarningOutlineIcon,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../Component/Context";

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
  const [state, dispatch] = useReducer(reducer, initialState);
  const [error, setError] = useState({ isError: false, missingField: "" });
  const [gender, setGender] = useState("");

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  useEffect(async () => {
    try {
      const userToken = await AsyncStorage.getItem("userToken");

      const result = await axios.get(url + "/user/getUser", {
        headers: { "x-auth-token": userToken },
      });
      setGender(result.data.gender);
    } catch (error) {
      console.log(error.response.data);
    }
  }, []);

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
    <Box flex={1} bg={"#f5f5f5"} flexDirection="column">
      <GoogleMap />
      <FormControl isInvalid={error.isError}>
        <SourceDestination dispatch={dispatch} />
        <DateTime dispatch={dispatch} />
        <VehicleAndClass dispatch={dispatch} />
        <RideForType type={{ dispatch: dispatch, rideFor: gender }} />
        <Button size="md" mt={"5"} w="95%" ml={2} onPress={handleForm}>
          <Text fontSize={"lg"} color="white">
            Submit
          </Text>
        </Button>
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          Please enter {error.missingField} field.
        </FormControl.ErrorMessage>
      </FormControl>
    </Box>
  );
};

export default CreateRide;
