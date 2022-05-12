import { Alert, View } from "react-native";
import React, { useContext, useEffect, useReducer, useState } from "react";
import SourceDestination from "../Component/SourceDestination";
import GoogleMap from "../Component/GoogleMap";
import DateTime from "../Component/DateTime";
import PickupPoint from "../Component/BookRide/PickupPoint";
import {
  Button,
  FormControl,
  Text,
  Slider,
  Box,
  WarningOutlineIcon,
  ScrollView,
} from "native-base";
import { useValidation } from "react-native-form-validator";
import { AuthContext } from "../Component/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const initialState = {
  source: "",
  s_lat: null,
  s_lon: null,
  destination: "",
  d_lat: null,
  d_lon: null,
  date: "",
  time: "",
  pickupPoint: "",
  seats: "1",
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
    case "pickupPoint":
      return {
        ...state,
        pickupPoint: action.payload,
      };
    case "seats":
      return {
        ...state,
        seats: action.payload,
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
        pickupPoint: "",
        seats: "1",
        distance: null,
      };
  }
};

const BookRide = ({ navigation }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [gender, setGender] = useState("");
  const [token, setToken] = useState("");

  const { source, destination, date, time, pickupPoint } = state;
  const { validate, isFieldInError } = useValidation({
    state: { source, destination, date, time, pickupPoint },
  });

  useEffect(() => {
    let mounted = true;
    const bookRide = async () => {
      try {
        const User = await AsyncStorage.getItem("User");
        const userDetails = JSON.parse(User);
        if (mounted) {
          setGender(userDetails.data.gender);
          setToken(userDetails.userToken);
        }
      } catch (error) {
        console.log("BookRide: ", error.response.data);
      }
    };
    bookRide();
    return () => (mounted = false);
  });

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  const handleForm = async () => {
    let isTrue = validate({
      source: { required: true },
      destination: { required: true },
      date: { required: true },
      time: { required: true },
      pickupPoint: { required: true },
    });
    if (isTrue) {
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
        //console.log("distance:" + parseFloat(newResult.data));
        dispatch({ type: "distance", payload: newResult.data });
        console.log(state);
      } catch (error) {
        console.log("exception Book Ride");
        console.log(error);
      }

      navigation.navigate("Available Rides", { ...state, gender, token });
    }
  };

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "#f5f5f5",
        height: "100%",
        flexDirection: "column",
      }}
    >
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
          <PickupPoint dispatch={dispatch} />
          {isFieldInError("pickupPoint") && (
            <FormControl.ErrorMessage
              isInvalid={true}
              leftIcon={<WarningOutlineIcon size="xs" />}
            >
              Please enter Pickup Point
            </FormControl.ErrorMessage>
          )}
          <Box mt={5} alignItems={"center"}>
            <Text textAlign="center">Select Seats: {state.seats}</Text>
            <Slider
              isDisabled={false}
              mt={"2"}
              w="300"
              maxW="300"
              defaultValue={1}
              minValue={1}
              maxValue={8}
              accessibilityLabel="Available Seats"
              step={1}
              onChange={(v) => dispatch({ type: "seats", payload: v })}
            >
              <Slider.Track>
                <Slider.FilledTrack />
              </Slider.Track>
              <Slider.Thumb />
            </Slider>
          </Box>
          <Button size="md" mt="5%" w="95%" mx={3} onPress={handleForm}>
            <Text fontSize={"lg"} color="white">
              Search Rides
            </Text>
          </Button>
        </FormControl>
      </ScrollView>
    </View>
  );
};

export default BookRide;
