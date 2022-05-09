import { View, StyleSheet } from "react-native";
import React from "react";
import { Box, Stack, Text, Image } from "native-base";

const ViewProfile = () => {
  const userDetails = {
    name: "Aditya Bhosale",
    mobileNumber: "7507748880",
    gender: "Male",
    email: "bhosaleadi@gmail.com",
    rideCount: 36,
    averageRating: 3.9,
    riderImage:
      "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.Vzahyi5u3exbb73RDnoYJgHaLH%26pid%3DApi&f=1",
  };
  return (
    <Box flex={1} bg={"#F0F8FF"} justifyContent="center">
      <Box
        alignItems={"center"}
        m="5"
        p="2"
        borderColor="coolGray.200"
        borderRadius={10}
        borderWidth="1"
        _dark={{
          borderColor: "coolGray.600",
          backgroundColor: "gray.700",
        }}
        _web={{
          shadow: 2,
          borderWidth: 0,
        }}
        _light={{
          backgroundColor: "gray.50",
        }}
      >
        <Stack direction={"column"} space={5}>
          <Stack justifyContent={"center"} alignItems={"center"} space={3}>
            <Image
              source={{
                uri: userDetails.riderImage,
              }}
              alt="Alternate Text"
              borderRadius={100}
              size={"xl"}
            />
            <Text style={styles.details}>{userDetails.name}</Text>
            <Text style={styles.details}>{userDetails.mobileNumber}</Text>
            <Text style={styles.details}>{userDetails.email}</Text>
            {/* <Text style={styles.details}>{userDetails.gender}</Text> */}
          </Stack>
          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
          >
            <Box
              alignItems={"center"}
              justifyContent={"center"}
              bg={"white"}
              borderRadius={10}
            >
              <Text style={styles.details}>{userDetails.rideCount}</Text>
              <Text style={styles.details}>Total{"\n"}Rides</Text>
            </Box>

            <Box
              alignItems={"center"}
              justifyContent={"center"}
              bg={"white"}
              borderRadius={10}
            >
              <Text style={styles.details}>{userDetails.averageRating}</Text>
              <Text style={styles.details}>Average{"\n"} Rating</Text>
            </Box>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default ViewProfile;

const styles = StyleSheet.create({
  details: {
    fontSize: 15,
    fontWeight: "bold",
    margin: 3,
  },
});
