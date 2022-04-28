import { Alert, View } from "react-native";
import React, { useEffect, useReducer } from "react";
import SourceDestination from "../Component/SourceDestination";
import GoogleMap from "../Component/GoogleMap";
import DateTime from "../Component/DateTime";
import PickupPoint from "../Component/BookRide/PickupPoint";
import { Button, FormControl, Text } from "native-base";

const initialState = {
  source: "",
  destination: "",
  date: "",
  time: "",
  pickupPoint: "",
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
    default:
      return state;
  }
};

const BookRide = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleForm = () => {
    for (const key in state) {
      if (state[key] === "") {
        const k = key.toString();
        Alert.alert("Error", `"${k}" field is missing`);
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
      <FormControl>
        <SourceDestination dispatch={dispatch} />
        <DateTime dispatch={dispatch} />
        <PickupPoint dispatch={dispatch} />
        <Button size="md" mt="40%" w="95%" mx={3} onPress={handleForm}>
          <Text fontSize={"lg"} color="white">
            Submit
          </Text>
        </Button>
      </FormControl>
    </View>
  );
};

export default BookRide;
