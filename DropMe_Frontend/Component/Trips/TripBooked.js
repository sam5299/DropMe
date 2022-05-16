import { View, StyleSheet } from "react-native";
import React, { useState,useContext,useEffect } from "react";
import { Box, Button, Image, ScrollView, Stack, Text } from "native-base";

import axios from "axios";
import { AuthContext } from "../Context";
import Spinner from "../ReusableComponents/Spinner";
import AsyncStorage from "@react-native-async-storage/async-storage";
function TripBooked() {
  const [bookedTripList, setBookedTripList] = useState([]);
  const [userToken, setToken] = useState(null);

  const { getUrl } = useContext(AuthContext);
  const url = getUrl();
  const [isLoading, setIsLoading] = useState(false);
  const [isBookedTripFetchingDone, setIsBookedTripFetchDone] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadBookedList() {
      try {
        const User = await AsyncStorage.getItem("User");
        const parseUser = JSON.parse(User);
        console.log("getting vehicle information.");
        let result = await axios.get(url + "/trip/getBookedTrips", {
          headers: {
            "x-auth-token": parseUser.userToken,
          },
        });
        if (mounted) {
          setBookedTripList(result.data);
          setToken(parseUser.userToken);
          console.log("Setting history.",result.data);
          setIsBookedTripFetchDone(false);
        }
      } catch (ex) {
        console.log("Exception", ex.response.data);
        setIsVehicleFetchDone(false);
      }
       return () => (mounted = false);
    }

    loadBookedList();
    return () => (mounted = false);
  }, []);

  // async function loadBookedList(vehicle) {
  //   try {
  //     let result = await axios.delete(
  //       `${url}/vehicle/deleteVehicle/${vehicle.vehicleNumber}`,
  //       {
  //         headers: {
  //           "x-auth-token": userToken,
  //         },
  //       }
  //     );

  //     let newVehicle = vehicleDetails.filter(
  //       (vehicleObj) => vehicleObj._id != vehicle._id
  //     );
  //     setVehicle(newVehicle);
  //   } catch (ex) {
  //     console.log(ex.response.data);
  //   }
  // }

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

  function getBookedTrips() {
    return (
      <ScrollView w={"85%"} bg={"#F0F8FF"}>
        {bookedTripList.map((trip) => (
          <Box
            key={trip.id}
            display={"flex"}
            flexDirection={"column"}
            borderRadius={10}
            m={4}
            p={5}
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
            <Stack direction={"column"} alignItems={"center"} space={2}>
              <Text style={styles.details}>Source: {trip.tripId.source}</Text>
              <Text style={styles.details}>
                Destination : {trip.tripId.destination}
              </Text>
              <Text style={styles.details}>
                Pickup Point: {trip.tripId.pickupPoint}
              </Text>
              <Text style={styles.details}>Date: {trip.tripId.date}</Text>
              <Text style={styles.details}>Time: {trip.tripId.time}</Text>
              <Text style={styles.details}>Amount: {trip.amount}</Text>
              <Image
                source={{
                  uri:trip.RaiderId.profile ,
                }}
                alt="image not available"
                size="xl"
                borderRadius={100}
              />
              <Text style={styles.details}>Raider Name: {trip.RaiderId.name}</Text>
              <Text style={styles.details}>
                Mobile No.: {trip.RaiderId.mobileNumber}
              </Text>
              <Text style={styles.details}>
                Vehicle Number: {trip.vehicleNumber}
              </Text>
              <Text style={styles.details}>OTP: {trip.token}</Text>
              <Button size={"lg"} px={10}>
                Cancel trip
              </Button>
            </Stack>
          </Box>
        ))}
      </ScrollView>
    );
  }

  return (
    <Box w={"100%"} alignItems={"center"} bg={"#F0F8FF"}>
      {isBookedTripFetchingDone ? (
        Spinner
      ) :bookedTripList.length ? (
        getBookedTrips()
      ) : (
        <Text>No booked trips found</Text>
      )}
      {/* {getBookedTrips()}{" "} */}
    </Box>
  );
}

export default TripBooked;

const styles = StyleSheet.create({
  details: {
    fontSize: 15,
    fontWeight: "bold",
    margin: 3,
  },
});
