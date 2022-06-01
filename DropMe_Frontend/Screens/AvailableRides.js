import React, { useState, useEffect, useContext } from "react";
import {
  Box,
  Stack,
  Text,
  Image,
  Button,
  ScrollView,
  Spinner,
  useToast,
} from "native-base";
import { Entypo, FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import { AuthContext } from "../Component/Context";

const AvailableRides = ({ route, navigation }) => {
  const [RideDetails, setRideDetails] = useState([]);

  const { source, destination, date, time, gender, seats, token, pickupPoint } =
    route.params;
  const { getUrl } = useContext(AuthContext);

  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const [isLoading, setLoading] = useState(true);
  const url = getUrl();

  const toast = useToast();

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

        if (mounted) {
          setRideDetails(rides.data);
          setLoading(false);
        }
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
    tripDetails["notificationToken"] = ride.User.notificationToken;
    try {
      setIsButtonDisabled(true);
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
      setIsButtonDisabled(false);
    } catch (error) {
      setIsButtonDisabled(false);
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
                borderRadius={10}
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
                  {ride.amount * seats}
                </Text>
              ) : (
                <Text fontSize={18} fontWeight="bold" color={"green.500"}>
                  Free
                </Text>
              )}
              <Button px="10" mt={"2"} ml={2} isDisabled={isButtonDisabled} onPress={() => sendRequest(ride)}>
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
            <Text>No Rides Found</Text>
          </Box>
        )}
      </>
    );
  }
};

export default AvailableRides;
