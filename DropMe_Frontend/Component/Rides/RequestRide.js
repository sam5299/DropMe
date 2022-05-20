import React, { useState, useEffect, useContext } from "react";
import { Box, Text, Stack, Image, Button, ScrollView } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../Context";

const RequestRides = ({ navigation }) => {
  const [allRides, setUserRides] = useState([]);
  const [showRides, setShowRides] = useState(true);
  const [token, setToken] = useState(null);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

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
        setUserRides(allRides.data);
        //console.log("Ride Details:", allRides.data);
        setShowRides(false);
      } catch (error) {
        console.log("Rides Exception: ", error.response.data);
        setShowRides(false);
      }
    };

    getUserRides();

    return () => (mounted = false);
  }, []);

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
            {console.log("Ride", ride.date)}
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
              <Text fontSize={18} fontWeight="bold">
                <FontAwesome name="rupee" size={18} color="black" />
                {ride.amount}
              </Text>
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
                <Text fontSize={18} fontWeight="bold" mt={2}>
                  Available Seats: {ride.availableSeats}
                </Text>
                <Box mt={2}>
                  <Text fontSize={18} fontWeight="bold">
                    Date:
                  </Text>
                  <Text fontSize={18}>{ride.date}</Text>
                </Box>
              </Box>
              <Button
                mt={2}
                onPress={() =>
                  navigation.navigate("ViewRequest", {
                    rideId: ride._id,
                    token,
                    amount: ride.amount,
                    name: ride.User.name,
                    vehicleNumber: ride.vehicleNumber,
                  })
                }
                px={5}
              >
                View Request
              </Button>
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
        <Text>Loading...!</Text>
      </Box>
    );
  } else {
    return (
      <Box flex={1} alignItems={"center"} pb={"5"} bg={"#F0F8FF"}>
        <Box mt={2}>
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
