import React, { useState, useEffect, useContext } from "react";
import { Alert as NewAlert } from "react-native";
import {
  Box,
  Text,
  Stack,
  Image,
  Button,
  ScrollView,
  Spinner,
  useToast,
} from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../Context";
import { useIsFocused } from "@react-navigation/native";

const RequestRides = ({ navigation }) => {
  const [allRides, setUserRides] = useState([]);
  const [showRides, setShowRides] = useState(true);
  const [token, setToken] = useState(null);
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  const toast = useToast();
  const isFocused = useIsFocused();

  const showConfirmDialog = async (rideId, amount) => {
    let message = "";
    try {
      const isBooked = await axios.get(url + `/ride/checkIsBooked/${rideId}`, {
        headers: {
          "x-auth-token": token,
        },
      });
      if (isBooked.data)
        message = `Canceling a ride will reduce your safety points by ${parseInt(
          amount * 0.1
        )}.\nDo you want to cancel the ride?`;
      else message = "Do you want to cancel the ride?";
    } catch (error) {
      console.log("Check is booked ride Exception: ", error.response.data);
      setShowRides(false);
    }

    return NewAlert.alert("Are your sure?", message, [
      // The "Yes" button
      {
        text: "Yes",
        onPress: () => {
          cancelRide(rideId);
        },
      },
      // The "No" button
      // Does nothing but dismiss the dialog when tapped
      {
        text: "No",
      },
    ]);
  };

  async function cancelRide(rideId) {
    alert(token);
    try {
      const cancelRide = await axios.put(
        url + `/ride/cancelRide/${rideId}`,
        {},
        {
          headers: {
            "x-auth-token": token,
          },
        }
      );
        let filteredData=allRides.filter(ride=>{
            ride._id!=rideId;
        })
        setUserRides(filteredData);

      toast.show({
        render: () => {
          return (
            <Box bg="green.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>Ride cancelled successfully</Text>
            </Box>
          );
        },
        placement: "top",
      });
    } catch (error) {
      console.log("Cancel ride Exception: ", error.response.data);
      setShowRides(false);
    }
  }

  useEffect(() => {
    let mounted = true;
    const getUserRides = async () => {
      try {
        const User = await AsyncStorage.getItem("User");
        const userDetails = JSON.parse(User);
        setToken(userDetails.userToken);
        const allRides = await axios.get(url + "/ride/getUserRides", {
          headers: {
            "x-auth-token": userDetails.userToken,
          },
        });
        if (mounted) {
          setUserRides(allRides.data);
          console.log("Available Rides");
          setShowRides(false);
        }
      } catch (error) {
        console.log("Rides Exception: ", error.response.data);
        setShowRides(false);
      }
    };

    getUserRides();

    return () => (mounted = false);
  }, [isFocused]);

  function allUserRides() {
    return (
      <ScrollView>
        {allRides.map((ride) => (
          <Box
            key={ride._id}
            my={5}
            mx={5}
            rounded="lg"
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
            {/* {console.log("Ride", ride.date)} */}
            <Stack
              direction={"column"}
              alignItems="center"
              space={2}
              borderRadius={10}
              p={5}
            >
              <Image
                source={{
                  uri: ride.Vehicle.vehicleImage,
                  //uri: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Swift-Dzire-Tour/8862/1646139841911/front-left-side-47.jpg?tr=h-140",
                }}
                alt="Alternate Text"
                size={"xl"}
                borderRadius={100}
                bg="red.100"
              />

              <Text fontSize={25}>{ride.vehicleNumber}</Text>
              {ride.amount > 0 ? (
                <Text fontSize={18} fontWeight="bold">
                  <FontAwesome name="rupee" size={18} color="black" />
                  {ride.amount}
                </Text>
              ) : (
                <Text fontSize={18} fontWeight="bold" color={"green.500"}>
                  Free
                </Text>
              )}

              <Box justifyContent={"flex-start"}>
                <Box>
                  <Text fontSize={18} fontWeight="bold">
                    From:
                  </Text>
                  <Text fontSize={15}>{ride.source}</Text>
                </Box>
                <Box>
                  <Text fontSize={18} fontWeight="bold" mt={2}>
                    To:
                  </Text>
                  <Text fontSize={15}>{ride.destination}</Text>
                </Box>
                <Box mt={2}>
                  <Text fontSize={18} fontWeight="bold">
                    Date:
                  </Text>
                  <Text fontSize={15}>{ride.date}</Text>
                </Box>
                <Text fontSize={18} fontWeight="bold" mt={2}>
                  Available Seats: {ride.availableSeats}
                </Text>
              </Box>
              {/* <Box display={"flex"} flexDirection={"row"} justifyContent={'space-around'}>
               
              </Box> */}
              <Stack direction={"row"} space={5}>
                <Button
                  mt={2}
                  px={5}
                  onPress={() =>
                    navigation.navigate("ViewRequest", {
                      rideId: ride._id,
                      token,
                      amount: ride.amount,
                      name: ride.User.name,
                      vehicleNumber: ride.vehicleNumber,
                    })
                  }
                  isDisabled={ride.availableSeats == 0 ? true : false}
                >
                  View Request
                </Button>

                <Button
                  mt={2}
                  px={5}
                  colorScheme="secondary"
                  isDisabled={ride.status == "Created" ? false : true}
                  onPress={() => showConfirmDialog(ride._id, ride.amount)}
                >
                  Cancel Ride
                </Button>
              </Stack>
            </Stack>
          </Box>
        ))}
      </ScrollView>
    );
  }

  if (showRides) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems={"center"}
        bg={"#F0F8FF"}
      >
        <Spinner size="lg" />
      </Box>
    );
  } else {
    return (
      <Box flex={1} alignItems={"center"} pb={"5"} bg={"#F0F8FF"}>
        <Box mt={2} w="95%">
          {allRides.length ? (
            allUserRides()
          ) : (
            <Box flex={1} justifyContent="center" alignItems={"center"}>
              <Text>No Rides!!!</Text>
            </Box>
          )}
        </Box>
      </Box>
    );
  }
};

export default RequestRides;
