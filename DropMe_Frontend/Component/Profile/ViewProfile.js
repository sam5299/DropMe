import { View, StyleSheet } from "react-native";
import React, { useEffect, useState, useContext } from "react";
import { Box, Stack, Text, Image } from "native-base";
import axios from "axios";
import { AuthContext } from "../Context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ViewProfile = () => {
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();
  const [userDetails, setUserDetails] = useState({
    name: "Aditya Bhosale",
    mobileNumber: "7507748880",
    gender: "Male",
    email: "bhosaleadi@gmail.com",
    rideCount: 36,
    averageRating: 3.9,
    riderImage:
      "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
  });

  useEffect(() => {
    let mounted = true;
    async function loadDetails() {
      try {
        const User = await AsyncStorage.getItem("User");
        const parseUser = JSON.parse(User);
        //console.log(parseUser.data);

        if (mounted) {
          setUserDetails(parseUser.data);
          // setToken(parseUser.userToken);
        }
      } catch (ex) {
        console.log("Exception in profile", ex.response.data);
      }
    }

    loadDetails();
    return () => (mounted = false);
  }, []);
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
                uri: "https://w7.pngwing.com/pngs/340/946/png-transparent-avatar-user-computer-icons-software-developer-avatar-child-face-heroes.png",
              }}
              alt="Image not available"
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
              <Text style={styles.details}>
                {userDetails.totalNumberOfRatedRides}
              </Text>
              <Text style={styles.details}>Total{"\n"}Rides</Text>
            </Box>

            <Box
              alignItems={"center"}
              justifyContent={"center"}
              bg={"white"}
              borderRadius={10}
            >
              <Text style={styles.details}>
                {userDetails.totalNumberOfRatedRides == 0
                  ? 0
                  : (
                      userDetails.sumOfRating /
                      userDetails.totalNumberOfRatedRides
                    ).toPrecision(2)}
              </Text>
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
