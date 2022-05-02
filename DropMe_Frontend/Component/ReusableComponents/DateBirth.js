import { View, Text } from "react-native";
import React from "react";

const DateBirth = () => {
  return (
    <View>
      <Button
        w="95%"
        variant="outline"
        leftIcon={
          <Icon
            as={<MaterialCommunityIcons name="calendar-arrow-left" />}
            size={6}
            color="rgba(6,182,212,1.00)"
            mx={"1"}
          />
        }
      >
        <Text color={"gray.400"} mr="40">
          Date Of Birth
        </Text>
      </Button>
    </View>
  );
};

export default DateBirth;
