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
  ScrollView,
  Text,
  WarningOutlineIcon,
} from "native-base";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../Component/Context";
import { useValidation } from "react-native-form-validator";

const initialState = {
  source: "",
  destination: "",
  date: "",
  time: "",
  Vehicle: "",
  vehicleNumber: null,
  availableSeats: "1",
  rideFor: "Both",
  rideType: "Paid",
  distance: 50,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "source":
      let sourceLower = action.payload.toLowerCase();
      return {
        ...state,
        source: sourceLower,
      };
    case "destination":
      let destinationLower = action.payload.toLowerCase();
      return {
        ...state,
        destination: destinationLower,
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
    case "Vehicle":
      return {
        ...state,
        Vehicle: action.payload,
      };
    case "vehicleNumber":
      return {
        ...state,
        vehicleNumber: action.payload,
      };
    case "availableSeats":
      return {
        ...state,
        availableSeats: action.payload,
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
      return {
        source: "",
        destination: "",
        date: "",
        time: "",
        Vehicle: "",
        vehicleNumber: null,
        availableSeats: "1",
        rideFor: "Both",
        rideType: "Paid",
        distance: 50,
      };
  }
};

const CreateRide = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [gender, setGender] = useState("");
  const [userToken, setToken] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const { source, destination, date, time, Vehicle } = state;
  const { validate, isFieldInError } = useValidation({
    state: { source, destination, date, time, Vehicle },
  });

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  useEffect(() => {
    let mounted = true;
    const createRide = async () => {
      try {
        const User = await AsyncStorage.getItem("User");
        const userDetails = JSON.parse(User);
        if (mounted) {
          setToken(userDetails.userToken);
          setGender(userDetails.data.gender);
        }
      } catch (error) {
        console.log(error.response.data);
      }
    };
    createRide();
    return () => (mounted = false);
  }, []);

  const handleForm = async () => {
    setLoading(true);
    let isTrue = validate({
      source: { required: true },
      destination: { required: true },
      date: { required: true },
      time: { required: true },
      Vehicle: { required: true },
    });
    if (isTrue) {
      console.log(state);
      try {
        const result = await axios.post(
          url + "/ride/createRide",
          { ...state },
          { headers: { "x-auth-token": userToken } }
        );
        console.log(result.headers);
        Alert.alert("Success", "Ride Created...!");
        dispatch({});
      } catch (error) {
        console.log(error.response.data);
      }
    }
    setLoading(false);
  };

  return (
    <Box flex={1} bg={"#f5f5f5"} flexDirection="column">
      <GoogleMap />
      <ScrollView>
        <FormControl>
          <SourceDestination dispatch={dispatch} />
          <Box flexDirection={"row"} justifyContent="space-around">
            {isFieldInError("source") && (
              <FormControl.ErrorMessage
                isInvalid={true}
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                Please enter source field
              </FormControl.ErrorMessage>
            )}
            {isFieldInError("destination") && (
              <FormControl.ErrorMessage
                isInvalid={true}
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                Please enter destination field
              </FormControl.ErrorMessage>
            )}
          </Box>
          <DateTime dispatch={dispatch} />
          <Box flexDirection={"row"} justifyContent="space-around">
            {isFieldInError("date") && (
              <FormControl.ErrorMessage
                isInvalid={true}
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                Please enter date
              </FormControl.ErrorMessage>
            )}
            {isFieldInError("time") && (
              <FormControl.ErrorMessage
                isInvalid={true}
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                Please enter time
              </FormControl.ErrorMessage>
            )}
          </Box>
          <VehicleAndClass dispatch={dispatch} />
          <Box ml={5}>
            {isFieldInError("Vehicle") && (
              <FormControl.ErrorMessage
                isInvalid={true}
                leftIcon={<WarningOutlineIcon size="xs" />}
              >
                Please select vehicle
              </FormControl.ErrorMessage>
            )}
          </Box>
          <RideForType type={{ dispatch: dispatch, rideFor: gender }} />
          <Button
            isLoading={isLoading}
            isLoadingText="Submitting"
            size="md"
            mt={"5"}
            w="95%"
            ml={2}
            onPress={handleForm}
          >
            <Text fontSize={"lg"} color="white">
              Create Ride
            </Text>
          </Button>
        </FormControl>
      </ScrollView>
    </Box>
  );
};

export default CreateRide;
