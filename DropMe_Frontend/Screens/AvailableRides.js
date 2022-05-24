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
  Spinner,
  useToast,
} from "native-base";
import { Entypo } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "../Component/Context";

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

  const toast = useToast();

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
        if (mounted) {
          setRideDetails(rides.data);
        }
        // let tempObj = [];
        // RideDetails.forEach((ride) => {
        //   console.log(ride._id);
        // });
        setLoading(false);
      } catch (error) {
        console.log("Exception in AvailableRides: ", error.response.data);
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

      toast.show({
        render: () => {
          return (
            <Box bg="green.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>
                Request has been sent to rider.You will receive notification
                once rider accept/reject your request.
              </Text>
            </Box>
          );
        },
        placement: "top",
      });

      let newResult = [];
      RideDetails.forEach((ride) => {
        if (ride._id != tripDetails.rideId) {
          newResult.push(ride);
        }
      });
      setRideDetails(newResult);

      // console.log("done");
    } catch (error) {
      toast.show({
        render: () => {
          return (
            <Box bg="red.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>{error.response.data}</Text>
            </Box>
          );
        },
        placement: "top",
      });
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
                  alt="no image"
                  size={"md"}
                  borderRadius={100}
                />
                <Text fontWeight={"bold"} color={"black"} fontSize={18}>
                  {ride.User.name}
                </Text>
                <Stack direction={"column"}>
                  <Entypo name="star" size={20} color="#FF9529" />
                  <Text fontWeight={"bold"} color={"black"} fontSize={15}>
                    {ride.User.totalNumberOfRatedRides == 0
                      ? "0.0"
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
                size={"xl"}
                borderRadius={50}
              />
              <Text fontWeight={"bold"} color={"black"} fontSize={18}>
                {ride.Vehicle.vehicleName}
              </Text>
              <Text fontWeight={"bold"} color={"black"} fontSize={18}>
                {ride.Vehicle.vehicleClass}
              </Text>

              {ride.amount > 0 ? (
                <Text fontSize={18} fontWeight="bold">
                  <FontAwesome name="rupee" size={18} color="black" />
                  Rs.{ride.amount * seats}
                </Text>
              ) : (
                <Text fontSize={18} fontWeight="bold" color={"green.500"}>
                  Free
                </Text>
              )}

              {/* <Button size={"md"} px="10" onPress={() => sendRequest(ride)}>
                Send Request
              </Button> */}
              <Button
                px="10"
                mt={"2"}
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
        <Spinner size="lg" />
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
