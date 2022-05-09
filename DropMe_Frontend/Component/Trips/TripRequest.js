// import { View, Text } from 'react-native'
import { Box, Button, ScrollView, Text } from "native-base";
import React, { useState } from "react";

const TripRequest = () => {
  const [tripDetails, setTripDetails] = useState([
    {
      id: 1,
      source: "Pune",
      destination: "Mumbai",
      pickUpPoint: "Pimpri",
      time: "4:15 PM",
      date: "22 May 2020",
      requestCount: 3,
    },

    {
      id: 4,
      source: "Pune",
      destination: "Mumbai",
      pickUpPoint: "Pimpri",
      time: "4:15 PM",
      date: "22 May 2020",
      requestCount: 3,
    },
  ]);

  function getTripRequest() {
    return (
      <ScrollView w={"85%"} bg={"#F0F8FF"}>
        {tripDetails.map((Trip) => (
          <Box
            flex={1}
            key={Trip.id}
            display={"flex"}
            flexDirection={"column"}
            borderRadius={10}
            alignItems={"center"}
            my={10}
            p={5}
            width="100%"
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
            <Text style={textFormat}>Source : {Trip.source}</Text>
            <Text style={textFormat}>Destination : {Trip.destination}</Text>
            <Text style={textFormat}>Pickup Point : {Trip.pickUpPoint}</Text>
            <Text style={textFormat}>Date : {Trip.date}</Text>
            <Text style={textFormat}>Time : {Trip.time}</Text>
            <Text style={textFormat}>Request Count : {Trip.requestCount}</Text>

            <Button px={10} size="lg">
              <Text color={"white"}>Cancel Trip</Text>
            </Button>
          </Box>
        ))}
      </ScrollView>
    );
  }

  // useEffect(() => {
  //   async function loadNotification() {
  //     try {
  //       console.log("Hey ");

  //       let result = await axios.get(
  //         "http://192.168.43.180:3100/notification/getNotification",
  //         {
  //           headers: {
  //             "x-auth-token":
  //               "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjMsIlVzZXIiOiI2MjZmOWZkZTRiNDRiZDQ2NGM5NzgzZjEiLCJpYXQiOjE2NTIwODI1MTl9.flvvWDWGaB78rh2HEvV9lhuiLX6d2Ap99M5naritNE4",
  //           },
  //         }
  //       );
  //       setTripDetails(result.data);
  //       console.log("hii ");
  //       console.log("result:", result.data);
  //     } catch (ex) {
  //       console.log("Exception", ex.response.data);
  //     }
  //   }
  //   loadNotification();
  // }, []);

  return (
    <Box w={"100%"} alignItems={"center"} bg={"#F0F8FF"}>
      {tripDetails.length ? getTripRequest() : <Text>No request found</Text>}
    </Box>
  );
};

export default TripRequest;
const textFormat = {
  fontSize: 18,
  fontWeight: "bold",
  color: "black",
  margin: 10,
};
