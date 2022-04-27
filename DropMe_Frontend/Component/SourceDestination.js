import { View, Text, Button } from "react-native";
import React from "react";
import { Input, Box } from "native-base";

const SourceDestination = () => {
  return (
    <Box flexDirection="row" mr="12">
      <Input mx="3" placeholder="Source" w="50%" />
      <Input mx="3" placeholder="Destination" w="50%" />
    </Box>
  );
};

export default SourceDestination;
