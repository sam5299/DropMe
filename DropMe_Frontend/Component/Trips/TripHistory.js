import React, { useState, useEffect,useContext } from "react";
import { Box, Text, Stack, Image, ScrollView } from "native-base";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Rating, AirbnbRating } from "react-native-ratings";
import axios from "axios";
import { AuthContext } from "../Context";
import Spinner from "../ReusableComponents/Spinner";
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
          setPassengerHistory(result.data);
          setToken(parseUser.userToken);
          console.log("Set done",result.data);
          setIsHistoryFetchDone(false);
        }
      } catch (ex) {
        console.log("Exception", ex.response.data);
        setIsHistoryFetchDone(false);
      }
       return () => (mounted = false);
    }

    getHistory();
    return () => (mounted = false);
  }, []);

  function getHistory() {
    return (
      <ScrollView w="95%" bg={"#F0F8FF"} m="2">
        {passengerHistory.map((trip) => (
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
                uri: trip.RaiderId.profile,
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
            </Stack>
          </Box>
        ))}
      </ScrollView>
    );
  }


  return (
    <Box>
      {isHistoryFetchingDone ? (
        Spinner
      ) : passengerHistory.length ? (
        getHistory()
      ) : (
        <Text>No details found</Text>
      )}
    </Box>
  );
};

export default TripHistory;
