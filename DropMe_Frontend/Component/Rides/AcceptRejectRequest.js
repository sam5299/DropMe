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
  Alert,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
  Spinner,
} from "native-base";

const AcceptRejectRequest = ({ route, navigation }) => {
  const { rideId, token, amount, name, vehicleNumber } = route.params;
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  const [tripRequestList, setTripRequestList] = useState([]);
  const [isLoading, setLoading] = useState(true);

  //alert box states
  const [status, setStatus] = useState({ status: "", title: "" });
  const [showAlert, setShowAlert] = useState(false);

  let AlertField = (
    <Box>
      <Alert w="100%" status={status.status}>
        <VStack space={2} flexShrink={1} w="100%">
          <HStack flexShrink={1} space={2} justifyContent="space-between">
            <HStack space={2} flexShrink={1}>
              <Alert.Icon mt="1" />
              <Text fontSize="md" color="coolGray.800">
                {status.title}
              </Text>
            </HStack>
            <IconButton
              variant="unstyled"
              _focus={{
                borderWidth: 0,
              }}
              icon={<CloseIcon size="3" color="coolGray.600" />}
            />
          </HStack>
        </VStack>
      </Alert>
    </Box>
  );

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
        url + "/ride/acceptTripRequest",
        { tripId, rideId, raiderName, amount, vehicleNumber },
        { headers: { "x-auth-token": token } }
      );
      setStatus({
        status: "success",
        title: "Trip request accepted!",
      });
      console.log("result:", result);
      setShowAlert(true);
      setTimeout(() => {
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
        setShowAlert(false);
      }, 2000);
    } catch (error) {
      console.log("Accept Request: ", error.response.data);
      setStatus({
        status: "error",
        title: "Error while accepting trip!",
      });
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
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
      console.log(result.data);
      setStatus({
        status: "error",
        title: "Trip request rejected!",
      });
      setShowAlert(true);
      setTimeout(() => {
        //add logic to remove that trip from ui
        let newTripRequestList = [];
        tripRequestList.forEach((tripObj) => {
          if (tripObj._id != tripId) {
            newTripRequestList.push(tripObj);
          }
        });
        setTripRequestList(newTripRequestList);
        setShowAlert(false);
      }, 2000);
    } catch (error) {
      setStatus({
        status: "error",
        title: error.response.data,
      });
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 3000);
      console.log("Reject Request: ", error.response.data);
    }
  };

  function viewRequest() {
    return (
      <ScrollView>
        {showAlert ? AlertField : null}
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
