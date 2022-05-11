import { View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Box, Stack, Text, Image, Button, ScrollView } from "native-base";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "../Component/Context";

const AvailableRides = ({ route, navigation }) => {
  const { source, destination, date, time, seatRequest, gender, token } =
    route.params;

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  useEffect(() => {
    let monted = true;
    const availableRides = async () => {
      try {
        const rides = await axios.get(
          url + "/ride/getRides",
          {
            source,
            destination,
            date,
            time,
            seatRequest,
            gender,
          },
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
      } catch (error) {
        console.log("AvailableRides: ", error.response.data);
      }
    };
  });

  const [RideDetails, setRideDetails] = useState([
    {
      id: 1,
      riderImage: "https://wallpaperaccess.com/full/317501.jpg",
      riderName: "John Doe",
      rating: 3.5,
      vehicleImage: "https://wallpaperaccess.com/full/317501.jpg",
      rideType: "Paid",
      vehicleNumber: "MH 14 JS 3407",
    },
    {
      id: 2,
      riderImage: "https://wallpaperaccess.com/full/317501.jpg",
      riderName: "John Doe",
      rating: 3.5,
      vehicleImage: "https://wallpaperaccess.com/full/317501.jpg",
      rideType: "Free",
      vehicleNumber: "MH 14 JS 3407",
    },
    {
      id: 3,
      riderImage: "https://wallpaperaccess.com/full/317501.jpg",
      riderName: "John Doe",
      rating: 3.5,
      vehicleImage: "https://wallpaperaccess.com/full/317501.jpg",
      rideType: "Free",
      vehicleNumber: "MH 14 JS 3407",
    },
  ]);
  function getRides() {
    return (
      <ScrollView bg={"#F0F8FF"}>
        {RideDetails.map((ride) => (
          <Box
            key={ride.id}
            m={5}
            borderRadius={10}
            display="flex"
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
            w="90%"
            borderColor="coolGray.200"
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
            <Stack
              direction={"column"}
              m={2}
              alignItems={"center"}
              space={5}
              mt={5}
            >
              <Box
                display={"flex"}
                flexDirection={"row"}
                alignItems={"center"}
                w="100%"
                justifyContent={"space-evenly"}
              >
                <Image
                  source={{
                    uri: ride.riderImage,
                  }}
                  alt="Alternate Text"
                  size={"sm"}
                  borderRadius={100}
                />
                <Text fontWeight={"bold"} color={"black"} fontSize={18}>
                  {ride.riderName}
                </Text>
                <Stack direction={"column"}>
                  <Entypo name="star" size={20} color="black" />
                  <Text fontWeight={"bold"} color={"black"} fontSize={15}>
                    {ride.rating}
                  </Text>
                </Stack>
              </Box>
              <Image
                source={{
                  uri: ride.vehicleImage,
                }}
                alt="Alternate Text"
                size={"md"}
                borderRadius={100}
              />
              <Text fontWeight={"bold"} color={"black"} fontSize={18}>
                {ride.vehicleNumber}
              </Text>
              <Text fontWeight={"bold"} color={"black"} fontSize={18}>
                {ride.rideType} Ride
              </Text>
              <Button size={"md"} px="10">
                Send Request
              </Button>
            </Stack>
          </Box>
        ))}
      </ScrollView>
    );
  }

  // useEffect(() => {
  //   async function loadRides() {
  //     try {
  //       let rideList = await axios.get("", {
  //         headers: {
  //           "x-auth-token": "",
  //         },
  //       });
  //       setRideDetails(rideList.data)
  //     } catch (ex) {
  //       console.log("Exception " + ex);
  //     }
  //   }

  //   loadRides();
  // }, []);

  return <>{RideDetails.length ? getRides() : <Text>No Request found</Text>}</>;
};

export default AvailableRides;
