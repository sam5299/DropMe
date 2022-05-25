import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../Context";
import {
  Box,
  Stack,
  Text,
  Image,
  Button,
  ScrollView,
  useToast,
  Spinner,
} from "native-base";

const AcceptRejectRequest = ({ route, navigation }) => {
  const { rideId, token, amount, name, vehicleNumber } = route.params;
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  const [tripRequestList, setTripRequestList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  //button disable true false field
  const [buttonDisabled, setButtonDisabled] = useState(false);

  //toast field
  const toast = useToast();

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
          console.log("Accept or Reject Request");
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
    perSeatAmount,
    vehicleNumber,
    seatRequest
  ) => {
    try {
      setButtonDisabled(true);
      let amount = perSeatAmount * seatRequest;
      //  console.log(amount);
      const result = await axios.post(
        url + "/ride/acceptTripRequest",
        { tripId, rideId, raiderName, amount, vehicleNumber },
        { headers: { "x-auth-token": token } }
      );
      {
        console.log("showing toast");
      }
      toast.show({
        render: () => {
          return (
            <Box bg="green.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>Trip request accepted!</Text>
            </Box>
          );
        },
        placement: "top",
      });
      let newTripRequestList = [];
      tripRequestList.forEach((tripObj) => {
        if (
          tripObj._id != tripId &&
          tripObj.seatRequest <= result.data.remainingSeat
        ) {
          newTripRequestList.push(tripObj);
        }
      });
      setTripRequestList(newTripRequestList);

      setButtonDisabled(false);
    } catch (error) {
      console.log("Accept Request: ", error.response.data);

      toast.show({
        render: () => {
          return (
            <Box bg="red.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>Error while accepting trip!</Text>
            </Box>
          );
        },
        placement: "top",
      });
    }
  };

  const rejectRequest = async (
    tripId,
    rideId,
    raiderName,
    source,
    destination,
    passengerId
  ) => {
    try {
      setButtonDisabled(true);
      const result = await axios.put(
        url + "/ride/rejectTripRequest",
        {
          tripId,
          rideId,
          passengerId,
          raiderName,
          source,
          destination,
          passengerId,
        },
        { headers: { "x-auth-token": token } }
      );
      toast.show({
        render: () => {
          return (
            <Box bg="red.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>Trip request rejected!..!</Text>
            </Box>
          );
        },
        placement: "top",
      });

      let newTripRequestList = [];
      tripRequestList.forEach((tripObj) => {
        if (tripObj._id != tripId) {
          newTripRequestList.push(tripObj);
        }
      });
      setTripRequestList(newTripRequestList);
      setButtonDisabled(false);
    } catch (error) {
      toast.show({
        render: () => {
          return (
            <Box bg="red.400" px="10" py="3" rounded="sm">
              <Text fontSize={"15"}>{error.response.data}</Text>
            </Box>
          );
        },
        placement: "top",
      });
      setButtonDisabled(false);
      console.log("Reject Request: ", error.response.data);
    }
  };

  function viewRequest() {
    return (
      <ScrollView>
        {tripRequestList.map((list) => (
          <Box
            key={list._id}
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
            <Stack
              direction={"column"}
              alignItems="center"
              space={2}
              borderRadius={10}
              p={5}
            >
              <Image
                source={{
                  uri: list.User.profile,
                  //uri: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Swift-Dzire-Tour/8862/1646139841911/front-left-side-47.jpg?tr=h-140",
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
                  bg={"#03c03c"}
                  isDisabled={buttonDisabled}
                  onPress={() =>
                    acceptRequest(
                      list._id,
                      rideId,
                      name,
                      amount,
                      vehicleNumber,
                      list.seatRequest
                    )
                  }
                  px={5}
                >
                  <Text fontWeight={"bold"}>Accept</Text>
                </Button>
                <Button
                  bg={"#e8000d"}
                  isDisabled={buttonDisabled}
                  onPress={() =>
                    rejectRequest(
                      list._id,
                      rideId,
                      name,
                      list.source,
                      list.destination,
                      list.User._id
                    )
                  }
                  px={5}
                >
                  <Text fontWeight={"bold"}>Reject</Text>
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
        <Spinner size="lg" />
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
              <Text>No Pending Request!!!</Text>
            </Box>
          )}
        </Box>
      </Box>
    );
  }
};

export default AcceptRejectRequest;
