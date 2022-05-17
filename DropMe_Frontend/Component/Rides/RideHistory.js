import React, { useState, useEffect, useContext } from "react";
import { Box, Text, Stack, Image, ScrollView } from "native-base";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Rating, AirbnbRating } from "react-native-ratings";
import axios from "axios";
import { AuthContext } from "../Context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const RideHistory = () => {
  const [rideHistoryList, setRideHistory] = useState([]);
  const [userToken, setToken] = useState(null);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    let mounted = true;
    async function getHistory() {
      try {
        const User = await AsyncStorage.getItem("User");
        const parseUser = JSON.parse(User);
        console.log("getting history information.");
        let result = await axios.get(url + "/ride/getRaiderHistory", {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        });
        //console.log("@@2", result.data.);
        if (mounted) {
          setIsLoading(false);
          setRideHistory(result.data);
          setToken(parseUser.userToken);
          console.log("Set done", result.data);
        }
      } catch (ex) {
        console.log("Exception", ex.response.data);
        setIsLoading(false);
      }
      return () => (mounted = false);
    }

    getHistory();
    return () => (mounted = false);
  }, []);

  function getHistory() {
    return (
      <ScrollView w="95%" bg={"#F0F8FF"} m="2">
        {rideHistoryList.map((trip) => (
          <Box
            key={trip.id}
            borderRadius={10}
            display="flex"
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
            p={4}
            mb={10}
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
            <Image
              source={{
                uri: "", //trip.PassengerId.profile,
              }}
              size={"xl"}
              alt="Image not available"
              borderRadius={100}
            />
            <AirbnbRating
              count={trip.tripRating}
              reviews={["OK", "Good", "Very Good", "Wow", "Amazing"]}
              readonly={true}
              size={15}
              reviewColor={"black"}
              reviewSize={20}
              isDisabled={true}
            />
            <Stack direction={"column"} alignItems="center" space={5} m={2}>
              <Text fontSize={18} fontWeight="bold" color="black">
                Source: {trip.tripId.source}
              </Text>
              <Text fontSize={18} fontWeight="bold" color="black">
                Destination: {trip.tripId.destination}
              </Text>
              <Text fontSize={18} fontWeight="bold" color="black">
                Pickup Point: {trip.tripId.pickupPoint}
              </Text>
              <Text fontSize={18} fontWeight="bold" color="black" p={1}>
                Date: {trip.tripId.date}
              </Text>

              <Text fontSize={18} fontWeight="bold" color="black">
                <FontAwesome name="rupee" size={18} color="black" />-
                {trip.amount}
              </Text>

              <Text fontSize={18} fontWeight="bold" color="black">
                {trip.status}
              </Text>
            </Stack>
          </Box>
        ))}
      </ScrollView>
    );
  }

  if (isLoading) {
    return <Box>Loading...!</Box>;
  } else {
    return (
      <Box>
        {rideHistoryList.length ? getHistory() : <Text>No details found</Text>}
      </Box>
    );
  }
};

export default RideHistory;
