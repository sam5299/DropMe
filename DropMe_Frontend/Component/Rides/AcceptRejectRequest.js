import { View } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Context";
import { Box, Stack, Text, Image, Button, ScrollView } from "native-base";

const AcceptRejectRequest = ({ route, navigation }) => {
  const { rideId, token, amount, name, vehicleNumber } = route.params;
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  const [tripRequestList, setTripRequestList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const getTripRequest = async () => {
      try {
        const requestList = await axios.get(
          `${url}/ride/getTripRequestList/${rideId}`,
          {
            headers: {
              "x-auth-token": token,
            },
          }
        );
        if (mounted) {
          console.log(requestList.data);
          setTripRequestList(requestList.data);
          setLoading(false);
        }
      } catch (error) {
        console.log("Accept Reject Request: ", error.response.data);
        setLoading(false);
      }
    };

    getTripRequest();

    return () => (mounted = false);
  }, []);

  const acceptRequest = async (
    tripId,
    rideId,
    raiderName,
    amount,
    vehicleNumber
  ) => {
    try {
      const result = await axios.post(
        url + "ride/acceptTripRequest",
        { headers: { "x-auth-token": token } },
        { tripId, rideId, raiderName, amount, vehicleNumber }
      );
      console.log(result.data);
      alert("Accepted");
    } catch (error) {
      console.log("Accept Reject Request: ", error.response);
    }
  };

  function viewRequest() {
    return (
      <ScrollView>
        {tripRequestList.map((list) => (
          <Box
            key={list._id}
            mb={5}
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
            <Stack
              direction={"column"}
              alignItems="center"
              space={2}
              borderRadius={10}
              p={5}
            >
              <Image
                source={{
                  //uri: list.User.profile,
                  uri: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Swift-Dzire-Tour/8862/1646139841911/front-left-side-47.jpg?tr=h-140",
                }}
                alt="Alternate Text"
                size={"xl"}
                borderRadius={100}
                bg="red.100"
              />
              <Text bold fontSize={25}>
                {list.User.name}
              </Text>
              <Stack direction={"column"} space={2}>
                <Box flexDir={"row"}>
                  <Text bold fontSize={18}>
                    Pickup Point:
                  </Text>
                  <Text ml={2} fontSize={18}>
                    {list.pickupPoint}
                  </Text>
                </Box>
                <Box flexDir={"row"}>
                  <Text bold fontSize={18}>
                    Seat Request:
                  </Text>
                  <Text ml={2} fontSize={18}>
                    {list.seatRequest}
                  </Text>
                </Box>
              </Stack>
              <Stack direction={"row"} space={10} mt={2}>
                <Button
                  _text={{
                    color: "white",
                  }}
                  onPress={() =>
                    acceptRequest(list._id, rideId, name, amount, vehicleNumber)
                  }
                  px={5}
                >
                  Accept
                </Button>
                <Button
                  colorScheme="secondary"
                  onPress={() => alert("Rejected..!")}
                  px={5}
                >
                  Reject
                </Button>
              </Stack>
            </Stack>
          </Box>
        ))}
      </ScrollView>
    );
  }

  if (isLoading) {
    return (
      <Box flex={1} justifyContent={"center"} alignItems={"center"}>
        Loading...!
      </Box>
    );
  } else {
    return (
      <Box flex={1} alignItems={"center"} pb={"5"} bg={"#F0F8FF"}>
        <Box mt={2}>
          {tripRequestList.length ? (
            viewRequest()
          ) : (
            <Box flex={1} justifyContent="center" alignItems={"center"}>
              <Text>No Request!!!</Text>
            </Box>
          )}
        </Box>
      </Box>
    );
  }
};

export default AcceptRejectRequest;
