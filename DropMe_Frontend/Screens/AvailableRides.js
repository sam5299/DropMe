import { Alert, View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Box, Stack, Text, Image, Button, ScrollView } from "native-base";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "../Component/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AvailableRides = ({ route, navigation }) => {
  const [RideDetails, setRideDetails] = useState([]);

  const { source, destination, date, time, gender, seats, token, pickupPoint } =
    route.params;
  const { getUrl } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(false);
  const url = getUrl();

  useEffect(() => {
    let mounted = true;
    const availableRides = async () => {
      try {
        const rides = await axios.get(
          `${url}/ride/getRides/${source}/${destination}/${date}/${time}/${seats}/${gender}`,
          {
            headers: { "x-auth-token": token },
          }
        );
        //console.log(rides.data);
        setRideDetails(rides.data);
      } catch (error) {
        console.log("AvailableRides: ", error.response.data);
      }
    };
    availableRides();
    return () => (mounted = false);
  }, []);

  const sendRequest = async (ride) => {
    const tripDetails = { source, destination, date, time, pickupPoint };
    tripDetails["seatRequest"] = seats;
    tripDetails["User"] = ride.User._id;
    tripDetails["distance"] = ride.distance;
    tripDetails["amount"] = parseInt(ride.amount * seats);
    tripDetails["rideId"] = ride._id;

    console.log("Trip: ", tripDetails);
    setLoading(true);
    try {
      const result = await axios.post(url + "/trip/requestRide", tripDetails, {
        headers: {
          "x-auth-token": token,
        },
      });
      console.log("done");
      alert(
        `Request has been sent to rider.\nYou will receive notification once rider accept/reject your request.`
      );
      setLoading(false);
    } catch (error) {
      console.log("Request to ride: ", error.response.data);
      alert(" Please Add credits point to wallet");
      setLoading(false);
    }
  };

  function getRides() {
    return (
      <ScrollView bg={"#F0F8FF"}>
        {RideDetails.map((ride) => (
          <Box
            key={ride._id}
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
                borderRadius={2}
                //borderColor="rgba(6,182,212,1.00)"
                borderColor="black"
              >
                <Image
                  source={{
                    uri: ride.User.profile,
                  }}
                  alt="noimage"
                  size={"sm"}
                  borderRadius={100}
                />
                <Text fontWeight={"bold"} color={"black"} fontSize={18}>
                  {ride.User.name}
                </Text>
                <Stack direction={"column"}>
                  <Entypo name="star" size={20} color="black" />
                  <Text fontWeight={"bold"} color={"black"} fontSize={15}>
                    {ride.User.totalNumberOfRatedRides == 0
                      ? 0.0
                      : (
                          ride.User.sumOfRating /
                          ride.User.totalNumberOfRatedRides
                        ).toPrecision(2)}
                  </Text>
                </Stack>
              </Box>
              <Image
                source={{
                  uri: ride.Vehicle.vehicleImage,
                }}
                alt="Image not found"
                size={"md"}
                borderRadius={100}
              />
              <Text fontWeight={"bold"} color={"black"} fontSize={18}>
                {ride.Vehicle.vehicleNumber}
              </Text>
              <Text fontWeight={"bold"} color={"black"} fontSize={18}>
                Rs.{ride.amount == 0 ? "Free" : ride.amount}
              </Text>
              {/* <Button size={"md"} px="10" onPress={() => sendRequest(ride)}>
                Send Request
              </Button> */}
              <Button
                isLoading={isLoading}
                isLoadingText="Sending request.."
                //size="md"
                px="10"
                mt={"5"}
                //w="90%"
                ml={2}
                onPress={() => sendRequest(ride)}
              >
                <Text fontSize={"lg"} color="white">
                  Send Request
                </Text>
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
