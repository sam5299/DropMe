import { Alert, View } from "react-native";
import React, { useEffect, useReducer, useState } from "react";
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
} from "native-base";

const initialState = {
  source: "",
  destination: "",
  date: "",
  time: "",
  pickupPoint: "",
  seatRequest: "1",
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
    case "pickupPoint":
      return {
        ...state,
        pickupPoint: action.payload,
      };
    case "seatRequest":
      return {
        ...state,
        seatRequest: action.payload,
      };
    default:
      return state;
  }
};

const BookRide = () => {
  const [error, setError] = useState({ isTrue: false, field: "" });
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleForm = () => {
    for (const key in state) {
      if (state[key] === "") {
        const k = key.toString();
        setError({ isTrue: true, field: k });
        setTimeout(() => {
          setError({ isTrue: false, field: "" });
        }, 4000);
        return;
      }
    }
    Alert.alert("Success", "Ride Booked...!");
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
      <FormControl isInvalid={error.isTrue}>
        <SourceDestination dispatch={dispatch} />
        <DateTime dispatch={dispatch} />
        <PickupPoint dispatch={dispatch} />
        <Box mt={5} alignItems={"center"}>
          <Text textAlign="center">Select Seats: {state.seatRequest}</Text>
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
            onChange={(v) => dispatch({ type: "seatRequest", payload: v })}
          >
            <Slider.Track>
              <Slider.FilledTrack />
            </Slider.Track>
            <Slider.Thumb />
          </Slider>
        </Box>
        <Button size="md" mt="5%" w="95%" mx={3} onPress={handleForm}>
          <Text fontSize={"lg"} color="white">
            Submit
          </Text>
        </Button>
        <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
          Please enter {error.field} field.
        </FormControl.ErrorMessage>
      </FormControl>
    </View>
  );
};

export default BookRide;
