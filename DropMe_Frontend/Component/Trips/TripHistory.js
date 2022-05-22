import React, { useState, useEffect, useContext } from "react";
import { Box, Text, Stack, Image, ScrollView, Spinner } from "native-base";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Rating, AirbnbRating } from "react-native-ratings";
import axios from "axios";
import { AuthContext } from "../Context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TripHistory = () => {
  const [passengerHistory, setPassengerHistory] = useState([
    {
      id: 4,
      name: "John Doe",
      profileImage: "https://wallpaperaccess.com/full/317501.jpg",
      source: "Pune",
      destination: "Mumbai",
      pickupPoint: "Shivajinagar",
      tripPrice: 32423,
      tripCapacity: 4,
      date: "22 May 2022",
      starCount: 3,
    },
  ]);
  const [vehicleDetails, setVehicle] = useState([]);
  const [userToken, setToken] = useState(null);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryFetchingDone, setIsHistoryFetchDone] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function getHistory() {
      try {
        const User = await AsyncStorage.getItem("User");
        const parseUser = JSON.parse(User);
        console.log("getting history information.");
        let result = await axios.get(url + "/trip/getPassengerHistory", {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        });
        if (mounted) {
          console.log("TripHistory object:", result.data);
          setPassengerHistory(result.data);
          setToken(parseUser.userToken);
          console.log("Set done", result.data);
          setIsHistoryFetchDone(false);
        }
      } catch (ex) {
        console.log("Exception", ex);
        setIsHistoryFetchDone(false);
      }
      return () => (mounted = false);
    }

    getHistory();
    return () => (mounted = false);
  }, []);

  function getHistory() {
    return (
      <ScrollView bg={"#F0F8FF"}>
        {passengerHistory.map((trip) => (
          <Box
            key={trip._id}
            borderRadius={10}
            display="flex"
            flexDirection={"column"}
            alignItems={"center"}
            justifyContent={"space-between"}
            p={4}
            my={10}
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
                uri: trip.RaiderId.profile,
              }}
              size={"xl"}
              alt="Image not available"
              borderRadius={100}
            />
            {trip.status === "Completed" ? (
              <AirbnbRating
                count={trip.tripRating}
                reviews={["OK", "Good", "Very Good", "Wow", "Amazing"]}
                readonly={true}
                size={15}
                reviewColor={"black"}
                reviewSize={20}
                isDisabled={true}
              />
            ) : null}

            <Stack direction={"column"} alignItems="center" space={5} m={2}>
              <Stack direction={"row"}>
                <Text fontSize={18} fontWeight="bold" color="black">
                  From:
                </Text>
                <Text fontSize={18}> {trip.tripId.source}</Text>
              </Stack>
              <Stack direction={"row"}>
                <Text fontSize={18} fontWeight="bold" color="black">
                  To:
                </Text>
                <Text fontSize={18}> {trip.tripId.destination}</Text>
              </Stack>

              <Stack direction={"row"}>
                <Text fontSize={18} fontWeight="bold" color="black">
                  Pickup Point:
                </Text>
                <Text fontSize={18}> {trip.tripId.pickupPoint}</Text>
              </Stack>

              <Stack direction={"row"}>
                <Text fontSize={18} fontWeight="bold" color="black">
                  Date:
                </Text>
                <Text fontSize={18}> {trip.tripId.date}</Text>
              </Stack>

              <Text fontSize={18} fontWeight="bold" color="black">
                <FontAwesome name="rupee" size={18} color="black" />
                {trip.amount}
              </Text>

              <Stack direction={"row"}>
                <Text fontSize={18} fontWeight="bold" color="black">
                  Status:
                </Text>
                <Text fontSize={18}> {trip.status}</Text>
              </Stack>
            </Stack>
          </Box>
        ))}
      </ScrollView>
    );
  }

  return (
    <Box flex={1} bg={"#F0F8FF"}>
      {isHistoryFetchingDone ? (
        <Box flex={1} justifyContent="center" alignItems={"center"}>
          <Spinner size="lg" />
        </Box>
      ) : passengerHistory.length ? (
        getHistory()
      ) : (
        <Box flex={1} justifyContent="center" alignItems={"center"}>
          No trips found
        </Box>
      )}
    </Box>
  );
};

export default TripHistory;
