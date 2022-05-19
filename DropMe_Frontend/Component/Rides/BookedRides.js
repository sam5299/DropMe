import { React, useState, useEffect, useContext } from "react";
import {
  Box,
  Text,
  Stack,
  Image,
  Button,
  ScrollView,
  Divider,
  Input,
  Alert,
  VStack,
  HStack,
  IconButton,
  CloseIcon,
} from "native-base";
import { Alert as NewAlert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { AuthContext } from "../Context";

const BookedRides = ({ navigation }) => {
  const [bookedRides, setbookedRides] = useState([]);
  const [showRides, setShowRides] = useState(true);
  const [userToken, setToken] = useState(null);
  const [passengerToken, setPassengerToken] = useState("");
  const [isTripStarted, setStarted] = useState("No");
  const [showAlert, setShowAlert] = useState(false);
  const [alertField, setAlertField] = useState({
    status: "success",
    title: "",
  });
  const { getUrl } = useContext(AuthContext);
  const url = getUrl();

  let AlertField = (
    <Alert w="100%" status={alertField.status}>
      <VStack space={2} flexShrink={1} w="100%">
        <HStack flexShrink={1} space={2} justifyContent="space-between">
          <HStack space={2} flexShrink={1}>
            <Alert.Icon mt="1" />
            <Text fontSize="md" color="coolGray.800">
              {alertField.title}
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
  );

  useEffect(() => {
    let mounted = true;
    const getUserRides = async () => {
      try {
        const User = await AsyncStorage.getItem("User");
        const userDetails = JSON.parse(User);
        setToken(userDetails.userToken);
        const allRides = await axios.get(url + "/ride/getBookedRides", {
          headers: {
            "x-auth-token": userDetails.userToken,
          },
        });
        setbookedRides(allRides.data);
        // console.log("@@@", allRides.data);
        setShowRides(false);
      } catch (error) {
        console.log("Booked Rides Exception: ", error.response.data);
        setShowRides(false);
      }
    };

    getUserRides();

    return () => (mounted = false);
  }, [isTripStarted]);

  const startTrip = async (tripRideId, tripId, status, token) => {
    if (passengerToken === "" || passengerToken != token) {
      console.log(passengerToken);
      // setError(true);
      // setTimeout(() => setError(false), 3000);
      alert("Invalid token");
      return;
    }
    try {
      const result = await axios.put(
        url + "/trip/updateTripStatus",
        { tripRideId, tripId, status, token },
        { headers: { "x-auth-token": userToken } }
      );
      alert(result.data);
      setStarted("Accepted");
    } catch (error) {
      console.log("Booked Rides: ", error.response.data);
    }
  };

  const endTrip = async (tripRideId, tripId, status, token) => {
    try {
      const result = await axios.put(
        url + "/trip/updateTripStatus",
        { tripRideId, tripId, status, token },
        { headers: { "x-auth-token": userToken } }
      );
      alert(result.data);
      setStarted("Ended");
    } catch (error) {
      console.log("Booked Rides: ", error);
    }
  };

  const showConfirmDialog = (tripRideId, tripId, status, amount) => {
    return NewAlert.alert(
      "Are your sure?",
      `Canceling a ride will reduce your safety points by ${parseInt(
        amount * 0.1
      )}.\nDo you want to cancel the ride?`,
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            cancelTrip(tripRideId, tripId, status);
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };
  const cancelTrip = async (tripRideId, tripId, status) => {
    // let inp = confirmDelete();
    // if(inp){
    try {
      const result = await axios.put(
        url + "/trip/updateTripStatus",
        { tripRideId, tripId, status },
        { headers: { "x-auth-token": userToken } }
      );
      // alert(result.data);
      setAlertField({
        status: "success",
        title: "Trip cancelled successfully!",
      });
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
      }, 2000);
      setStarted("Ended");
    } catch (error) {
      console.log("Cancel Rides: ", error.response.data);
    }
  };

  function allUserRides() {
    return (
      <ScrollView>
        {bookedRides.map((ride) => (
          <Box
            key={ride._id}
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
            {console.log(ride.status, ride.token)}
            <Stack
              direction={"column"}
              alignItems="center"
              space={2}
              borderRadius={10}
              p={5}
            >
              <Image
                source={{
                  uri: ride.PassengerId.profile,
                  //uri: "https://stimg.cardekho.com/images/carexteriorimages/630x420/Maruti/Swift-Dzire-Tour/8862/1646139841911/front-left-side-47.jpg?tr=h-140",
                }}
                alt="Alternate Text"
                size={"xl"}
                borderRadius={100}
                bg="red.100"
              />
              <Text fontSize={18} fontWeight="bold">
                {ride.PassengerId.name}
              </Text>
              <Box justifyContent={"flex-start"}>
                <Text fontSize={18} fontWeight="bold">
                  From:
                </Text>
                <Text fontSize={15}>{ride.tripId.source}</Text>
                <Text fontSize={18} fontWeight="bold" >
                  To:
                </Text>
                <Text fontSize={15}>{ride.tripId.destination}</Text>

                <Text fontSize={18} fontWeight="bold" >
                  Mobile No:
                </Text>
                <Text fontSize={15}>{ride.PassengerId.mobileNumber}</Text>
                <Text fontSize={18} fontWeight="bold" >
                  Pickup Point:
                </Text>
                <Text fontSize={15}>{ride.tripId.pickupPoint}</Text>
              </Box>
              <Input
                isDisabled={ride.status === "Booked" ? false : true}
                variant={"outline"}
                keyboardType="numeric"
                placeholder="Enter the token"
                onChangeText={(value) => setPassengerToken(value)}
              />

              <Divider color={"black"} mb={2} />
              {ride.status === "Booked" ? (
                <Stack direction={"row"} space={5} mt={2}>
                  <Button
                    onPress={() =>
                      startTrip(
                        ride._id,
                        ride.tripId._id,
                        "Initiated",
                        ride.token
                      )
                    }
                    px={5}
                  >
                    Start Trip
                  </Button>
                  <Button
                    colorScheme="secondary"
                    onPress={() =>
                      showConfirmDialog(
                        ride._id,
                        ride.tripId._id,
                        "Cancelled",
                        ride.amount
                      )
                    }
                  >
                    Cancel Trip
                  </Button>
                </Stack>
              ) : (
                <Button
                  w={"100%"}
                  onPress={() =>
                    endTrip(ride._id, ride.tripId._id, "Completed", ride.token)
                  }
                >
                  End Trip
                </Button>
              )}
            </Stack>
          </Box>
        ))}
      </ScrollView>
    );
  }

  if (showRides) {
    return (
      <Box
        flex={1}
        justifyContent="center"
        alignItems={"center"}
        bg={"#F0F8FF"}
      >
        <Text>Loading...!</Text>
      </Box>
    );
  } else {
    return (
      <Box flex={1} alignItems={"center"} pb={"5"} bg={"#F0F8FF"}>
        {showAlert ? AlertField : null}
        <Box mt={2}>
          {bookedRides.length ? (
            allUserRides()
          ) : (
            <Box flex={1} justifyContent="center" alignItems={"center"}>
              <Text>No Rides!!!</Text>
            </Box>
          )}
        </Box>
      </Box>
    );
  }
};

export default BookedRides;
