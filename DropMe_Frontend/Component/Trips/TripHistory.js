import React, { useState, useEffect } from "react";
import { Box, Text, Stack, Image, Button, ScrollView } from "native-base";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { Rating, AirbnbRating } from "react-native-ratings";

const TripHistory = () => {
  const [tripDetails, setTripDetails] = useState([
    // {
    //   id:1,
    //   name: "John Doe",
    //   profileImage: "https://wallpaperaccess.com/full/317501.jpg",
    //   source: "Pune",
    //   destination: "Mumbai",
    //   pickupPoint: "Shivajinagar",
    //   tripPrice: 32423,
    //   tripCapacity: 4,
    //   date: "22 May 2022",
    //   starCount: 3,
    // },
    {
      id: 2,
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
    {
      id: 3,
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
  function getHistory() {
    return (
      <ScrollView w="95%" bg={"#F0F8FF"} m="2">
        {tripDetails.map((trip) => (
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
                uri: trip.profileImage,
              }}
              size={"xl"}
              alt="Image not found"
              borderRadius={100}
            />
            <AirbnbRating
              count={trip.ratingCount}
              reviews={["OK", "Good", "Very Good", "Wow", "Amazing"]}
              readonly={true}
              size={15}
              reviewColor={"black"}
              reviewSize={20}
              isDisabled={true}
            />
            <Stack direction={"column"} alignItems="center" space={5} m={2}>
              <Text fontSize={18} fontWeight="bold" color="black">
                Source: {trip.source}
              </Text>
              <Text fontSize={18} fontWeight="bold" color="black">
                Destination: {trip.destination}
              </Text>
              <Text fontSize={18} fontWeight="bold" color="black">
                Pickup Point: {trip.pickupPoint}
              </Text>
              <Text fontSize={18} fontWeight="bold" color="black" p={1}>
                Date: {trip.date}
              </Text>
              <Text fontSize={18} fontWeight="bold" color="black">
                <FontAwesome name="rupee" size={18} color="black" />-
                {trip.tripPrice}
              </Text>
            </Stack>
          </Box>
        ))}
      </ScrollView>
    );
  }

  // useEffect(() => {
  //   async function loadHistory(){
  //     try {
  //             console.log("Hey ");

  //             let result = await axios.get(
  //               "http://192.168.43.180:3100/notification/getNotification",
  //               {
  //                 headers: {
  //                   "x-auth-token":
  //                     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsIlVzZXIiOiI2MjZmOWZkZTRiNDRiZDQ2NGM5NzgzZjEiLCJpYXQiOjE2NTIwODI1MTl9.flvvWDWGaB78rh2HEvV9lhuiLX6d2Ap99M5naritNE4",
  //                 },
  //               }
  //             );
  //             setTripDetails(result.data);
  //             // console.log("hii ");
  //             console.log("result:", result.data);
  //           } catch (ex) {
  //             console.log("Exception", ex.response.data);
  //           }

  //   }

  // }, [])

  return (
    <Box>
      {tripDetails.length ? getHistory() : <Text>No details found</Text>}
    </Box>
  );
};

export default TripHistory;
