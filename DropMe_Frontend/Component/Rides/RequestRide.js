import { View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Box, Text, Stack, Image, Button, ScrollView } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../Context";

const RequestRide = () => {
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  useEffect(() => {
    let mounted = true;
    const getUserRides = async () => {
      try {
        const User = await AsyncStorage.getItem("User");
        const userDetails = JSON.parse(User);
      } catch (error) {
        console.log("Rides Exception: ", error.response.data);
      }
    };

    getUserRides();

    return () => (mounted = false);
  }, []);

  const [tripRequestList, setTripRequest] = useState([
    {
      id: 1,
      name: "John Doe",
      profileImage: "https://wallpaperaccess.com/full/317501.jpg",
      source: "Pune",
      destination: "Mumbai",
      pickupPoint: "Shivajinagar",
      tripPrice: 32423,
      tripCapacity: 4,
    },
    {
      id: 3,
      name: "John Doe",
      profileImage: "https://wallpaperaccess.com/full/317501.jpg",
      source: "Pune",
      destination: "Mumbai",
      pickupPoint: "Shivajinagar",
      tripPrice: 32423,
      tripCapacity: 4,
    },
  ]);

  function getRequest() {
    return (
      <ScrollView>
        {tripRequestList.map((details) => (
          <Box key={details.id} my={5}>
            <Stack
              direction={"column"}
              alignItems="center"
              bg={"#F0F8FF"}
              space={2}
              borderRadius={10}
              p={5}
            >
              <Image
                source={{
                  uri: details.profileImage,
                }}
                alt="Alternate Text"
                size={"xl"}
                borderRadius={100}
                bg="red.100"
              />

              <Text fontSize={25} fontWeight="bold">
                {details.name}
              </Text>
              <Text fontSize={18} fontWeight="bold">
                <FontAwesome name="rupee" size={18} color="black" />-
                {details.tripPrice}
              </Text>
              <Text fontSize={18} fontWeight="bold">
                From: {details.source}
              </Text>
              <Text fontSize={18} fontWeight="bold" p={1}>
                To: {details.destination}
              </Text>
              <Text fontSize={18} fontWeight="bold" p={1}>
                Pickup Point: {details.pickupPoint}
              </Text>
              <Text fontSize={18} fontWeight="bold">
                Capacity: {details.tripCapacity}
              </Text>

              <Stack space={10} direction={"row"}>
                <Button borderRadius={10} onPress={() => alert("Accepted")}>
                  Accept
                </Button>
                <Button borderRadius={10} onPress={() => alert("Rejected")}>
                  Reject
                </Button>
              </Stack>
            </Stack>
          </Box>
        ))}
      </ScrollView>
    );
  }

  // useEffect(() => {
  //   async function loadNotification() {
  //     try {
  //       console.log("Hey ");

  //       let result = await axios.get(
  //         "http://192.168.43.180:3100/notification/getNotification",
  //         {
  //           headers: {
  //             "x-auth-token":
  //               "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsIlVzZXIiOiI2MjZmOWZkZTRiNDRiZDQ2NGM5NzgzZjEiLCJpYXQiOjE2NTIwODI1MTl9.flvvWDWGaB78rh2HEvV9lhuiLX6d2Ap99M5naritNE4",
  //           },
  //         }
  //       );
  //       setTripRequest(result.data);
  //       console.log("hii ");
  //       console.log("result:", result.data);
  //     } catch (ex) {
  //       console.log("Exception", ex.response.data);
  //     }
  //   }
  //   loadNotification();
  // }, []);

  return (
    <Box mt={2}>
      {tripRequestList.length ? getRequest() : <Text>No Request</Text>}
    </Box>
  );
};

export default RequestRide;
