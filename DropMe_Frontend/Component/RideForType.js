import { View } from "react-native";
import React from "react";
import { Box, Radio, Stack, Checkbox } from "native-base";

const RideForType = ({ dispatch }) => {
  const selectType = (value) => {
    if (value == true) {
      dispatch({ type: "rideFor", payload: "Male" });
    } else {
      dispatch({ type: "rideFor", payload: "Both" });
    }
  };

  return (
    <Box
      flexDirection="row"
      justifyContent={"space-between"}
      mr="2"
      mt={5}
      ml={3}
    >
      <Checkbox
        accessibilityLabel="Ride For"
        onChange={(value) => selectType(value)}
      >
        Only For Male
      </Checkbox>
      <Radio.Group
        name="Ride Type"
        defaultValue="Paid"
        accessibilityLabel="Ride Type"
        onChange={(value) => dispatch({ type: "rideType", payload: value })}
      >
        <Stack
          direction={{
            base: "row",
            md: "column ",
          }}
          mr="2"
          space={3}
          maxW="300px"
        >
          <Radio value="Paid" size="md">
            Paid
          </Radio>
          <Radio value="Free" size="md">
            Free
          </Radio>
        </Stack>
      </Radio.Group>
    </Box>
  );
};

export default RideForType;
