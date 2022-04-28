import { View, Text } from "react-native";
import React, { useState } from "react";
import { Box, Select } from "native-base";

const RideForType = ({ dispatch }) => {
  const [rideFor, setRideFor] = useState("");
  const [rideType, setRideType] = useState("");

  return (
    <Box
      flexDirection="row"
      justifyContent={"space-between"}
      mr="2"
      mt={5}
      ml={3}
    >
      <Select
        selectedValue={rideFor}
        w="175"
        accessibilityLabel="Ride For"
        placeholder="Ride For"
        onValueChange={(itemValue) => {
          setRideFor(itemValue);
          dispatch({ type: "rideFor", payload: itemValue });
        }}
      >
        <Select.Item shadow={2} label="Ride For" disabled={true} />
        <Select.Item shadow={2} label="Male" value="1" />
        <Select.Item shadow={2} label="Female" value="2" />
        <Select.Item shadow={2} label="Both" value="3" />
      </Select>
      <Select
        selectedValue={rideType}
        w="175"
        accessibilityLabel="Ride Type"
        placeholder="Ride Type"
        onValueChange={(itemValue) => {
          setRideType(itemValue);
          dispatch({ type: "rideType", payload: itemValue });
        }}
      >
        <Select.Item shadow={2} label="Ride Type" disabled={true} />
        <Select.Item shadow={2} label="Free" value="1" />
        <Select.Item shadow={2} label="Paid" value="2" />
      </Select>
    </Box>
  );
};

export default RideForType;
