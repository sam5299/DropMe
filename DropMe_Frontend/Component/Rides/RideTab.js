import { View, Text } from "react-native";
import React from "react";
import { Box, Button, Stack } from "native-base";

const RideTab = ({ navigation }) => {
  return (
    <Box flex={1} justifyContent={"center"}>
      <Stack flexDirection="column" alignItems={"center"} space="5">
        <Button w={"70%"} onPress={() => navigation.navigate("Rides")}>
          Rides
        </Button>
        <Button w={"70%"}>View Request</Button>
      </Stack>
    </Box>
  );
};

export default RideTab;
