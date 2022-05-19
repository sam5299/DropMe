import { View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Stack,
  Text,
  Image,
  Button,
  ScrollView,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
  Alert,
} from "native-base";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "../Component/Context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RideForType from "../Component/RideForType";

const AvailableRides = ({ route, navigation }) => {
  const [RideDetails, setRideDetails] = useState([]);

  const { source, destination, date, time, gender, seats, token, pickupPoint } =
    route.params;
  const { getUrl } = useContext(AuthContext);
  const [isLoading, setLoading] = useState(true);
  const url = getUrl();

  const [isSentRequest, setIsSetRequest] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertField, setAlertField] = useState({
    status: "success",
    title: "",
  });

  let AlertField = (
    <Alert w="100%" status={alertField.status}>
      <VStack space={2} flexShrink={1} w="100%">
        <HStack flexShrink={1} space={2} justifyContent="space-between">
          <HStack space={2} flexShrink={1}>
            <Alert.Icon mt="1" />
            <Text fontSize="md" color="coolGray.800">
              {alertField.title}
            </Text>
          </HStack>
          <IconButton
            variant="unstyled"
            _focus={{
              borderWidth: 0,
            }}
            icon={<CloseIcon size="3" color="coolGray.600" />}
          />
        </HStack>
      </VStack>
    </Alert>
  );

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
        //console.log("ride data:", rides.data);
        setRideDetails(rides.data);
        let tempObj = [];
        RideDetails.forEach((ride) => {
          console.log(ride._id);
        });
        setLoading(false);
      } catch (error) {
        console.log("AvailableRides: ", error.response.data);
        setLoading(false);
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

    // console.log("Trip: ", tripDetails);
    try {
      const result = await axios.post(url + "/trip/requestRide", tripDetails, {
        headers: {
          "x-auth-token": token,
        },
      });

      let newResult = [];
      RideDetails.forEach((ride) => {
        if (ride._id != tripDetails.rideId) {
          newResult.push(ride);
        }
      });

      // console.log("done");
      setAlertField({
        status: "success",
        title: `Request has been sent to rider.\nYou will receive notification once rider \n accept/reject your request.`,
      });
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setRideDetails(newResult);
      }, 3000);
    } catch (error) {
      setAlertField({
        status: "error",
        title: error.response.data,
      });
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        setIsSetRequest(false);
      }, 3000);
      console.log("Request to ride: ", error.response.data);
    }
  };

  function getRides() {
    return (
      <ScrollView bg={"#F0F8FF"}>
        {showAlert ? AlertField : null}
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
                Rs.{ride.amount == 0 ? "Free" : ride.amount*seats}
              </Text>
              {/* <Button size={"md"} px="10" onPress={() => sendRequest(ride)}>
                Send Request
              </Button> */}
              <Button
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

  if (isLoading) {
    return (
      <Box flex={1} justifyContent="center" alignItems={"center"}>
        <Text>Loading...!</Text>
      </Box>
    );
  } else {
    return (
      <>
        {RideDetails.length ? (
          getRides()
        ) : (
          <Box flex={1} justifyContent="center" alignItems={"center"}>
            <Text>No Rides found</Text>
          </Box>
        )}
      </>
    );
  }
};

export default AvailableRides;
