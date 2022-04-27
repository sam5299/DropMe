import { View, Text } from "react-native";
import React from "react";
import { Box } from "native-base";
import Vehicle from "./Vehicle";
import VehicleClass from "./VehicleClass";

const VehicleAndClass = () => {
  return (
    <Box flexDirection="row" mt={5} ml={3} justifyContent="space-between">
      <Vehicle />
      <VehicleClass />
    </Box>
  );
};

export default VehicleAndClass;
