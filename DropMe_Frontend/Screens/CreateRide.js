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
  s_lat: null,
  s_lon: null,
  destination: "",
  d_lat: null,
  d_lon: null,
  date: "",
  time: "",
  Vehicle: "",
  vehicleNumber: null,
  availableSeats: "1",
  rideFor: "Both",
  rideType: "Paid",
  distance: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case "source":
      let sourceLower = action.payload.toLowerCase();
      return {
        ...state,
        source: sourceLower,
      };
    case "s_lat":
      return {
        ...state,
        s_lat: action.payload,
      };
    case "s_lon":
      return {
        ...state,
        s_lon: action.payload,
      };
    case "destination":
      let destinationLower = action.payload.toLowerCase();
      return {
        ...state,
        destination: destinationLower,
      };
    case "d_lat":
      return {
        ...state,
        d_lat: action.payload,
      };
    case "d_lon":
      return {
        ...state,
        d_lon: action.payload,
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
    case "distance":
      return {
        ...state,
        distance: action.payload,
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
        distance: null,
      };
  }
};

const CreateRide = ({ navigation }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [gender, setGender] = useState("");
  const [userToken, setToken] = useState(null);
  const [isLoading, setLoading] = useState(false);

  const { source, destination, date, time, Vehicle } = state;
  const { validate, isFieldInError } = useValidation({
    state: { source, destination, date, time, Vehicle },
  });

  const [isRerender, setIsRerender] = useState(false);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  useEffect(() => {
    let mounted = true;
    //console.log("rendered");
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
  }, [isRerender]);

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
        //call api to get exact latitude longitude of source,destination lat,log
        try {
          const result = await axios.get(
            `${url}/map/api/reverseCoding/${state.s_lat}/${state.s_lon}`
          );
          const result2 = await axios.get(
            `${url}/map/api/reverseCoding/${state.d_lat}/${state.d_lon}`
          );

          //call direction api and send lon1,lat1;lon2,lat2
          let newResult = await axios.get(
            `${url}/map/api/directionApi/${state.s_lon}/${state.s_lat}/${state.d_lon}/${state.d_lat}`
          );
          console.log("185" + typeof newResult.data);
          state.distance = newResult.data;
          dispatch({ type: "distance", payload: newResult.data });
        } catch (error) {
          console.log("exception is here..");
          console.log(error.response.data);
        }
        //state.distance = parseFloat(state.distance);
        const result = await axios.post(
          url + "/ride/createRide",
          { ...state },
          { headers: { "x-auth-token": userToken } }
        );

        Alert.alert("Success", "Ride Created...!");
      } catch (error) {
        console.log("Create Ride:", error.response.data);
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
