import { View, Text, Button } from "react-native";
import React from "react";
import { Input, Box } from "native-base";

const SourceDestination = ({ dispatch }) => {
  return (
    <Box flexDirection="row" mr="10">
      <Input
        mx="3"
        placeholder="Source"
        w="50%"
        onChangeText={(event) => dispatch({ type: "source", payload: event })}
      />
      <Input
        mx="3"
        placeholder="Destination"
        w="50%"
        onChangeText={(event) =>
          dispatch({ type: "destination", payload: event })
        }
      />
    </Box>
  );
};

export default SourceDestination;
