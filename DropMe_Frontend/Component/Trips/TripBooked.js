import { View, StyleSheet } from "react-native";
import React, { useState } from "react";
import { Box, Button, Image, ScrollView, Stack, Text } from "native-base";

const TripBooked = () => {
  const [bookedTripList, setBookedTripList] = useState([
    {
      id: 3,
      source: "Pune",
      destination: "Nagpur",
      pickupPoint: "Katraj",
      date: "12-12-2022",
      time: "1:40:00 PM",
      raider: "John Doe",
      riderImage: "https://wallpaperaccess.com/full/317501.jpg",
      raiderMobile: "7504478880",
      vehicleNumber: "MH 14 JS 3407",
      otp: "123578",
      amount: 234,
    },

    {
      id: 4,
      source: "Junnar",
      destination: "NArayangoan",
      pickupPoint: "Pune",
      date: "12-12-2022",
      time: "1:40:00 PM",
      raider: "John Smith",
      riderImage: "https://wallpaperaccess.com/full/317501.jpg",
      raiderMobile: "8482862372",
      vehicleNumber: "MH 14 JS 1452",
      otp: "853578",
      amount: 204,
    },
  ]);

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
              <Text style={styles.details}>Source: {trip.source}</Text>
              <Text style={styles.details}>
                Destination : {trip.destination}
              </Text>
              <Text style={styles.details}>
                Pickup Point: {trip.pickupPoint}
              </Text>
              <Text style={styles.details}>Date: {trip.date}</Text>
              <Text style={styles.details}>Time: {trip.time}</Text>
              <Text style={styles.details}>Amount: {trip.amount}</Text>
              <Image
                source={{
                  uri: "https://wallpaperaccess.com/full/317501.jpg",
                }}
                alt="Alternate Text"
                size="xl"
                borderRadius={100}
              />
              <Text style={styles.details}>Raider Name: {trip.raider}</Text>
              <Text style={styles.details}>
                Mobile No.: {trip.raiderMobile}
              </Text>
              <Text style={styles.details}>
                Vehicle Number: {trip.vehicleNumber}
              </Text>
              <Text style={styles.details}>OTP: {trip.otp}</Text>
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
      {bookedTripList.length ? (
        getBookedTrips()
      ) : (
        <Text>No booked trips found</Text>
      )}
      {/* {getBookedTrips()}{" "} */}
    </Box>
  );
};

export default TripBooked;

const styles = StyleSheet.create({
  details: {
    fontSize: 15,
    fontWeight: "bold",
    margin: 3,
  },
});
