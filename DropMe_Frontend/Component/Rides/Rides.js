import { View } from "react-native";
import React, { useState, useEffect, useContext } from "react";
import { Box, Text, Stack, Image, Button, ScrollView } from "native-base";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../Context";

const Rides = () => {
  const [allRides, setUserRides] = useState([]);
  const [showRides, setShowRides] = useState(true);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  useEffect(() => {
    let mounted = true;
    const getUserRides = async () => {
      try {
        const User = await AsyncStorage.getItem("User");
        const userDetails = JSON.parse(User);
        const allRides = await axios.get(url + "/ride/getUserRides", {
          headers: {
            "x-auth-token": userDetails.userToken,
          },
        });
        setUserRides(allRides.data);
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
          <Box key={ride._id} mb={5} mx={5}>
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
                  uri: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Swift-Dzire-Tour/8862/1646139841911/front-left-side-47.jpg?tr=h-140",
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
                  <Text fontSize={18} fontWeight="bold" p={1}>
                    To:
                  </Text>
                  <Text fontSize={15}>{ride.destination}</Text>
                  <Text fontSize={18} fontWeight="bold" mt={2}>
                    Seats: {ride.availableSeats}
                  </Text>
                </Box>
              </Box>
            </Stack>
          </Box>
        ))}
      </ScrollView>
    );
  }

  if (showRides) {
    return (
      <Box flex={1} justifyContent="center" alignItems={"center"}>
        <Text>Loading...!</Text>
      </Box>
    );
  } else {
    return (
      <Box flex={1} alignItems={"center"} pb={"5"}>
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

export default Rides;
