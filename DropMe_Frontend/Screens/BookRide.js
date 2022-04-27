import { View, Text } from "react-native";
import React from "react";
import SourceDestination from "../Component/SourceDestination";
import GoogleMap from "../Component/GoogleMap";
import DateTime from "../Component/DateTime";
import VehicleAndClass from "../Component/VehicleAndClass";

const BookRide = () => {
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
      <SourceDestination />
      <DateTime />
      <VehicleAndClass />
    </View>
  );
};

export default BookRide;
